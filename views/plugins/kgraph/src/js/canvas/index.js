import Layer from './layer'
import Util from '../util'

class Canvas extends Layer {
  constructor (cfg) {
    super()
    this._init(cfg)
  }

  _init (cfg) {
    console.log(cfg.containerId)
    if (!Util.isString(cfg.containerId)) throw new Error('containerId must be string')
    const c = document.getElementById(cfg.containerId)
    const context = c.getContext('2d')
    this.cfg = _.extend(this.getDefaultCfg(), cfg)

    c.width = cfg.width
    c.height = cfg.height
  }

  getDefaultCfg () {
    return {
      /**
       * 画布宽度
       */
      width: 1000,
      /**
       * 画布高度
       */
      height: 500
    }
  }

  draw () {
    this._draw(this.layer)
  }

  _draw (layer) {
    Util.each(layer.children, child => {
      if (child instanceof Layer) {
        this._draw(child)
      } else {
        child.draw()
      }
    })
  }

  clear () {
    this.children = []
    this.clearRect(0, 0, width, height)
  }
}

export default Canvas