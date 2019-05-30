import Base from './base'
import Util from '../../util'
import drawArrow from './math/arrow'
import drawPolyline from './math/polyline'

class Polyline extends Base {
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
    let points = this.get('points')
    let arrowPoints
    
    c.save()
    c.strokeStyle = s.stroke
    c.lineWidth = s.lineWidth
    c.lineJoin = s.lineJoin
    c.lineCap = s.lineCap
    c.beginPath()
    if (s.arrow) {
      arrowPoints = points.slice(-2)
      points = points.slice(0, -1)
    }
    drawPolyline(c, points)
    c.stroke()
    c.restore()
    
    if (s.arrow) drawArrow(c, arrowPoints, { lineWidth: 2, color: s.stroke })
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
    shapeStyle.arrow = this.get('arrow')
    return shapeStyle
  }

  getDefaultCfg () {
    return {
      x: 0,
      y: 0,
      /* 连接点，至少两个点 */
      points: [],
      /* 连接锚点. */
      anchors: [],
    }
  }
}

export default Polyline
