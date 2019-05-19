import Event from './event'
import EventEmitter from './event-emitter'
import Canvas from '../canvas'
import Util from '../util'
import Item from './item'
import { invertMatrix } from './util'

class Graph extends EventEmitter{
  constructor (cfg) {
    super()
    const defaultCfg = {
      containerId: null,

      width: 1000,

      height: 500,
      
      nodes: [],

      edges: [],
      
      itemMap: {},

      data: null,

      layer: [],

      events: [],
      
      eventMap: {},

      eventItemMap: {}
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
    const canvas = this.get('canvas')
    this.set('layer', canvas);
  }

  addItem (type, cfg) {
    const layer = cfg.layer || this.get('layer')
    
    const id = cfg.id || guid()

    cfg = Util.mix(cfg, { id, layer: layer　})
    
    cfg.graph = this

    const item = new Item(cfg)

    this.get(type + 's').push(item)
    this.get('itemMap')[id] = item
    this.autoPaint()
    return item
  }

  removeItem (item) {

  }

  updateItem (item, cfg) {
    // item._cfg = Util.deepMix(item._cfg, cfg)
    if (Util.isString(item)) {
      item = this.findById(item)
    }
    item.update(cfg)
    this.autoPaint()
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
}

export default Graph