import Base from './base'
import Util from '../../util'

class Line extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor (cfg) {
    super()
    const defaultCfg = {
      points: []
    }
    this._cfg = Util.extend(defaultCfg, cfg)
  }

  draw (ctx) {
    this._cfg.style = Util.extend(this.getDefaultStyle(), this._cfg.style)

    this._draw(ctx)
  }

  _draw (ctx) {
    if (!ctx) throw new Error('illegal context')
    Util.extend(ctx, this.styleCfg)

    ctx.beginPath()
    Util.each(this.points, point => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()
  }

  getDefaultStyle () {
    return {
      /**
       * 颜色
       * @type { string }
       */
      strokeStyle: '#000',
      /**
       * 线宽
       * @type { number }
       */
      lineWidth: 2,
      /**
       * 拐角类型 miter bevel round
       * @type { string }
       */
      lineJoin: "miter",
      /**
       * 结束线帽 butt square round
       * @type { string }
       */
      lineCap: "butt"
    }
  }
}

export default Line
