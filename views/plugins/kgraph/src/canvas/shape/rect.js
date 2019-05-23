import Base from './base'
import Util from '../../util'

class Rect extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  draw (c) {
    this._cfg.shapeStyle = this.getShapeStyle()

    this._draw(c)
  }

  _draw (c) {
    const s = this._cfg.style
    if (s.fill) {
      c.fillStyle = s.fill;
      c.fillRect(s.x, s.y, s.width, s.height);
    }
    if (s.stroke) {
      c.lineWidth = s.lineWidth;
      c.strokeStyle = s.stroke;
      c.strokeRect(s.x, s.y, s.width, s.height);
    }
  }

  _updatePosition (x, y) {
    this._cfg.style.x = x
    this._cfg.style.y = y
  }

  _updateSize (width, height) {
    this._cfg.style.width = width
    this._cfg.style.height = height
  }

  getDefaultCfg () {
    return {
      x: 0,

      y: 0
    }
  }

  getShapeStyle () {
    const cfg = this._cfg

    const size = cfg.size

    if (Util.isArray(cfg.size)) {
      this._updateSize(size[0], size[1])
    } else {
      this._updateSize(size, size)
    }

    this._updatePosition(cfg.x - cfg.style.width / 2, cfg.y - cfg.style.height / 2)

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
}

export default Rect