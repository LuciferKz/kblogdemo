import Base from './base'
import Util from '../../util'
import drawRound from './math/round'
import drawPolyline from './math/polyline'

class Diamond extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  draw (c) {
    let points = this.getPoints(this.get('style'))
    this._draw(c, points)
  }

  _draw (c, points) {
    if (!c) throw new Error('illegal context')
    const s = this.get('style')
    c.save()
    c.fillStyle = s.fill
    c.lineWidth = s.lineWidth
    c.strokeStyle = s.stroke
    c.beginPath()
    s.borderRadius ? drawRound(c, points, s.borderRadius) : drawPolyline(c, points, s)
    c.closePath()
    if (s.fill) c.fill()
    if (s.stroke) c.stroke()
    c.restore()
  }

  _updatePosition (x, y) {
    this._cfg.style.x = x
    this._cfg.style.y = y
  }

  changeSize (width, height) {
    this._cfg.style.width = width
    this._cfg.style.height = height
  }

  getPoints (s) {
    const PI = Math.PI
    let x = s.x - s.width / 2 + Math.cos(PI * (45 / 180)) * s.borderRadius
    let y = s.y - Math.cos(PI * (45 / 180)) * s.borderRadius

    let points = [
      { x, y },
      { x: s.x, y: s.y - s.height / 2 },
      { x: s.x + s.width / 2, y: s.y },
      { x: s.x, y: s.y + s.height / 2 },
      { x: s.x - s.width / 2, y: s.y },
    ]
    return points
  }

  getShapeStyle () {
    const cfg = this._cfg

    const size = cfg.size

    if (Util.isArray(cfg.size)) {
      this.changeSize(size[0], size[1])
    } else {
      this.changeSize(size, size)
    }

    this._updatePosition(cfg.x, cfg.y)

    let shapeStyle = {}
    
    Util.extend(shapeStyle, this.getDefaultStyle(), cfg.style)
    
    return shapeStyle
  }

  getDefaultStyle () {
    return {
      z: 0,
      width: 0,
      height: 0,
      color: "#000",
      stroke: false,
      lineWidth: 1
    }
  }

  getDefaultCfg () {
    return {
      x: 0,

      y: 0
    }
  }
}

export default Diamond