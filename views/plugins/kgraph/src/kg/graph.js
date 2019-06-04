import Event from './event'
import EventEmitter from './event-emitter'
import Layer from '../canvas/layer'
import Canvas from '../canvas'
import Util from '../util'
import Item from './item'
import { invertMatrix, guid } from './util'
import Trigger from './trigger'
import History from './history'
import Scroller from './scroller';
import $k from '../util/dom/index'
import Grid from './grid'

class Graph extends EventEmitter{
  constructor (cfg) {
    super()
    const defaultCfg = {
      canvasId: '',

      container: null,

      width: 1000,

      height: 500,

      diagramWidth: 800,
      
      diagramHeight: 400,

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

      nodeLayer: null,

      translateX: 0,
      
      translateY: 0,

      fitcanvas: true,

      enableScroll: true,

      bgColor: '#FFF'
    }
    
    this._cfg = Util.deepMix(defaultCfg, cfg)
    
    if (Util.isString(cfg.container)) {
      this._cfg.container = $k('.' + cfg.container)
    }

    this._cfg.container.css({ width:  this._cfg.width + 'px', height:  this._cfg.height + 'px' })
    if (this._cfg.enableScroll) {
      this._cfg.width = this._cfg.width - 10
      this._cfg.height = this._cfg.height - 10
    }
    this._init()
  }

  _init () {
    this._changeDiagramSize()
    this._initCanvas()
    this._initBackground()
    this.$grid = new Grid({ graph: this })
    this._initGroups()
    this._initEvent()
    this._initKeyboard()
    this.$trigger = new Trigger(this)
    this.$history = new History()
    this.$scroller = new Scroller({
      container: this.get('container'),
      graph: this,
      width: this.get('width'),
      height: this.get('height')
    })
    this.saveData()
  }

  _initEvent () {
    new Event(this)
  }

  _initCanvas () {
    this.set('canvas', new Canvas(this._cfg))
  }

  _initKeyboard () {
    const g = this
    window.onkeydown = function (e) {
      var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
      if (window.event.shiftKey) keyCode = 'shift+' + keyCode;
      if (window.event.ctrlKey) keyCode = 'ctrl+' + keyCode;
      switch (keyCode) {
        case 46:
          g.$trigger('delete');
          break;
        case 'ctrl+67':
          g.$trigger('copy');
          break;
        case 'ctrl+86':
          g.$trigger('paste');
          break;
        case 'ctrl+90':
          g.$trigger('undo');
          break;
        case 'ctrl+shift+90':
          g.$trigger('redo');
          break;
      }
    }
  }

  _initBackground () {
    const canvas = this.get('canvas')
    const diagramWidth = this.get('diagramWidth')
    const diagramHeight = this.get('diagramHeight')
    const bgColor = this.get('bgColor')
    
    const background = new Layer({
      type: 'rect',
      x: diagramWidth / 2,
      y: diagramHeight / 2,
      size: [diagramWidth, diagramHeight],
      style: {
        fill: bgColor
      }
    })
    canvas.addLayer(background)
    this.set('background', background)
  }

  _updateBackground () {
    const canvas = this.get('canvas')
    const background = this.get('background').get('shape')
    const diagramWidth = this.get('diagramWidth')
    const diagramHeight = this.get('diagramHeight')
    
    background.update({
      x: diagramWidth / 2,
      y: diagramHeight / 2,
      size: [diagramWidth, diagramHeight]
    })
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
    if (type === 'node') this.expandDiagram(item)
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
    if (!item) { return false }
    this.emit('beforeRemoveItem', item)
    const id = item.get('id')
    const type = item.get('type')
    const items = this.get(type + 's')
    const shape = this.get('shapeMap')[id]
    const itemMap = this.get('itemMap')
    let index = items.indexOf(item)
    // 删图形
    shape.parent.children.splice(shape.parent.children.indexOf(shape), 1)
    // 删list
    items.splice(index, 1)
    // 删map
    delete itemMap[id]
    // 删关联线
    if (type === 'node') {
      const outEdges = item.get('outEdges')
      const inEdges = item.get('inEdges')
      Util.each(outEdges, id => {
        let edge = this.findById(id)
        this.removeItem(edge)
      })
      Util.each(inEdges, id => {
        let edge = this.findById(id)
        this.removeItem(edge)
      })
    } else if (type === 'edge') {
      const source = this.findById(item.get('source'))
      const target = this.findById(item.get('target'))
      if (source) {
        index = source.get('outEdges').indexOf(id)
        source.get('outEdges').splice(index, 1)
      }
      if (target) {
        index = target.get('inEdges').indexOf(id)
        target.get('inEdges').splice(index, 1)
      }
    }
    this.emit('afterRemoveItem', item)
    this.autoPaint()
    return item
  }

  updateItem (item, cfg) {
    if (!item) { return false }
    // item._cfg = Util.deepMix(item._cfg, cfg)
    this.setAutoPaint(false)
    if (Util.isString(item)) {
      item = this.findById(item)
    }
    item.update(cfg)
    this.setAutoPaint(true)
    return item
  }

  saveData () {
    this.$history.saveState(this.getData())
  }

  getData () {
    const nodes = this.get('nodes')
    const edges = this.get('edges')
    const data = {}

    data.nodes = nodes.map(node => node.getData())

    data.edges = edges.map(edge => edge.getData())
    
    return data
  }

  clear () {
    const canvas = this.get('canvas');
    canvas.clear();
    this.set({ 
      itemMap: {},
      nodes: [],
      edges: [],
      shapeMap: {},
      eventMap: {},
      eventItemMap: {},
      targetMap: {},
    });
    this._initBackground()
    this._initGroups()
    return this;
  }

  render (data) {
    this.clear()
    const autoPaint = this.get('autoPaint')
    this.setAutoPaint(false)
    Util.each(data.nodes, (node) => {
      this.addItem('node', node)
    })

    Util.each(data.edges, (edge) => {
      this.addItem('edge', edge)
    })
    
    this.paint()
    this.setAutoPaint(autoPaint)
  }

  destroy () {
    window.onkeydown = null
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

  findShapeById (id) {
    const shapeMap = this.get('shapeMap')
    return shapeMap[id]
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
  
  expandDiagram (item) {
    let diagramWidth = this.get('diagramWidth')
    let diagramHeight = this.get('diagramHeight')
    let x = item.get('x')
    let y = item.get('y')
    let box = item.get('box')
    let width = box.width
    let height = box.height

    if (diagramWidth - x < 50) {
      diagramWidth += width
    }

    if (diagramHeight - y < 50) {
      diagramHeight += height
    }

    this.changeDiagramSize(diagramWidth, diagramHeight)
    this.$scroller.changeSize()
    this.autoPaint()
  }

  translate (x, y) {
    let canvas = this.get('canvas')
    this.set('translateX', x)
    this.set('translateY', y)
    canvas.translate(x, y)
    this.autoPaint()
  }

  changeSize (width, height) {
    let canvas = this.get('canvas')
    this.emit('beforeChangeSize', width, height)
    this.set('width', width)
    this.set('height', height)
    canvas.changeSize(width, height)
    this.changeDiagramSize(width, height)
    this.emit('afterChangeSize', width, height)
    this.autoPaint()
  }

  changeDiagramSize (width = 0, height = 0) {
    this.emit('beforeChangeDiagramSize', width, height)
    this._changeDiagramSize(width, height)
    this._updateBackground()
    this.emit('afterChangeDiagramSize', width, height)
  }

  _changeDiagramSize (width, height) {
    const cfg = this._cfg

    if (cfg.fitcanvas) {
      width = width > cfg.width ? width : cfg.width
      height = height > cfg.height ? height : cfg.height
    }

    this.set('diagramWidth', width)
    this.set('diagramHeight', height)
  }

  use (plugin) {
    plugin.install(this)
  }
}

export default Graph