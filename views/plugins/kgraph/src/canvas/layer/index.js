import Util from '../../util'
import ShapeFactory from '../shape'

class Layer {
  constructor (cfg) {
    this.children = []
    
    if (cfg && cfg.type) {
      const layer = this
      layer.shape = ShapeFactory(cfg)
  
      if (cfg.layer) {
        cfg.layer.addLayer(layer)
      }
    }
  }

  _init () {
  }
  
  draw (ctx) {
    ctx.save()
    this._drawLayer(ctx)
    this._draw(ctx)
    ctx.restore()
  }

  _drawLayer (ctx) {
    //   if (_shape._cfg.isGuid) {
    //     const shapeStyle = _shape.getShapeStyle()
    //     console.log(shapeStyle)

    //     ctx.translate(shapeStyle.x, shapeStyle.y)

    //     _shape.changePosition(0, 0)
    //   }
    
    const _shape = this.shape
    if (_shape) {
      _shape.draw(ctx)
    }
  }

  _draw (ctx) {
    const layer = this
    // console.log('shape', ctx, this.shape)
    Util.each(layer.children, child => {
      child.draw(ctx)
    })
  }

  add (s) {
    s.parent = this
    this.children.push(s)
  }

  addChild () {
  }

  removeChild () {
    // this.
  }

  addLayer (layer) {
    this.add(layer)
    return layer
  }

  addShape (cfg) {
    const shape = ShapeFactory(cfg)
    this.add(shape)
    return shape
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

export default Layer