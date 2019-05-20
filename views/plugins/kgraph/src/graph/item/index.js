import Util from '../../util'
import getBox from './getBox'

class Item {
  constructor (cfg) {
    this.init(cfg)
  }

  init (cfg) {
    this._cfg = Util.deepMix({}, this.getDefaultCfg(), cfg)
    this._getBox(this)
    this._init()
  }

  _init () {
    const graph = this.get('graph')
    const canvas = graph.get('canvas')

    let shape = canvas.addShape(this.getShapeCfg())

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape
  }

  on (evt, callback, option) {
    const graph = this.get('graph')
    const eventMap = graph.get('eventMap')
    const eventItemMap = graph.get('eventItemMap')
    const e = {
      item: this,
      callback: callback,
      option,
      children: []
    }

    let parentE = null
    let parent = this.get('parent')
    while (parent && !parentE) {
      if (eventItemMap[parent]) parentE = eventItemMap[parent][evt]
      // console.log(parent, graph, eventItemMap)
      parent = graph.findById(parent).get('parent')
    }
    
    if (parentE) {
      parentE.children.push(e)
    } else {
      eventMap[evt] ? eventMap[evt].push(e) : eventMap[evt] = [e]
    }

    const id = this.get('id')
    if (!eventItemMap[id]) eventItemMap[id] = {}
    eventItemMap[id][evt] = e

    console.log(eventMap, eventItemMap)
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get(key) {
    return this._cfg[key];
  }

  setState (key, val) {
    this._cfg.state[key] = val;
  }

  _getBox () {
    const box = getBox(this)
    this.set('box', box)
    return box
  }

  updatePosition (cfg) {
    const graph = this.get('graph')
    this._cfg.x = cfg.x
    this._cfg.y = cfg.y
    const shapeMap = graph.get('shapeMap')
    const shape = shapeMap[this.get('id')]
    shape.updatePosition(cfg.x, cfg.y)
  }

  update (cfg) {
    // console.log('update anchor', cfg)
    const shape = cfg.shape
    const newCfg = Util.mix({}, this._cfg, cfg)
    const isOnlyMove = this._isOnlyMove(cfg)

    if (isOnlyMove) {
      this.updatePosition(newCfg)
    }
  }

  _isOnlyMove (cfg) {
    if (!cfg) {
      return false;
    }
    const existX = !Util.isNil(cfg.x);
    const existY = !Util.isNil(cfg.y);
    const keys = Object.keys(cfg);
    return (keys.length === 1 && (existX || existY)) || (keys.length === 2 && existX && existY);
  }

  getDefaultCfg () {
    return {
      state: {},

      box: {},

      parent: ''
    }
  }

  getShapeCfg () {
    const cfg = this._cfg
    return {
      type: cfg.type,

      x: cfg.x,

      y: cfg.y,

      size: cfg.size,

      style: cfg.style
    }
  }
}

export default Item
