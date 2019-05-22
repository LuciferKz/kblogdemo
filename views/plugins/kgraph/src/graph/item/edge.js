import Util from '../../util'
import Item from './index'

class Edge extends Item {
  constructor (cfg) {
    super(cfg)
  }

  _init () {
    // console.log('edge', this, this._cfg)
    const graph = this.get('graph')
    graph.addShape(this)
  }

  getDefaultCfg () {
    return {
      state: {},

      source: null,

      target: null,

      shape: {

        startPoint: {},

        endPoint: {}

      }
    }
  }
  
  _getShapeCfg () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.points = points
    return shape
  }

  _getPoints () {
    const graph = this.get('graph')
    const source = graph.findById(this.get('source'))
    const target = graph.findById(this.get('target'))
    const shape = this.get('shape')
    let startPoint = shape.startPoint
    let endPoint = shape.endPoint

    if (source) {
      const startAnchor = source.findAnchorById(this.get('startAnchor'))
      startPoint = startAnchor ? source.getAnchorPoint(startAnchor.get('m')) : shape.startPoint
      // console.log(startAnchor)
    }

    if (target) {
      const endAnchor = target.findAnchorById(this.get('endAnchor'))
      endPoint = endAnchor ? target.getAnchorPoint(endAnchor.get('m')) : shape.endPoint
      // console.log(endAnchor)
    }
    
    // console.log(startPoint, endPoint)

    const x1 = startPoint.x
    const y1 = startPoint.y
    const x2 = endPoint.x
    const y2 = endPoint.y

    const points = [startPoint]
    if (x1 < x2 && y1 < y2) {
      points.push({ x: x1, y: y2 })
    }
    points.push(endPoint)
    return points
  }
  
  updatePath () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.points = points
    this.updateShape()
  }

  update (cfg) {
    const shape = this.getShapeCfg()
    Util.mix(shape, cfg)
    this.updateShape()
  }
}

export default Edge
