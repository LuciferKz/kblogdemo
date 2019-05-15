import Util from '../../util'
import ShapeFactory from '../shape'

class Layer {
  constructor (name, cfg) {
    this.name = name

    this.children = []

    if (cfg) this.shape = ShapeFactory(cfg)
  }

  _init () {
  }
  
  draw (ctx) {
    console.log('####################################')
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

  addLayer (layer) {
    this.children.push(layer)
  }

  addShape (cfg) {
    const shape = ShapeFactory(cfg)
    this.children.push(shape)
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