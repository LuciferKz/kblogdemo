import Util from '../../util'
import Item from './index'
import Layer from '../../canvas/layer'

class Node extends Item {
  constructor (cfg) {
    super(cfg)
  }

  init (cfg) {
    this._cfg = Util.deepMix({}, this.getDefaultCfg(), cfg)
    this._getBox(this)
    this._init()
  }

  _init () {
    console.log('node', this, this._cfg)
    const graph = this.get('graph')
    const canvas = graph.get('canvas')

    let shape = canvas.addLayer(new Layer(this.getShapeCfg()))

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    this._initAnchors()
  }

  _initAnchors () {
    const anchors = this.get('anchors')
    const anchorCfg = this.get('anchorCfg')
    const anchorPoints = this.get('anchorPoints')
    const graph = this.get('graph')
    const box = this.get('box')
    const layer = graph.get('shapeMap')[this.get('id')]

    Util.each(anchors, anchor => {
      let anchorPoint = this.getAnchorPoint(box, anchor)
      let newAnchorCfg = Util.deepMix(anchorPoint, this.getDefaultAnchorCfg(), anchorCfg)
      anchorPoints.push(layer.addShape(newAnchorCfg))
    })
  }

  getAnchorPoint (box, anchor) {
    let x = box.l + box.width * anchor[0]
    let y = box.t + box.height * anchor[1]

    return { x, y, m: anchor }
  }

  pointDistance (p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  }

  updateAnchor (anchor, cfg) {
    const graph = this.get('graph')
    anchor.update(cfg)
    graph.autoPaint()
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  setState (key, val) {
    this._cfg.state[key] = val;
  }

  get(key) {
    return this._cfg[key];
  }

  updatePosition (cfg) {
    const graph = this.get('graph')
    this._cfg.x = cfg.x
    this._cfg.y = cfg.y
    const shapeMap = graph.get('shapeMap')
    const shape = shapeMap[this.get('id')].shape
    shape.updatePosition(cfg.x, cfg.y)

    const anchorPoints = this.get('anchorPoints')
    const box = this._getBox()
    Util.each(anchorPoints, anchor => {
      let point = this.getAnchorPoint(box, anchor.get('m'))
      anchor.updatePosition(point.x, point.y)
    })
  }

  getDefaultCfg () {
    return {
      state: {},

      box: {},

      parent: '',

      children: [],

      anchorPoints: []
    }
  }

  getDefaultAnchorCfg () {
    return {
      type: 'circle',

      size: 5,

      style: {
        lineWidth: 2,

        stroke: '#CCC',

        fill: '#FFF'
      },

      parent: this.get('id')
    }
  }

  getShapeCfg () {
    const cfg = this._cfg
    return {
      type: cfg.type,

      x: cfg.x,

      y: cfg.y,

      size: cfg.size,

      style: cfg.style
    }
  }
}

export default Node
