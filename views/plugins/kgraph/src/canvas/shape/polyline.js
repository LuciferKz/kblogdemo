import Base from './base'
import Util from '../../util'

class Polyline extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor (cfg) {
    super()
    const defaultCfg = {
      points: []
    }
    this._cfg = Util.mix(defaultCfg, cfg)
  }

  draw (c) {
    const shapeStyle = this.getShapeStyle()

    this._draw(c, shapeStyle)
  }

  _draw (c, s) {
    // console.log('line _draw', s)
    if (!c) throw new Error('illegal context')
    const points = this.get('points')

    c.strokeStyle = s.stroke
    c.lineWidth = s.lineWidth
    c.lineJoin = s.lineJoin
    c.lineCap = s.lineCap
    c.beginPath()
    Util.each(points, (point, index) => {
      if (index === 0) {
        c.moveTo(point.x, point.y)
      } else {
        c.lineTo(point.x, point.y)
      }
    })
    c.stroke()
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
}

export default Polyline
