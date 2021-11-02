import Base from "./base";
import Util from "../../util";
import drawRound from "./math/round";

class Rect extends Base {
  constructor(cfg) {
    super(cfg);
  }

  draw(c) {
    const shapeStyle = this.get("style");
    this._draw(c, shapeStyle);
  }

  _draw(c, s) {
    c.save();
    if (s.lineDash) c.setLineDash(s.lineDash);
    c.beginPath();
    c.fillStyle = Util.isFunction(s.fill) ? s.fill(c, s) : s.fill;
    c.strokeStyle = s.stroke;
    c.lineWidth = s.lineWidth;
    if (s.borderRadius) {
      drawRound(c, this.getPoints(s), s.borderRadius);
      c.closePath();
      if (s.stroke) c.stroke();
      if (s.fill) c.fill();
    } else {
      if (s.fill) {
        c.fillRect(s.x, s.y, s.width, s.height);
      }
      if (s.stroke) {
        c.strokeRect(s.x, s.y, s.width, s.height);
      }
    }
    c.restore();
  }

  _updatePosition(x, y) {
    this._cfg.style.x = x;
    this._cfg.style.y = y;
  }

  _updateSize(width, height) {
    this._cfg.style.width = width;
    this._cfg.style.height = height;
  }

  getPoints(s) {
    let x = s.x;
    let y = s.y;
    let r = s.borderRadius;
    let width = s.width;
    let height = s.height;
    let points = [
      { x: x + r, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y },
    ];
    return points;
  }

  getDefaultCfg() {
    return {
      x: 0,

      y: 0,

      size: [],
    };
  }

  getPosition() {
    const cfg = this._cfg;
    return {
      x: cfg.x - cfg.style.width / 2,
      y: cfg.y - cfg.style.height / 2,
    };
  }

  getShapeStyle() {
    const cfg = this._cfg;

    const size = cfg.size;

    if (Util.isArray(cfg.size)) {
      this._updateSize(size[0], size[1]);
    } else {
      this._updateSize(size, size);
    }

    let shapeStyle = {};

    Util.extend(
      shapeStyle,
      this.getDefaultStyle(),
      cfg.style,
      this.getPosition()
    );

    return shapeStyle;
  }

  getDefaultStyle() {
    return {
      z: 0,

      width: 0,

      height: 0,

      color: "#000",

      stroke: false,

      lineWidth: 1,

      lineDash: null,
    };
  }
}

export default Rect;
