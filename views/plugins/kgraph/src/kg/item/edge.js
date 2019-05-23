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
    const shape = this.get('shape')

    const startAnchorId = this.get('startAnchor')
    const startAnchor = graph.findById(startAnchorId)
    const startMatrix = startAnchor.get('m')
    const startPoint = startAnchor ? startAnchor.getAnchorPoint() : shape.startPoint

    const endAnchorId = this.get('endAnchor')
    const endAnchor = graph.findById(endAnchorId)
    const endMatrix = endAnchor ? endAnchor.get('m') : []
    const endPoint = endAnchor ? endAnchor.getAnchorPoint() : shape.endPoint

    return getPoints(startMatrix, endMatrix, startPoint, endPoint)
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
