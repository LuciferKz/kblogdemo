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

      /**
       * a c e
       * b d f
       * 0 0 1 
       * 
       * a b 0 c d 0 e f 1
       */
      matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1],

      translateX: 0,
      
      translateY: 0
    }
    this._cfg = Util.deepMix(defaultCfg, cfg)
    this.init()
  }

  init () {
    this._init()
  }

  _init () {
    const cfg = this._cfg
    
    if (!Util.isString(cfg.canvasId)) throw new Error('canvas id must be string')

    const canvas = document.getElementById(cfg.canvasId)
    if (!canvas) {
      console.error('canvas is not exsit, please check the canvas id')
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
    this._changeSize(this._cfg.width, this._cfg.height)
  }

  _changeSize (width, height) {
    const canvas = this.get('canvas')
    const ratio = this.get('ratio')
    canvas.width = width * ratio
    canvas.height = height * ratio
    canvas.style.position = 'relative'
    canvas.style.zIndex = '99999'
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
  }

  draw () {
    const context = this.get('context')
    if (!context) throw new Error('context is not available')
    this.clean(this.get('width'), this.get('height'))
    let ratio = this.get('ratio')
    let matrix = this.get('matrix')
    context.save()
    context.translate(matrix[6] * ratio, matrix[7] * ratio)
    context.scale(matrix[0] * ratio, matrix[4] * ratio)
    this._draw(context)
    context.restore()
    context.save()
  }

  clean (width, height) {
    const ctx = this.get('context')
    const ratio = this.get('ratio')
    ctx.clearRect(0, 0, width * ratio, height * ratio)
  }

  clear () {
    this.children = []
    this.clean()
  }

  destory () {
    this.clear()
  }

  scale (ratio) {
    const matrix = this.get('matrix')
    matrix[0] = ratio
    matrix[4] = ratio
  }

  translate (x, y) {
    const matrix = this.get('matrix')
    matrix[6] = x
    matrix[7] = y
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