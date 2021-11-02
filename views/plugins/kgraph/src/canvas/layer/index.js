import Util from "../../util";
import ShapeFactory from "../shape";

class Layer {
  constructor(cfg) {
    this.children = [];

    const _cfg = Util.mix(this.getDefaultCfg(), cfg);

    const shape = ShapeFactory(_cfg);
    _cfg.shape = shape;

    if (_cfg.layer) {
      _cfg.layer.addLayer(this);
    }

    this._cfg = _cfg;
  }

  _init() {}

  draw(ctx) {
    if (this.get("hidden")) return;
    ctx.save();
    this._drawLayer(ctx);
    this._draw(ctx);
    ctx.restore();
  }

  _drawLayer(ctx) {
    //   if (_shape._cfg.isGuid) {
    //     const shapeStyle = _shape.getShapeStyle()
    //     console.log(shapeStyle)
    //     ctx.translate(shapeStyle.x, shapeStyle.y)
    //     _shape.changePosition(0, 0)
    //   }

    const shape = this.get("shape");
    if (shape && !shape.get("hidden")) {
      shape.draw(ctx);
    }
  }

  _draw(ctx) {
    const layer = this;
    Util.each(layer.children, (child) => {
      !child.get("hidden") && child.draw(ctx);
    });
  }

  add(s) {
    s.parent = this;
    this.children.push(s);
  }

  remove(s) {
    const index = this.children.indexOf(s);
    this.children.splice(index, 1);
  }

  update(cfg) {
    const shape = this.get("shape");
    Util.deepMix(shape._cfg, cfg);
    shape.set("style", shape.getShapeStyle());
  }

  updateLayer(cfg) {
    Util.mix(this._cfg, cfg);
  }

  addLayer(layer) {
    layer.parent = this;
    this.add(layer);
    return layer;
  }

  addShape(cfg) {
    const shape = ShapeFactory(cfg);
    shape.parent = this;
    this.add(shape);
    return shape;
  }

  getDefaultCfg() {
    return {
      type: "rect",

      size: [100, 100],

      x: 0,

      y: 0,

      style: {},
    };
  }

  clear() {
    this.children = [];
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get(key) {
    return this._cfg[key];
  }
}

export default Layer;
