import Base from './base'
import Util from '../../util'

class Diamond extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  draw (c) {
    const shapeStyle = this.getShapeStyle()

    this._draw(c, shapeStyle)
  }

  _draw (c, s) {
    c.fillStyle = s.fill
    c.lineWidth = s.lineWidth
    c.strokeStyle = s.stroke

    c.save()
    c.beginPath()
    c.moveTo(s.x - s.width / 2, s.y)
    c.lineTo(s.x, s.y - s.height / 2)
    c.lineTo(s.x + s.width / 2, s.y)
    c.lineTo(s.x, s.y + s.height / 2)
    c.closePath()
    c.restore()

    if (s.fill) c.fill()
    if (s.stroke) c.stroke()
  }

  changePosition (x, y) {
    this._cfg.style.x = x
    this._cfg.style.y = y
  }

  changeSize (width, height) {
    this._cfg.style.width = width
    this._cfg.style.height = height
  }

  getShapeStyle () {
    const cfg = this._cfg

    const size = cfg.size

    if (Util.isArray(cfg.size)) {
      this.changeSize(size[0], size[1])
    } else {
      this.changeSize(size, size)
    }

    this.changePosition(cfg.x, cfg.y)

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