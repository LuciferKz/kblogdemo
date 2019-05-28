import Event from './event'
import EventEmitter from './event-emitter'
import Layer from '../canvas/layer'
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

      diagramWidth: 1000,
      
      diagramHeight: 500,

      ratio: 1,

      maxRatio: 1.6,

      minRatio: 0.6,
      
      nodes: [],

      anchors: [],

      edges: [],
      
      itemMap: {},

      shapeMap: {},

      data: null,
      
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
    cfg = Util.mix({}, { id }, Util.clone(cfg))
    cfg.graph = this
    cfg.zIndex = 0
    cfg.type = type
    this.emit('beforeAddItem', cfg)
    let parent = cfg.parent ? this.findById(cfg.parent) : null
    let item = new Item[type](cfg)
    if (parent) parent.get('children').unshift(item)
    this.get(type + 's') ? this.get(type + 's').unshift(item) : this.set(type + 's', [item])
    this.get('itemMap')[id] = item
    this.autoPaint()
    this.emit('afterAddItem', item)
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
    this.autoPaint()
    this.emit('afterAddShape')
    return id
  }

  removeItem (item) {
    const items = this.get(item.get('type') + 's')
    const index = items.indexOf(item)
    const shape = this.get('shapeMap')[item.get('id')]
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
      x: cfg.x + 20,
      y: cfg.y + 20,
      shape: cfg.shape,
      anchorMatrix: cfg.anchorMatrix,
      label: cfg.label,
      labelCfg: cfg.labelCfg
    }
    return this.addItem(cfg.type, newCfg)
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