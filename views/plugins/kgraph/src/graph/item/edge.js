import Util from '../../util'
import getBox from './getBox'
import Item from './index'

class Node extends Item {
  constructor (cfg) {
    const defaultCfg = {
      state: {},

      box: {},

      parent: '',

      children: [],

      anchorPoints: []
    }
    this._cfg = Util.deepMix(defaultCfg, cfg)
    this._getBox(this)
    this._init()
  }

  _init () {
    const graph = this.get('graph')
    const canvas = graph.get('canvas')

    let shape
    if (type === 'node') {
      shape = canvas.addLayer(new Layer(item.getShapeCfg()))
    } else if (type === 'anchor') {
      shape = canvas.addShape(item.getShapeCfg())
    }

    const shapeMap = this.get('shapeMap')
    shapeMap[item.get('id')] = shape

    this._initAnchors()
  }

  _initAnchors (cfg) {
    const anchors = this.get('anchors')
    const anchorCfg = this.get('anchorCfg')
    const box = this.get('box')
    const anchorPoints = this.get('anchorPoints')
    const graph = this.get('graph')

    Util.each(anchors, anchor => {
      let x = box.l + box.width * anchor[0]
      let y = box.t + box.height * anchor[1]

      let newAnchorCfg = Util.deepMix({ x, y }, this.getDefaultAnchorCfg(), anchorCfg)
      let _anchor = graph.addItem('anchor', newAnchorCfg)
      anchorPoints.push(_anchor.get('id'))
    })
  }

  on (evt, callback, cfg) {
    const graph = this.get('graph')
    const eventMap = graph.get('eventMap')
    const eventItemMap = graph.get('eventItemMap')
    const e = {
      item: this,
      callback: callback,
      cfg
    }
    eventMap[evt] ? eventMap[evt].unshift(e) : eventMap[evt] = [e]

    const id = this.get('id')
    if (!eventItemMap[id]) eventItemMap[id] = {}
    eventItemMap[id][evt] = e
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

  _getBox () {
    const box = getBox(this)
    this.set('box', box)
  }

  updatePosition (cfg) {
    this._cfg.x = cfg.x
    this._cfg.y = cfg.y
    const shape = this.get('layer').shape
    shape.updatePosition(cfg.x, cfg.y)
    this._getBox()
  }

  update (cfg) {
    const shape = cfg.shape
    const newCfg = Util.mix({}, this._cfg, cfg)
    const isOnlyMove = this._isOnlyMove(cfg)

    if (isOnlyMove) {
      this.updatePosition(newCfg)
    }
  }

  _isOnlyMove (cfg) {
    if (!cfg) {
      return false; // 刷新时不仅仅移动
    }
    // 不能直接使用 cfg.x && cfg.y 这类的判定，因为 0 的情况会出现
    const existX = !Util.isNil(cfg.x);
    const existY = !Util.isNil(cfg.y);
    const keys = Object.keys(cfg);
    return (keys.length === 1 && (existX || existY)) // 仅有一个字段，包含 x 或者 包含 y
      || (keys.length === 2 && existX && existY); // 两个字段，同时有 x，同时有 y
  }

  getDefaultAnchorCfg () {
    return {
      type: 'circle',

      size: 5,

      style: {
        lineWidth: 2,

        stroke: '#CCC',

        fill: '#FFF'
      },

      parent: this.get('id')
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
