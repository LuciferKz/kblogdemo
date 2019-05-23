import Base from './base'
import Util from '../../util'

class Circle extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  draw (c) {
    const shapeStyle = this.getShapeStyle()

    this._draw(c, shapeStyle)
  }

  _draw (c, s) {
    c.save();
    c.lineWidth = s.lineWidth
    c.strokeStyle = s.stroke
    c.fillStyle = s.fill
    c.beginPath()
    c.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    if (s.fill) c.fill();
    if (s.stroke) c.stroke();
    c.restore();
  }

  changePosition (x, y) {
    this._cfg.style.x = x
    this._cfg.style.y = y
  }

  changeSize (r) {
    this._cfg.style.r = r
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

export default Circle