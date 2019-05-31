import Event from './event'
import EventEmitter from './event-emitter'
import Layer from '../canvas/layer'
import Canvas from '../canvas'
import Util from '../util'
import Item from './item'
import { invertMatrix, guid } from './util'
import Trigger from './trigger'
import History from './history'

class Graph extends EventEmitter{
  constructor (cfg) {
    super()
    const defaultCfg = {
      containerId: null,

      width: 1000,

      height: 500,

      diagramWidth: 1000,
      
      diagramHeight: 500,

      ratio: 1,

      maxRatio: 1.6,

      minRatio: 0.6,
      
      nodes: [],

      // anchors: [],

      edges: [],
      
      itemMap: {},

      shapeMap: {},

      data: {
        nodes: [],
        edges: []
      },
      
      eventMap: {},

      eventItemMap: {},

      targetMap: {},

      maxZIndex: 0,

      selectedItem: null,

      dragingItem: null,

      hoveringItem: null,

      nodeLayer: null
    }
    
    this._cfg = Util.deepMix(defaultCfg, cfg)

    this._cfg.diagramWidth = this._cfg.width
    this._cfg.diagramHeight = this._cfg.height

    this._init()
  }

  _init () {
    this._initCanvas()
    this._initEvent()
    this.$trigger = new Trigger(this)
    this.$history = new History()
    this.$history.saveState(this.get('data'))
  }

  _initEvent () {
    new Event(this)
  }

  _initCanvas () {
    this.set('canvas', new Canvas(this._cfg))
    this._initGroups()
  }

  _initGroups () {
    const canvas = this.get('canvas')
    const edgeLayer = new Layer({
      x: 0,
      y: 0,
      parent: canvas
    })
    const nodeLayer = new Layer({
      x: 0,
      y: 0,
      parent: canvas
    })
    canvas.addLayer(edgeLayer)
    canvas.addLayer(nodeLayer)
    this.set('nodeLayer', nodeLayer)
    this.set('edgeLayer', edgeLayer)
  }

  addItem (type, cfg) {
    const id = cfg.id || guid()
    cfg = Util.mix({}, cfg, { id })
    cfg.graph = this
    cfg.zIndex = 0
    cfg.type = type
    this.emit('beforeAddItem', cfg)
    let parent = cfg.parent ? this.findById(cfg.parent) : null
    let item = new Item[type](cfg)
    if (parent) parent.get('children').unshift(item)
    this.get(type + 's') && this.get(type + 's').unshift(item)
    //  : this.set(type + 's', [item])
    this.get('itemMap')[id] = item
    this.emit('afterAddItem', item)
    this.autoPaint()
    return item
  }

  addShape (cfg) {
    this.emit('beforeAddShape')
    const layer = cfg.parent || this.get('canvas')
    const shapeStyle = cfg
    const shape = layer.addShape(shapeStyle)
    const shapeMap = this.get('shapeMap')
    const id = cfg.id || guid()
    shapeMap[id] = shape
    this.emit('afterAddShape')
    this.autoPaint()
    return id
  }

  removeItem (item) {
    this.emit('beforeRemoveItem')
    const items = this.get(item.get('type') + 's')
    const index = items.indexOf(item)
    const shape = this.get('shapeMap')[item.get('id')]
    shape.parent.children.splice(shape.parent.children.indexOf(shape), 1)
    items.splice(index, 1)
    delete this.get('itemMap')[item.get('id')]
    this.emit('afterRemoveItem')
    this.autoPaint()
    return item
  }

  updateItem (item, cfg) {
    // item._cfg = Util.deepMix(item._cfg, cfg)
    this.setAutoPaint(false)
    if (Util.isString(item)) {
      item = this.findById(item)
    }
    item.update(cfg)
    this.setAutoPaint(true)
    return item
  }

  getData () {
    const nodes = this.get('nodes')
    const edges = this.get('edges')
    const data = {}

    data.nodes = nodes.map((node) => {
      return node.getData()
    })
    console.log('getData', data)
    return data
  }

  clear () {
    const canvas = this.get('canvas');
    canvas.clear();
    this.set({ itemMap: {}, nodes: [], edges: [] });
    return this;
  }

  render (data) {
    this.clear()
    this._initGroups()
    const autoPaint = this.get('autoPaint')
    this.setAutoPaint(false)
    Util.each(data.nodes, (node) => {
      this.addItem('node', node)
    })

    Util.each(data.edges, (edge) => {
      this.addItem('edge', edge)
    })
    console.log(this.get('nodes'))
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
    const canvas = this.get('canvas')
    const box = canvas.getBox()
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

  /* 绘制: 先进在前 事件: 先进在后 */
  tofront (item) {
    if (!item) return new Error('未选中节点')
    const items = this.get(`${item.get('type')}s`)
    let index = items.indexOf(item)
    items.splice(index, 1)
    items.unshift(item)
    const layer = this.get('shapeMap')[item.get('id')]
    const children = layer.parent.children
    index = children.indexOf(layer)
    children.push(layer)
    this.autoPaint()
  }

  toback (item) {
    if (!item) return new Error('未选中节点')
    const items = this.get(`${item.get('type')}s`)
    let index = items.indexOf(item)
    items.splice(index, 1)
    items.push(item)
    const layer = this.get('shapeMap')[item.get('id')]
    const children = layer.parent.children
    index = children.indexOf(layer)
    children.unshift(layer)
    this.autoPaint()
  }

  paste (item) {
    if (!item) return new Error('未复制节点')
    const cfg = item._cfg
    const newCfg = {
      id: null,
      x: cfg.x + 20,
      y: cfg.y + 20,
      parent: null,
      outEdges: [],
      inEdges: [],
    }
    return this.addItem(cfg.type, Util.mix({}, cfg, newCfg))
  }

  scale (ratio) {
    const canvas = this.get('canvas')
    this.set('ratio', ratio)
    canvas.scale(ratio)
    this.autoPaint()
  }

  zoomin () {
    const maxRatio = this.get('maxRatio')
    let ratio = this.get('ratio')
    ratio = ratio + 0.2 <= maxRatio ? parseFloat((ratio + 0.2).toFixed(2)) : maxRatio
    this.scale(ratio)
  }

  zoomout () {
    const minRatio = this.get('minRatio')
    let ratio = this.get('ratio')
    ratio = ratio - 0.2 >= minRatio ? parseFloat((ratio - 0.2).toFixed(2)) : minRatio
    this.scale(ratio)
  }
}

export default Graph