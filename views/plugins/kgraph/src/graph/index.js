import Event from './event'
import EventEmitter from './event-emitter'
import Canvas from '../canvas'
import Util from '../util'
import Item from './item'
import Node from './item/node'
import Edge from './item/edge'
import { invertMatrix, guid } from './util'

class Graph extends EventEmitter{
  constructor (cfg) {
    super()
    const defaultCfg = {
      containerId: null,

      width: 1000,

      height: 500,
      
      nodes: [],

      anchors: [],

      edges: [],
      
      itemMap: {},

      shapeMap: {},

      data: null,

      events: [],
      
      eventMap: {},

      eventItemMap: {},

      targetMap: {},

      maxZIndex: 0,

      selectedItem: null,

      dragingItem: null,

      hoveringItem: null
    }
    
    this._cfg = Util.deepMix(defaultCfg, cfg)

    this._init()
  }

  _init () {
    this._initCanvas()
    this._initEvent()
  }

  _initEvent () {
    new Event(this)
  }

  _initCanvas () {
    this.set('canvas', new Canvas(this._cfg))
    this._initGroups()
  }

  _initGroups () {
  }

  addItem (type, cfg) {
    const newCfg = Util.clone(cfg)

    const id = newCfg.id || guid()

    cfg = Util.mix(newCfg, { id　})
    
    cfg.graph = this
    cfg.zIndex = 0

    let item = null

    if (type === 'node') {
      item = new Node(cfg)
    } else if (type === 'edge') {
      item = new Edge(cfg)
    } else {
      item = new Item(cfg)
    }

    this.get(type + 's').push(item)
    this.get('itemMap')[id] = item
    this.autoPaint()
    return item
  }

  addShape (item) {
    const canvas = this.get('canvas')
    const shapeStyle = item.getShapeCfg()
    const shape = canvas.addShape(shapeStyle)
    const shapeMap = this.get('shapeMap')
    shapeMap[item.get('id')] = shape
    this.autoPaint()
    return shape
  }

  removeItem (item) {

  }

  updateItem (item, cfg) {
    // item._cfg = Util.deepMix(item._cfg, cfg)
    this.setAutoPaint(false)
    if (Util.isString(item)) {
      item = this.findById(item)
    }
    item.update(cfg)
    this.setAutoPaint(true)
  }

  clear () {
    const canvas = this.get('canvas');
    canvas.clear();
    this.set({ itemMap: {}, nodes: [], edges: [] });
    return this;
  }

  render () {
    const data = this.get('data')
    this.clear()
    const autoPaint = this.get('autoPaint')
    this.setAutoPaint(false)
    Util.each(data.nodes, () => {
      this.addItem('node', node)
    })

    Util.each(data.edges, () => {
      this.addItem('edge', node)
    })
    this.paint()
    this.setAutoPaint(autoPaint)
  }

  paint () {
    this.emit('beforePaint')
    this.get('canvas').draw()
    this.emit('afterPaint')
  }
  setAutoPaint (value) {
    this.set('autoPaint', value)
    this.autoPaint()
  }

  autoPaint () {
    if (this.get('autoPaint')) {
      this.paint()
    }
  }
  
  getPointByClient (x, y) {
    const box = this.get('canvas').getBox()
    return this.getPointByCanvas(x - box.l, y - box.t)
  }

  getPointByCanvas (x, y) {
    const matrix = this.get('canvas').getMatrix()
    const point = { x, y }
    return invertMatrix(point, matrix)
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

  findById (id) {
    const itemMap = this.get('itemMap')
    return itemMap[id]
  }

  resortEvents () {
    // console.log(events)
  }

  tofront (item) {
    let maxZIndex = this.get('maxZIndex') + 1
    item.set('zIndex', maxZIndex)
    this.set('maxZIndex', maxZIndex)
    this.resortEvents()
  }

  toback (item) {

  }

}

export default Graph