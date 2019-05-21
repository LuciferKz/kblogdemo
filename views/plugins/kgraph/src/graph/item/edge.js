import Util from '../../util'
import Item from './index'
import Layer from '../../canvas/layer'

class Edge extends Item {
  constructor (cfg) {
    super(cfg)
  }

  init (cfg) {
    this._cfg = Util.deepMix({}, this.getDefaultCfg(), cfg)
    this._init()
  }

  _init () {
    // console.log('edge', this, this._cfg)
    const graph = this.get('graph')
    graph.addShape(this)
  }

  updatePosition (cfg) {
  }

  getDefaultCfg () {
    return {
      state: {},

      source: null,

      target: null,

      startPoint: {},

      endPoint: {},
    }
  }

  getShapeCfg () {
    const cfg = this._cfg
    const points = this._getPoints()
    return {
      x: cfg.x,

      y: cfg.y,

      type: cfg.type,

      style: cfg.style,

      points
    }
  }

  _getPoints () {
    const startAnchor = this.get('startAnchor')
    const endAnchor = this.get('endAnchor')
    const graph = this.get('graph')
    const source = graph.findById(this.get('source'))
    const target = graph.findById(this.get('target'))
    
    const startPoint = startAnchor ? source.getAnchorPoint(startAnchor) : this.get('startPoint')
    const endPoint = endAnchor ? target.getAnchorPoint(endAnchor) : this.get('endPoint')

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
  
  updatePoints (cfg) {
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    const id = this.get('id')
    if (cfg.startPoint) this.set('startPoint', cfg.startPoint)
    if (cfg.endPoint) this.set('endPoint', cfg.endPoint)
    shapeMap[id].updatePoints(this._getPoints())
    graph.autoPaint()
  }

  update (cfg) {
    const _cfg = this._cfg
    Util.mix(_cfg, cfg)

    if (_cfg.startPoint || _cfg.endPoint) {
      this.updatePoints(_cfg)
    }

    if (_cfg.endAnchor) {
      this.set('endAnchor', _cfg.endAnchor)
    }

    this.updateShape()
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  setState (key, val) {
    this._cfg.state[key] = val;
  }

  get(key) {
    return this._cfg[key];
  }
}

export default Edge
