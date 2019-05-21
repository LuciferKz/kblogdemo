import Util from '../../util'
import Item from './index'
import Anchor from './anchor'
import Layer from '../../canvas/layer'
import { guid } from '../util'

class Node extends Item {
  constructor (cfg) {
    super(cfg)
  }

  init (cfg) {
    this._cfg = Util.deepMix({}, this.getDefaultCfg(), cfg)
    this._init()
  }

  _init () {
    // console.log('node', this, this._cfg)

    const graph = this.get('graph')
    const canvas = graph.get('canvas')
    
    const shapeCfg = this.getShapeCfg()
    let shape = canvas.addLayer(new Layer(shapeCfg))

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    this._getBox()
    this._initAnchors()
  }

  _initAnchors () {
    const anchors = this.get('anchors')
    const anchorCfg = this.get('anchorCfg')
    const anchorPoints = this.get('anchorPoints')
    const graph = this.get('graph')
    const layer = graph.get('shapeMap')[this.get('id')]

    Util.each(anchors, anchor => {
      let anchorPoint = this.getAnchorPoint(anchor)
      anchorPoint.id = guid()
      let newAnchorCfg = Util.deepMix(anchorPoint, this.getDefaultAnchorCfg(), anchorCfg)
      anchorPoints.push(new Anchor(newAnchorCfg))
    })
  }

  addEdge (type, edge) {
    this.get(`${type}Edges`).push(edge)
  }

  getAnchorPoint (anchor) {
    const box = this.get('box')
    let x = box.l + box.width * anchor[0]
    let y = box.t + box.height * anchor[1]
    return { x, y, m: anchor }
  }

  getActiveAnchor (point) {
    const anchorPoints = this.get('anchorPoints')
    return Util.find(anchorPoints, anchor => {
      return this.pointDistance({ x: anchor._cfg.x, y: anchor._cfg.y }, point) < 225
    })
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
    this._getBox()

    const anchorPoints = this.get('anchorPoints')
    Util.each(anchorPoints, anchor => {
      let point = this.getAnchorPoint(anchor.get('m'))
      delete point.m
      anchor.update(point)
    })

    const outEdges = this.get('outEdges')
    Util.each(outEdges, id => {
      let edge = graph.findById(id)
      edge.updateShape()
    })

    const inEdges = this.get('inEdges')
    Util.each(inEdges, id => {
      let edge = graph.findById(id)
      edge.updateShape()
    })
  }

  getDefaultCfg () {
    return {
      x: 0,

      y: 0,

      state: {},

      box: {},

      parent: '',

      children: [],

      anchorPoints: [],

      outEdges: [],

      inEdges: []
    }
  }

  getDefaultAnchorCfg () {
    return {
      shape: {
        size: 5,

        type: 'circle',
  
        style: {
          lineWidth: 2,
  
          stroke: '#CCC',
  
          fill: '#FFF'
        }
      },

      parent: this.get('id'),

      graph: this.get('graph')
    }
  }
}

export default Node
