import Util from '../../util'
import getBox from './getBox'

class Item {
  constructor (cfg) {
    const defaultCfg = {
      layer: {},

      state: {},

      box: {}
    }
    this._cfg = Util.deepMix(defaultCfg, cfg)
    cfg.layer.set('item', this)
    this._init()
    this.set('box', getBox(this))
  }

  _init () {
    const layer = this._cfg.layer
    layer.addShape(this._cfg)
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

  get(key) {
    return this._cfg[key];
  }
}

export default Item
