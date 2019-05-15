import Layer from './layer'
import Util from '../util'

class Canvas extends Layer {
  constructor (cfg) {
    super()
    const defaultCfg = {
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
      children: [],
      /**
       * 画布缩放比例
       */
      ratio: 0.5
    }
    this._cfg = {}
    Util.extend(this._cfg, defaultCfg, cfg)
  }

  init () {
    this._init(this._cfg)
  }

  _init (cfg) {
    if (!Util.isString(cfg.containerId)) throw new Error('containerId must be string')

    const c = document.getElementById(cfg.containerId)
    if (!c) {
      console.error('canvas is not exsit, please check the containerId')
      return false
    }
    const context = c.getContext('2d')

    this.set('c', c)
    this.set('context', context)
    this.changeSize(this._cfg.width, this._cfg.height)
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
    if (!context) throw new Error('context is not available')
    this._draw(context)
  }

  clear () {
    this.children = []
    this.clearRect(0, 0, width, height)
  }

  getRatio () {
    return this._cfg.ratio
  }

  zoomIn () {

  }

  zoomOut () {

  }
}

export default Canvas