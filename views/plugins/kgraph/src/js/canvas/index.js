import Layer from './layer'
import Util from '../util'

class Canvas extends Layer {
  constructor (cfg) {
    super()
    this._init(cfg)
  }

  _init (cfg) {
    if (!Util.isString(cfg.containerId)) throw new Error('containerId must be string')

    const c = document.getElementById(cfg.containerId)
    const context = c.getContext('2d')
    
    this._cfg = Util.extend(this.getDefaultCfg(), cfg)

    this.set('c', c)
    this.set('context', context)
    this.changeSize(this._cfg.width, this._cfg.height)
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
      height: 500,
      /**
       * 层内图形或其他层
       */
      children: []
    }
  }

  changeSize (width, height) {
    this._cfg.width = width
    this._cfg.height = height
    this._changeSize(width, height)
  }

  _changeSize (width, height) {
    const c = this.get('c')
    c.width = this._cfg.width
    c.height = this._cfg.height
  }

  draw () {
    const context = this.get('context')
    this._draw(context)
  }

  clear () {
    this.children = []
    this.clearRect(0, 0, width, height)
  }
}

export default Canvas