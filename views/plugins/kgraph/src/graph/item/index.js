import Util from '../../util'
import getBox from './getBox'
import { guid } from '../util';
import isPointIn from '../event/util/isPointIn'

class Item {
  constructor (cfg) {
    this.init(cfg)
  }

  init (cfg) {
    this._cfg = Util.deepMix(this.getDefaultCfg(), cfg)
    this._init()
  }

  _init () {
    const graph = this.get('graph')
    const canvas = graph.get('canvas')

    const shapeCfg = this.getShapeCfg()
    let shape = canvas.addShape(shapeCfg)
    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    this._getBox()
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

    // console.log(eventMap, eventItemMap)
  }

  emit (evt, e) {
    const graph = this.get('graph')
    const eventItemMap = graph.get('eventItemMap')
    const id = this.get('id')
    const eventItems = eventItemMap[id]
    if (!eventItems) return false
    const event = eventItems[evt]
    if (!event) return false
    const callback = event.callback
    callback.apply(this, [e, event])
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
    const shape = this.get('shape')
    const box = getBox(shape)
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
    graph.autoPaint()
  }

  update (cfg) {
    const originPosition = { x: this._cfg.x, y: this._cfg.y };
    const shape = this.get('shape')
    Util.mix(shape, cfg)
    const isOnlyMove = this._isOnlyMove(cfg)

    if (isOnlyMove) {
      this.updatePosition(shape)
    } else {
      if (originPosition.x !== shape.x || originPosition.y !== shape.y) {
        this.updatePosition(shape);
      }
      this.updateShape();
    }
  }

  updateShape () {
    const graph = this.get('graph')
    const shapeCfg = this.getShapeCfg()
    const shapeMap = graph.get('shapeMap')
    const shape = shapeMap[this.get('id')]
    shape.update(shapeCfg)
    graph.autoPaint()
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

      parent: '',

      shape: {}
    }
  }

  getShapeCfg () {
    const shape = this.get('shape')
    shape.x = this._cfg.x
    shape.y = this._cfg.y
    return shape
  }

  isPointIn (point) {
    return isPointIn(this, point)
  }
}

export default Item
