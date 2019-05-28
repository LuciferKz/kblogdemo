import Util from '../../util'
import Base from './base'
import getPoints from '../util/getPoints'

class Edge extends Base {
  constructor (cfg) {
    super(cfg)
  }

  _init () {
    super._init()
  }
  
  _getShapeCfg () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.arrow = this.get('arrow')
    shape.points = points
    return shape
  }

  _getPoints () {
    const graph = this.get('graph')
    const shape = this.get('shape')

    const startAnchorId = this.get('startAnchor')
    const startAnchor = graph.findById(startAnchorId)
    const startMatrix = startAnchor.get('m')
    const startPoint = startAnchor ? startAnchor.getAnchorPoint() : shape.startPoint
    this.set('startPoint', startPoint)

    const endAnchorId = this.get('endAnchor')
    const endAnchor = graph.findById(endAnchorId) && graph.findById(endAnchorId).get('type') === 'anchor' ? graph.findById(endAnchorId) : null
    const endMatrix = endAnchor ? endAnchor.get('m') : []
    const endPoint = endAnchor ? endAnchor.getAnchorPoint() : shape.endPoint
    this.set('endPoint', endPoint)

    return getPoints(startMatrix, endMatrix, startPoint, endPoint, this.get('arrow'))
  }
  
  updatePath () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.points = points
    shape.arrow = this.get('arrow')
    this.updateShape()
  }

  update (cfg) {
    const shape = this.getShapeCfg()
    Util.mix(shape, cfg)
    this.updateShape()
  }

  getDefaultCfg () {
    return {
      state: {},

      source: null,

      target: null,
      // 是否有箭头
      arrow: false,

      shape: {

        startPoint: {},

        endPoint: {}

      }
    }
  }

  getDefaultShapeCfg () {
    const graph = this.get('graph')

    return {
      id: this.get('id'),

      parent: graph.get('edgeLayer')
    }
  }
}

export default Edge
