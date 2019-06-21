import Util from '../../util'
import Base from './base'
import getPoints from '../util/getPoints'
import Layer from '../../canvas/layer'

class Edge extends Base {
  constructor (cfg) {
    super(cfg)
  }

  // _init () {
  //   super._init()
  //   this.addLabel()
  // }

  _init () {
    const graph = this.get('graph')
    const edgeLayer = graph.get('edgeLayer')
    
    const shapeCfg = this.getShapeCfg()
    let shape = edgeLayer.addLayer(new Layer(shapeCfg))
    shape.parent = edgeLayer

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    // this._initOutline()
    // this.getBox()
    this.addLabel()
  }
  
  addLabel () {
    const graph = this.get('graph')
    const label = this.get('label')
    const defaultLabelCfg = { offsetX: 0, offsetY: 0 }
    const shapeMap = graph.get('shapeMap')
    const labelCfg = Util.mix(defaultLabelCfg, this.get('labelCfg'))
    labelCfg.type = 'text'
    labelCfg.content = label
    const labelPosition = this.getLabelPosition()
    labelCfg.x = labelPosition.x + labelCfg.offsetX
    labelCfg.y = labelPosition.y + labelCfg.offsetY
    this.set('labelCfg', labelCfg)
    const labelId = graph.addShape(Util.mix({}, labelCfg, { parent: shapeMap[this.get('id')] }))
    this.set('labelId', labelId)
  }

  getLabelPosition () {
    const points = this.get('points')
    const lastPart = this.get('arrow') ? points.slice(-4, -2) : points.slice(-3, -1)
    const midPoint = this.getMidPoint(lastPart)
    return midPoint
  }

  updateLabelPosition () {
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    const labelShape = shapeMap[this.get('labelId')]
    const labelPosition = this.getLabelPosition()
    labelShape.update({ x: labelPosition.x, y: labelPosition.y })
  }
  
  _getShapeCfg () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.arrow = this.get('arrow')
    shape.points = points
    return shape
  }

  _getPoints () {
    const graph = this.get('graph')
    const shape = this.get('shape')

    const source = graph.findById(this.get('source'))
    const startAnchor = this.get('startAnchor')
    const startPoint = source.getAnchorPoint(startAnchor)
    this.set('startPoint', startPoint)

    const target = graph.findById(this.get('target'))
    const endAnchor = target && this.get('endAnchor')
    const endPoint = target ? target.getAnchorPoint(endAnchor) : shape.endPoint
    this.set('endPoint', endPoint)

    const points = getPoints(startAnchor, endAnchor, startPoint, endPoint, this.get('arrow'))
    this.set('points', points)
    return points
  }

  getData () {
    const cfg = Util.pick(this._cfg, ['id', 'state', 'source', 'startAnchor', 'target', 'endAnchor', 'arrow', 'shape', 'event', 'props'])
    cfg.shape = Util.pick(cfg.shape, ['type', 'style'])
    return cfg
  }

  getLineDirection (line) {
    let p1 = line[0]
    let p2 = line[1]
    return p1.x === p2.x ? 'V' : 'H'
  }
  
  getPathPart (point) {
    let points = this.get('shape').points;
    let clientX = point.x;
    let clientY = point.y;
    let range = this.get('shape').style.lineWidth
    let part;

    for (let i = 1, len = points.length; i < len; i++) {
      let p1 = points[i];
      let p2 = points[i + 1];
      if (!p2) break;
      if (Math.abs(clientX - p1.x) <= range && Math.abs(clientX - p2.x) <= range ||
      Math.abs(clientY - p1.y) <= range && Math.abs(clientY - p2.y) <= range) {
        part = [p1, p2];
        break;
      }
    }
    
    return part;
  }

  getMidPoint (part) {
    let p1 = part[0]
    let p2 = part[1]
    let midX = p1.x
    let midY = p1.y
    if (p1.x === p2.x) {
      midY = (p1.y - p2.y) / 2 + p2.y
    } else if (p1.y === p2.y) {
      midX = (p1.x - p2.x) / 2 + p2.x
    }
    return { x: midX, y: midY }
  }
  
  updatePath () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.points = points
    shape.arrow = this.get('arrow')
    this.updateShape()
    this.updateLabelPosition()
  }

  update (cfg) {
    const shape = this.getShapeCfg()
    Util.mix(shape, cfg)
    this.updateShape()
  }

  _getDefaultCfg () {
    return {
      state: {},

      source: null,

      target: null,
      // 是否有箭头
      arrow: false,

      startAnchor: [],

      endAnchor: [],

      points: [],

      shape: {

        startPoint: {},

        endPoint: {}

      },

      label: '',

      labelCfg: {

      },
      
      props: {}
    }
  }

  getDefaultShapeCfg () {
    const graph = this.get('graph')

    return {
      id: this.get('id')
    }
  }
}

export default Edge
