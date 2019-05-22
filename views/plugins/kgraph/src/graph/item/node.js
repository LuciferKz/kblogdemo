import Util from '../../util'
import Item from './index'
import Anchor from './anchor'
import Layer from '../../canvas/layer'
import { guid } from '../util'

class Node extends Item {
  constructor (cfg) {
    super(cfg)
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
    const anchorMatrix = this.get('anchorMatrix')
    const anchorCfg = this.get('anchorCfg')
    const anchors = this.get('anchors')
    const anchorMap = this.get('anchorMap')

    Util.each(anchorMatrix, anchor => {
      let anchorPoint = this.getAnchorPoint(anchor)
      let id = guid()
      anchorPoint.id = id
      anchorPoint.parent = this.get('id')
      anchorPoint.graph = this.get('graph')
      let newAnchorCfg = Util.deepMix(anchorPoint, anchorCfg)
      let newAnchor = new Anchor(newAnchorCfg)
      anchors.push(newAnchor)
      anchorMap[id] = newAnchor
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
    const anchors = this.get('anchors')
    return Util.find(anchors, anchor => {
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

  updatePosition (cfg) {
    const graph = this.get('graph')
    this._cfg.x = cfg.x
    this._cfg.y = cfg.y
    const shapeMap = graph.get('shapeMap')
    const shape = shapeMap[this.get('id')].shape
    shape.updatePosition(cfg.x, cfg.y)
    this._getBox()

    const anchors = this.get('anchors')
    Util.each(anchors, anchor => {
      let point = this.getAnchorPoint(anchor.get('m'))
      delete point.m
      anchor.update(point)
    })

    const outEdges = this.get('outEdges')
    // console.log('outEdges', outEdges)
    Util.each(outEdges, id => {
      let edge = graph.findById(id)
      edge.updatePath()
    })

    const inEdges = this.get('inEdges')
    // console.log('inEdges', inEdges)
    Util.each(inEdges, id => {
      let edge = graph.findById(id)
      edge.updatePath()
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

      anchors: [],

      anchorMap: {},

      anchorMatrix: [],

      outEdges: [],

      inEdges: []
    }
  }

  _getShapeCfg () {
    const shape = this.get('shape')
    Util.mix(shape, {
      x: this._cfg.x,
      y: this._cfg.y
    })
    return shape
  }

  findAnchorById (id) {
    const anchorMap = this.get('anchorMap')
    return anchorMap[id]
  }
}

export default Node
