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
      // children: [],
      /**
       * 画布缩放比例
       */
      ratio: 1,

      matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1]
    }
    this._cfg = Util.deepMix(defaultCfg, cfg)
    this.init()
  }

  init () {
    this._init()
  }

  _init () {
    const cfg = this._cfg
    if (!Util.isString(cfg.containerId)) throw new Error('containerId must be string')

    const canvas = document.getElementById(cfg.containerId)
    if (!canvas) {
      console.error('canvas is not exsit, please check the containerId')
      return false
    }
    const context = canvas.getContext('2d')

    this.set('canvas', canvas)
    this.set('context', context)
    this.changeSize(cfg.width, cfg.height)
  }

  changeSize (width, height) {
    this._cfg.width = width
    this._cfg.height = height
    this._changeSize(width, height)
  }

  _changeSize (width, height) {
    const canvas = this.get('canvas')
    canvas.width = this._cfg.width
    canvas.height = this._cfg.height
  }

  draw () {
    const context = this.get('context')
    if (!context) throw new Error('context is not available')
    this.clean(this.get('width'), this.get('height'))
    this._draw(context)
  }

  clean (width, height) {
    const ctx = this.get('context')
    ctx.clearRect(0, 0, width, height)
  }

  clear () {
    this.children = []
    this.clean()
  }

  destory () {
    this.clear()
  }

  zoomIn () {

  }

  zoomOut () {

  }

  getBox () {
    const canvas = this.get('canvas')
    const cr = canvas.getBoundingClientRect()
    const box = { l: cr.left, t: cr.top, r: cr.right, b: cr.bottom, width: cr.width, height: cr.height }
    return box
  }

  getMatrix () {
    return this.get('matrix')
  }

  on (evt, callback) {
    this.get('canvas').addEventListener(evt, callback)
  }
}

export default Canvas