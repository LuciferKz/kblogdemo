import Util from '../../util'
import { guid } from '../util';
import getBox from '../util/getBox'
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

    const shapeCfg = Util.clone(this.getShapeCfg())
    const stateShapeMap = this.get('stateShapeMap')
    if (stateShapeMap && !stateShapeMap.default) stateShapeMap.default = shapeCfg
    let shape = canvas.addShape(shapeCfg)
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

    eventMap[evt] ? eventMap[evt].push(e) : eventMap[evt] = [e]
    const id = this.get('id')
    if (!eventItemMap[id]) eventItemMap[id] = {}
    eventItemMap[id][evt] = e
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

  // _initOutline () {
  //   const defaultCfg = {
  //     x: this._cfg.x,
  //     y: this._cfg.y,
  //     hidden: true
  //   }

  //   const outlineCfg = Util.mix({}, defaultCfg, this.get('outlineCfg'))
  //   this.set('outlineCfg', outlineCfg)
  //   const graph = this.get('graph')
  //   const shapeId = graph.addShape(outlineCfg)
  //   this.set('outline', shapeId)
  // }

  update (cfg) {
    const originPosition = { x: this._cfg.x, y: this._cfg.y }
    // 获取shape配置，并完成节点内置状态改动的更新
    const shape = this.getShapeCfg()

    Util.mix(shape, cfg)
    
    const isOnlyMove = this._isOnlyMove(cfg)

    if (isOnlyMove) {
      this.updatePosition(shape)
    } else {
      if (originPosition.x !== shape.x || originPosition.y !== shape.y) {
        this.updatePosition(shape)
      }
      this.updateShape()
    }
    const graph = this.get('graph')

    graph.autoPaint()
  }

  updatePosition (cfg) {
    const graph = this.get('graph')
    this._cfg.x = cfg.x
    this._cfg.y = cfg.y
    const shapeMap = graph.get('shapeMap')
    const layer = shapeMap[this.get('id')]
    const shape = layer.get('shape') ? layer.get('shape') : layer
    shape.updatePosition(cfg.x, cfg.y)
  }

  updateShape () {
    const shapeCfg = this.get('shape')
    const shape = this.getShape()
    shape.update(shapeCfg)
    this.get('graph').autoPaint()
  }

  getShapeCfg () {
    return this._getShapeCfg()
  }

  _getShapeCfg () {
    return this.get('shape')
  }
  
  getBox () {
    const shape = this.get('shape')
    const box = getBox(shape)
    this.set('box', box)
    return box
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

  isPointIn (point) {
    return isPointIn(this, point)
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  setState (key, val) {
    const state = this.get('state')
    state[key] = val
  }

  get(key) {
    return this._cfg[key];
  }

  show () {
    this.set('hidden', false)
    const shape = this.getShape()
    shape.update({ hidden: false })
  }

  hide () {
    this.set('hidden', true)
    const shape = this.getShape()
    shape.update({ hidden: true })
  }

  getShape () {
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    const id = this.get('id')
    const shape = shapeMap[id]
    return shape
  }
  
  getDefaultCfg () {
    return {
      state: {},

      box: {},

      parent: '',

      shape: {}
    }
  }
}

export default Item
