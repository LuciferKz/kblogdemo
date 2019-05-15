const Base = require('./base')
const Util = require('../js/util')

class Line extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor (ctx, cfg) {
    this.set('context', context)
    this.cfg = Util.extend(this.getDefaultStyleCfg(), cfg.style)
  }

  draw () {
    const context = this.context
    if (!context) throw new Error('illegal context')
    Util.extend(context, this.styleCfg)

    context.beginPath()
    Util.each(this.points, point => {
      if (index === 0) {
        context.moveTo(point.x, point.y)
      } else {
        context.lineTo(point.x, point.y)
      }
    })
    context.stroke()

  }

  getDefaultCfg () {
    return {
      points: [],

      style: {
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
}

module.exports = Line
