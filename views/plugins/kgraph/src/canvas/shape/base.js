import Util from '../../util'

class Base {
  constructor (cfg) {
    const defaultCfg = {
      /**
       * 图形中心点横坐标
       */
      x: 0,

      /**
       * 图形中心点纵坐标
       */
      y: 0,

      /**
       * 画布尺寸, 数字 width, height = size. 数组 0: width 1: height 圆则为半径
       * @type { number, array }
       */
      size: 10
    }
  }

  draw () {
    // 扩展方法
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

export default Base