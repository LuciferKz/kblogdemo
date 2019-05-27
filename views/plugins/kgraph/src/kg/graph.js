import Event from './event'
import EventEmitter from './event-emitter'
import Canvas from '../canvas'
import Util from '../util'
import Item from './item'
import { invertMatrix, guid } from './util'
import trigger from './trigger';

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

      edgeEvents: [],

      nodeEvents: [],
      
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
    this.$trigger = new trigger(this)
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
    const id = cfg.id || guid()
    cfg = Util.mix({}, { id }, Util.clone(cfg))
    cfg.graph = this
    cfg.zIndex = 0
    cfg.type = type

    this.emit('beforeAddItem', cfg)

    let parent = cfg.parent ? this.findById(cfg.parent) : null
    let item = new Item[type](cfg)
    if (parent) parent.get('children').unshift(item)

    console.log(item)
    
    this.get(type + 's') ? this.get(type + 's').unshift(item) : this.set(type + 's', [item])
    this.get('itemMap')[id] = item
    this.autoPaint()

    this.emit('afterAddItem', item)

    return item
  }

  addShape (cfg) {
    this.emit('beforeAddShape')
    console.log(cfg)
    const layer = cfg.parent ? this.get('shapeMap')[cfg.parent] : this.get('canvas')
    const shapeStyle = cfg
    const shape = layer.addShape(shapeStyle)
    const shapeMap = this.get('shapeMap')
    const id = cfg.id || guid()
    shapeMap[id] = shape
    this.autoPaint()
    this.emit('afterAddShape')
    return id
  }

  removeItem (item) {
    const items = this.get(item.get('type') + 's')
    const index = items.indexOf(item)
    const shape = this.get('shapeMap')[item.get('id')]
    console.log(shape)
    shape.parent.children.splice(shape.parent.children.indexOf(shape), 1)
    items.splice(index, 1)
    delete this.get('itemMap')[item.get('id')]
    this.autoPaint()
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

  resortNodes () {
    // console.log(events)
  }

  tofront (item) {
    let maxZIndex = this.get('maxZIndex') + 1
    item.set('zIndex', maxZIndex)
    this.set('maxZIndex', maxZIndex)
    this.resortNodes()
  }

  toback (item) {

  }

  select (item) {
    this.set('selectedItem', item)
  }

  paste (item) {
    const cfg = item._cfg
    const newCfg = {
      x: cfg.x + 20,
      y: cfg.y + 20,
      shape: cfg.shape
    }
    console.log(cfg)

    return this.addItem(cfg.type, newCfg)
  }

  scaleTo (ratio) {
    this.set('ratio', ratio)
  }

  zoomIn () {
    const canvas = this.get('canvas')
    this.scaleTo(0.5)
    canvas.zoomIn()
  }

  zoomOut () {

  }
}

export default Graph