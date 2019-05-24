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
    this._cfg = Util.deepMix(this._cfg, cfg)
    this.set('style', this.getShapeStyle())
  }

  // animate (name, value) {
  //   const shapeStyle = this.getShapeStyle()
    
  //   if (Util.isArray(name)) {
  //     let props = name
  //     Util.each(props, (name, value) => {

  //     })
  //   } else {
  //     let b = shapeStyle[name]
  //     if (!b) console.error(`属性${name}不存在`)
  //     let t = 0
  //     let d = 1000
  //     let c = value - b
  //     let v = b
  //     let interval = setInterval(() => {
  //       if (t < c) {
  //         t = t + 1000 / 60
  //         v = Util.linear(t, c, d, b)
  //       } else {
  //         v = value
  //         clearInterval(interval)
  //       }
  //       shapeStyle[name] = v
  //     }, 1000 / 60)
  //   }
  // }

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
}

export default Base