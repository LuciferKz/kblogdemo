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
import Animate from './animate';
import Rubberband from './rubberband';

class Graph extends EventEmitter{
  constructor (cfg) {
    super()
    const defaultCfg = {
      canvas: null,

      container: 'body',

      width: window.innerWidth,

      height: window.innerHeight,

      diagramWidth: 800,
      
      diagramHeight: 400,

      ratio: 1,

      maxRatio: 2,

      minRatio: 0.2,
      
      nodes: [],

      edges: [],
      
      itemMap: {},

      shapeMap: {},

      shapeCfgs: {},

      data: {

        nodes: [],

        edges: []

      },
      
      eventMap: {},

      eventItemMap: {},

      /**
       * mouseenter array 持续的状态
       * focus array 持续的状态
       * mouseleave object
       * mouseup object
       * click object
       * drag object
       * dragenter object
       */
      targetMap: {
        mouseenter: null,
        focus: [],
        mouseleave: null,
        mouseup: null,
        click: null
      },
      /**
       * 画布的状态
       */
      state: {},

      nodeLayer: null,

      translateX: 0,
      
      translateY: 0,

      fitcanvas: true,

      enableScroll: false,

      enableRubberband: false,

      bgColor: '#FFF',

      grid: {
        show: false,

        align: false,

        size: 10
      },

      originRatio: 1,

      autoPaint: true,

      autoExpandDiagram: true,

      limitX: 100,

      limitY: 100
    }
    
    this._cfg = Util.deepMix(defaultCfg, cfg)
    
    this._init()
  }

  _init () {
    this._initContainer()
    this._changeDiagramSize(this.get('diagramWidth'), this.get('diagramHeight'))
    this._initCanvas()
    this._initBackground()
    this._initGrid()
    this._initGroups()
    this._initEvent()
    this.$trigger = new Trigger(this)
    this.$history = new History()
    if (this.get('enableRubberband')) this.$rubberband = new Rubberband({ graph: this })
    this._initScroller()
    this.$animate = new Animate({ graph: this })
    this.saveData()
  }

  _initContainer () {
    let container = this.get('container')

    container = Util.isString(container) ? $k(container) : container

    if (!container.dom) throw new Error(this.get('container') + '不存在')

    this.set('container', container)
    
    let width = this.get('width');

    let height = this.get('height');

    container.css({ width:  width + 'px', height: height + 'px' });

    if (!this.get('enableScroll')) return false

    this.set('width', width - 10)

    this.set('height', height - 10)
  }

  _initScroller () {
    if (!this.get('enableScroll')) return false
    this.$scroller = new Scroller({
      container: this.get('container'),
      graph: this,
      width: this.get('width'),
      height: this.get('height')
    })
  }

  _initEvent () {
    const event = new Event(this)
    this.$event = {
      trigger () {
        const args = [].slice.call(arguments)
        event.handleEvent.apply(event, args)
      },
    }
  }

  _initCanvas () {
    let canvas = this._cfg.canvas

    if (!canvas) {
      canvas = $k(document.createElement('canvas'))
      this._cfg.container.append(canvas)
    } else {
      canvas = Util.isString(canvas) ? $k(canvas) : canvas
    }

    if (!canvas.dom) throw new Error(this._cfg.canvas + '不存在')

    let cfg = Util.pick(this._cfg, ['width', 'height', 'translateX', 'translateY'])

    cfg.canvas = canvas.dom

    cfg.ratio = this.get('originRatio')

    this.set('canvas', new Canvas(cfg))
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

  _initGrid () {
    const gridCfg = this.get('grid')
    if (!gridCfg.show) return false
    gridCfg.graph = this
    this.$grid = new Grid(gridCfg)
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

  add (type, cfg) {
    const item = this.addItem(type, cfg)
    this.saveData()
    return item
  }

  remove (item) {
    this.removeItem(item)
    this.saveData()
    return item
  }

  update (item, cfg) {
    this.updateItem(item, cfg)
    this.saveData()
    return item
  }

  addItem (type, cfg) {
    cfg.graph = this
    cfg.zIndex = 0
    cfg.type = type
    
    if (cfg.cfgKey) {
      const _cfg = this.get('shapeCfgs')[cfg.cfgKey]
      if (!_cfg) {
        console.error(`配置${cfg.cfgKey}不存在`)
      } else {
        cfg = Util.deepMix({}, _cfg, cfg)
      }
    }
    this.emit('beforeAddItem', cfg)
    if (this.get('stopAdd')) {
      this.set('stopAdd', false)
      return false
    }
    const id = cfg.id || guid()
    cfg = Util.mix({}, cfg, { id })
    let parent = cfg.parent ? this.findById(cfg.parent) : null
    let item = new Item[type](cfg)
    if (parent) parent.get('children').unshift(item)
    this.get(type + 's') && this.get(type + 's').unshift(item)
    //  : this.set(type + 's', [item])
    this.get('itemMap')[id] = item
    this.emit('afterAddItem', item)
    this.autoPaint()
    if (type === 'node') this.autoExpandDiagram()
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
    if (Util.isString(item)) item = this.findById(item)
    this.emit('beforeRemoveItem', item)
    if (this.get('stopRemove')) {
      this.set('stopRemove', false)
      return false
    }
    const id = item.get('id')
    const type = item.get('type')
    const items = this.get(type + 's')
    const shape = this.get('shapeMap')[id]
    const itemMap = this.get('itemMap')
    let index = items.indexOf(item)
    // 删图形
    shape.parent.remove(shape)
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
        if (index > -1) source.get('outEdges').splice(index, 1)
      }
      if (target) {
        index = target.get('inEdges').indexOf(id)
        if (index > -1) target.get('inEdges').splice(index, 1)
      }
    }
    this.emit('afterRemoveItem', item)
    this.autoPaint()
    return item
  }

  updateItem (item, cfg) {
    if (!item) { return false }
    if (Util.isString(item)) item = this.findById(item)
    this.emit('beforeUpdateItem', item, cfg)
    this.setAutoPaint(false)
    item.update(cfg)
    this.emit('afterUpdateItem', item)
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
  
  clearData () {
    this.$history.clearStates()
  }

  clear () {
    // const canvas = this.get('canvas');
    const nodeLayer = this.get('nodeLayer')
    const edgeLayer = this.get('edgeLayer')
    nodeLayer.clear()
    edgeLayer.clear()
    this.set({ 
      itemMap: {},
      nodes: [],
      edges: [],
      shapeMap: {},
      eventMap: {},
      eventItemMap: {},
      targetMap: {},
    });
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
  
  getBox () {
    const container = this.get('container')
    const cr = container.getBoundingClientRect()
    return { l: cr.left, t: cr.top, r: cr.right, b: cr.bottom, width: cr.width, height: cr.height }
  }
  
  getPointByClient (x, y) {
    const box = this.getBox()
    return this.getPointByCanvas(x - box.l, y - box.t)
  }

  getPointByCanvas (x, y) {
    const matrix = this.get('canvas').getMatrix()
    const point = { x, y }
    return invertMatrix(point, matrix)
  }
  
  set (key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get (key) {
    return this._cfg[key];
  }

  setState (key, val) {
    const state = this.get('state')
    state[key] = val
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
    if (!item) return false
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
    if (!item) return false
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

  scale (ratio) {
    if (ratio === this.get('ratio')) return false
    const canvas = this.get('canvas')
    canvas.scale(ratio)
    this.set('ratio', ratio)
    this.emit('changeSize')
    this.autoPaint()
  }

  translate (x, y) {
    let canvas = this.get('canvas')
    this.set('translateX', x)
    this.set('translateY', y)
    canvas.translate(x, y)
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
  
  setAutoExpandDiagram (value) {
    this.set('autoExpandDiagram', value)
    this.autoExpandDiagram()
  }

  autoExpandDiagram (item) {
    if (this.get('autoExpandDiagram')) {
      this.expandDiagram(item)
    }
  }

  expandDiagram (item) {
    let maxX = 0
    let maxY = 0
    let minX = 0
    let minY = 0
    
    if (item) {
      maxX = item.get('x')
      maxY = item.get('y')
      minX = maxX
      minY = maxY
    } else {
      let nodes = this.get('nodes')
      Util.each(nodes, node => {
        const nodeX = node.get('x')
        const nodeY = node.get('y')
        if (nodeX > maxX) {
          maxX = nodeX
        } else if (nodeX < minX) {
          minX = nodeX
        }
        if (nodeY > maxY) {
          maxY = nodeY
        } else if (nodeY < minY) {
          minY = nodeY
        }
      })
    }

    let diagramWidth = this.get('diagramWidth')
    let diagramHeight = this.get('diagramHeight')

    let limitX = this.get('limitX')
    let limitY = this.get('limitY')

    let expandHor = diagramWidth - maxX < limitX
    let expandVer = diagramHeight - maxY < limitY

    if (expandHor) {
      diagramWidth += limitX
    } 
    // else if (minX < 0) {
    //   diagramWidth += Math.abs(minX)
    // }
    
    if (expandVer) {
      diagramHeight += limitY
    }
    // else if (minY < 0) {
    //   diagramHeight += Math.abs(minY)
    //   translateY
    // }

    if (expandHor || expandVer) {
      this.changeDiagramSize(diagramWidth, diagramHeight)
      this.emit('changeSize');
      this.autoPaint()
    }
  }

  changeSize (width, height) {
    let canvas = this.get('canvas')
    this.emit('beforeChangeSize', width, height)
    this.set('width', width)
    this.set('height', height)
    this.emit('changeSize');
    if (this.get('enableScroll')) {
      this.set('width', width - 10)
      this.set('height', height - 10)
    }
    canvas.changeSize(width, height)
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
}

export default Graph