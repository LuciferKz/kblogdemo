import Base from './base'
import Util from '../../util'
import drawArrow from './math/arrow'

class Line extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor (cfg) {
    super(cfg)
  }

  draw (c) {
    this._draw(c)
  }

  _draw (c) {
    // console.log('line _draw', s)
    if (!c) throw new Error('illegal context')
    const s = this.get('style')
    const points = this.get('points')
    c.save()
    if (s.lineDash) c.setLineDash(s.lineDash)
    c.strokeStyle = s.stroke
    c.lineWidth = s.lineWidth
    c.lineJoin = s.lineJoin
    c.lineCap = s.lineCap
    c.beginPath()
    Util.each(points, (point, index) => {
      if (index === 0) {
        c.moveTo(point.x, point.y)
      } else if (index === points.length - 1 && s.arrow) {
        drawArrow(c, [points[points.length - 2], point], s)
      } else {
        c.lineTo(point.x, point.y)
      }
    })
    c.stroke()
    c.restore()
  }

  updatePoints (points) {
    this.set('points', points)
  }

  getDefaultStyle () {
    return {
      /**
       * 颜色
       * @type { string }
       */
      stroke: '#000',
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

  getShapeStyle () {
    const shapeStyle = Util.mix({}, this.getDefaultStyle(), this._cfg.style)

    return shapeStyle
  }

  getDefaultCfg () {
    return {
      points: []
    }
  }
}

export default Line
