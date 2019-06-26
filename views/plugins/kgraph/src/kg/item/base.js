import Util from '../../util'
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
    let shapeCfg =  Util.mix(this.getDefaultShapeCfg(), this.getShapeCfg())
    shapeCfg.hidden = this.get('hidden')
    graph.addShape(shapeCfg)
    this.getBox()
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

  emit (evt) {
    const graph = this.get('graph')
    const eventItemMap = graph.get('eventItemMap')
    const id = this.get('id')
    const eventItems = eventItemMap[id]
    if (!eventItems) return false
    const event = eventItems[evt]
    if (!event) return false
    const callback = event.callback
    const arg = [].slice.call(arguments, 1)
    callback.apply(this, arg)
  }

  update (cfg = {}) {
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
      if (cfg.width || cfg.height || cfg.r || cfg.size) {
        this.updateSize(shape)
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
    shape.update({ x: cfg.x, y: cfg.y })
  }

  updateSize (cfg) {
    if (cfg.width || cfg.height) {
      if (Util.isArray.shape.size) {
        cfg.size[0] = cfg.width
        cfg.size[1] = cfg.height
      } else if (cfg.width) {
        cfg.size = cfg.width
      } else if (cfg.height) {
        cfg.size = cfg.height
      }
    } else if (cfg.r) {
      cfg.size = cfg.r
    }
  }

  updateShape () {
    const shapeCfg = this.get('shape')
    const shape = this.getShape()
    shape.update(shapeCfg)
    this.get('graph').autoPaint()
  }

  changeLabel (text) {
    const graph = this.get('graph')
    const labelId = this.get('labelId')
    const shapeMap = graph.get('shapeMap')
    shapeMap[labelId].update({
      content: text
    })
    graph.autoPaint()
  }

  getShapeCfg () {
    return this._getShapeCfg()
  }

  _getShapeCfg () {
    const shape = this.get('shape')
    Util.mix(shape, {
      x: this._cfg.x,
      y: this._cfg.y
    })
    return shape
  }
  
  getBox () {
    const shape = this.get('shape')
    const box = getBox(shape)
    this.set('box', box)
    return box
  }
  
  _isOnlyMove (cfg) {
    if (!cfg) return false
    const existX = !Util.isNil(cfg.x)
    const existY = !Util.isNil(cfg.y)
    const keys = Object.keys(cfg)
    return (keys.length === 1 && (existX || existY)) || (keys.length === 2 && existX && existY)
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

  get(key) {
    return this._cfg[key];
  }

  setState (key, val) {
    const state = this.get('state');
    const graph = this.get('graph');
    state[key] = val;
    const stateShapeMap = this.get('stateShapeMap');

    if (stateShapeMap) {
      let shapeCfg = Util.deepMix(this.getDefaultShapeCfg(), stateShapeMap.default)
      Util.each(state, (value, name) => {
        if (value) {
          Util.deepMix(shapeCfg, stateShapeMap[name])
        }
      })
      const style = shapeCfg.style
      if (style.transition) {
        Util.each(style.transition.property, prop => {
          graph.$animate.add(Util.mix({}, style.transition, {
            shape: this.getShape(),
            property: prop,
            value: prop === 'size' ? shapeCfg.size : style[prop]
          }))
        })
      } else if (shapeCfg) {
        let shape = this.get('shape')
        Util.deepMix(shape, shapeCfg)
        this.updateShape()
      }
    }
    this.emit('stateChange', key, val, state);
  }

  show () {
    const graph = this.get('graph')
    this.set('hidden', false)
    const shape = this.getShape()
    shape.update({ hidden: false })
    graph.paint()
  }

  hide () {
    const graph = this.get('graph')
    this.set('hidden', true)
    const shape = this.getShape()
    shape.update({ hidden: true })
    graph.paint()
  }

  getShape () {
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    const id = this.get('id')
    const shape = shapeMap[id]
    return shape
  }
  
  getDefaultCfg () {
    const defaultCfg = {
      state: {},

      box: {},

      parent: '',

      shape: {},

      alwaysShow: true
    }
    return Util.mix(defaultCfg, this._getDefaultCfg())
  }

  _getDefaultCfg () {
    return {
      
    }
  }

  getDefaultShapeCfg () {
    const graph = this.get('graph')
    const parentId = this.get('parent')
    const shapeMap = graph.get('shapeMap')
    const layer = shapeMap[parentId]

    return {
      id: this.get('id'),

      parent: layer
    }
  }

  hasParent (id) {
    const graph = this.get('graph')
    let parent = this.get('parent')
    let result = false
    while (parent) {
      if (parent === id) {
        result = true
        break
      }
      parent = graph.findById(parent).get('parent')
    }
    return result
  }
}

export default Item
