import Util from '../../util'
import getBox from './getBox'
import Layer from '../../canvas/layer';

class Item {
  constructor (cfg) {
    const defaultCfg = {
      layer: null,

      state: {},

      box: {}
    }
    this._cfg = Util.deepMix(defaultCfg, cfg)
    this._init()
    // cfg.layer.set('item', this)
    this._getBox(this)

    console.log(this)
  }

  _init () {
    this.set('layer', new Layer(this._cfg))
  }

  on (evt, callback) {
    const graph = this.get('graph')
    const eventMap = graph.get('eventMap')
    const eventItemMap = graph.get('eventItemMap')
    const e = {
      item: this,
      callback: callback
    }
    eventMap[evt] ? eventMap[evt].push(e) : eventMap[evt] = [e]

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

  _isOnlyMove(cfg) {
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
}

export default Item
