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

    const source = graph.findById(this.get('source'))
    const startAnchor = this.get('startAnchor')
    const startPoint = source.getAnchorPoint(startAnchor)
    this.set('startPoint', startPoint)

    const target = graph.findById(this.get('target'))
    const endAnchor = target && this.get('endAnchor')
    const endPoint = target ? target.getAnchorPoint(endAnchor) : shape.endPoint
    this.set('endPoint', endPoint)

    return getPoints(startAnchor, endAnchor, startPoint, endPoint, this.get('arrow'))
  }

  getData () {
    const cfg = Util.pick(this._cfg, ['id', 'state', 'source', 'startAnchor', 'target', 'endAnchor', 'arrow', 'shape'])
    cfg.shape = Util.pick(cfg.shape, ['type', 'style'])
    return cfg
  }

  getPointOnDir (point) {
    let dir = '';
    let startPoint = this.get('startPoint');
    let endPoint = this.get('endPoint');
    let clientX = point.x;
    let clientY = point.y;
    let lineWidth = this.get('shape').style.lineWidth;
    if (Math.abs(clientX - startPoint.x) <= lineWidth || Math.abs(clientX - endPoint.x) <= lineWidth) {
      dir = 'V';
    } else if (Math.abs(clientY - startPoint.y) <= lineWidth || Math.abs(clientY - endPoint.y) <= lineWidth) {
      dir = 'H';
    }
    return dir;
  }
  
  getPathPart (point) {
    let points = this.get('shape').points;
    let clientX = point.x;
    let clientY = point.y;
    let range = this.get('shape').style.lineWidth
    let part;

    for (let i = 0, len = points.length; i < len; i++) {
      let p1 = points[i];
      let p2 = points[i + 1];
      if (!p2) break;
      if (Math.abs(clientX - p1.x) <= range && Math.abs(clientX - p2.x) <= range ||
      Math.abs(clientY - p1.y) <= range && Math.abs(clientY - p2.y) <= range) {
        part = [p1, p2];
        break;
      }
    }
    
    return part;
  }

  getMidPoint (part) {
    let p1 = part[0]
    let p2 = part[1]
    let midX = p1.x
    let midY = p1.y
    if (p1.x === p2.x) {
      midY = (p1.y - p2.y) / 2 + p2.y
    } else if (p1.y === p2.y) {
      midX = (p1.x - p2.x) / 2 + p2.x
    }
    return { x: midX, y: midY }
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

  _getDefaultCfg () {
    return {
      state: {},

      source: null,

      target: null,
      // 是否有箭头
      arrow: false,

      startAnchor: [],

      endAnchor: [],

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
