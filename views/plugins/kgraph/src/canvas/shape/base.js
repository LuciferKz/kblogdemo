import Util from '../../util'

const animateProps = [
  'width',
  'height',
  'x',
  'y'
]

class Base {
  constructor (cfg) {
    this._cfg = Util.mix(this.getDefaultCfg(), cfg)
    this.set('style', this.getShapeStyle())
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

  updatePosition (x, y) {
    this._cfg.x = x
    this._cfg.y = y
  }

  update (cfg) {
    console.log(cfg)
    this._cfg = Util.deepMix(this._cfg, cfg)
    this.set('style', this.getShapeStyle())
  }

  getDefaultCfg () {
    return {
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

  getShapeStyle () {
    return {}
  }
}

export default Base