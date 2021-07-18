import Util from "../../util";
import newElement from '../../util/dom/new-element';

class ElementInjector {
  constructor (cfg) {
    const defaultCfg = {
      el: null
    }
    this._cfg = Util.mix({}, defaultCfg, cfg)
    this.init()
  }

  init () {
    
  }

  set (key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get (key) {
    return this._cfg[key];
  }
}

export default ElementInjector