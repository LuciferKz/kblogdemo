import Util from '../../util'
import Base from './base'
import { getPointsBetweenAA, getPointsBetweenAP } from '../util/getPoints'
import Layer from '../../canvas/layer'

class Edge extends Base {
  constructor (cfg) {
    super(cfg)
  }

  _init () {
    const graph = this.get('graph')
    const edgeLayer = graph.get('edgeLayer')
    
    const shapeCfg = this.getShapeCfg()
    let shape = edgeLayer.addLayer(new Layer(shapeCfg))
    shape.parent = edgeLayer

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    this.addLabel()
  }
  
  addLabel () {
    if (!this.get('label')) return
    if (this.get('points').length < 3) return

    const graph = this.get('graph')
    const label = this.get('label')
    const defaultLabelCfg = { offsetX: 0, offsetY: 0, style: {} }
    const shapeMap = graph.get('shapeMap')
    const labelCfg = Util.mix(defaultLabelCfg, this.get('labelCfg'))
    labelCfg.type = 'text'
    labelCfg.content = label
    const labelPosition = this.getLabelPosition()
    labelCfg.x = labelPosition.x + labelCfg.offsetX
    labelCfg.y = labelPosition.y + labelCfg.offsetY
    const points = this.get('points')
    let extendLinePart = this.get('arrow') ? points.slice(2) : points.slice(-2)
    let dir = this.getLineDirection(extendLinePart)
    dir === 'H' ? labelCfg.style.align = 'right' : labelCfg.style.align = 'center'
    this.set('labelCfg', labelCfg)
    const labelId = graph.addShape(Util.mix({}, labelCfg, { parent: shapeMap[this.get('id')] }))
    this.set('labelId', labelId)
  }

  getLabelPosition () {
    const points = this.get('points')
    const lastPoint = this.get('arrow') ? points.slice(-3, -2) : points.slice(-1)
    return lastPoint[0]
  }

  updateLabelPosition () {
    if (!this.get('labelId')) return
    const points = this.get('points')
    let extendLinePart = this.get('arrow') ? points.slice(2) : points.slice(-2)
    let dir = this.getLineDirection(extendLinePart)
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    const labelShape = shapeMap[this.get('labelId')]
    const labelPosition = this.getLabelPosition()
    labelShape.update({ x: labelPosition.x, y: labelPosition.y, style: { align: dir === 'H' ? 'right' : 'center' } })
  }
  
  _getShapeCfg () {
    const shape = this.get('shape')
    const points = this._getPoints()
    shape.arrow = this.get('arrow')
    shape.points = points
    return shape
  }

  _getPoints () {
    const sourceAnchor = this.getSourceAnchor()
    const startAnchor = this.getStartAnchor()
    const startPoint = this.getStartPoint()
    const target = this.getTarget()
    let points = []
    if (target) {
      const endAnchor = this.getEndAnchor()
      const endPoint = this.getEndPoint()
      points = getPointsBetweenAA({ sourceAnchor, sm: startAnchor, sp: startPoint, em: endAnchor, ep: endPoint })
    } else {
      const endPoint = this.getEndPoint()
      points = getPointsBetweenAP({ sourceAnchor, sm: startAnchor, sp: startPoint, ep: endPoint })
    }

    this.set('points', points)
    return points
  }

  getSource () {
    const graph = this.get('graph')
    const source = graph.findById(this.get('source'))
    if (!source) {
      console.error(`未找到${this.get('source')}对应节点`)
      return []
    }
    return source
  }

  getSourceAnchor () {
    const graph = this.get('graph')
    return this.get('sourceAnchor') ? graph.findById(this.get('sourceAnchor')) : null
  }

  getStartAnchor () {
    const sourceAnchor = this.getSourceAnchor()
    let startAnchor = this.get('startAnchor')
    if (sourceAnchor) startAnchor = sourceAnchor.get('m')
    this.set('startAnchor', startAnchor)
    return startAnchor
  }

  getStartPoint () {
    const source = this.getSource()
    const startAnchor = this.get('startAnchor')
    const sourceAnchor = this.getSourceAnchor()
    const startPoint = sourceAnchor ? sourceAnchor.getPoint() : source.getAnchorPoint(startAnchor)
    this.set('startPoint', startPoint)
    return startPoint
  }

  getTarget () {
    const graph = this.get('graph')
    const target = graph.findById(this.get('target'))
    return target || null
  }

  getTargetAnchor () {
    const graph = this.get('graph')
    const targetAnchor = graph.findById(this.get('targetAnchor'))
    return targetAnchor
  }

  getEndAnchor () {
    const graph = this.get('graph')
    const targetAnchor = graph.findById(this.get('targetAnchor'))
    let endAnchor = this.get('endAnchor')
    if (targetAnchor) endAnchor = targetAnchor.get('m')
    this.set('endAnchor', endAnchor)
    return endAnchor
  }

  getEndPoint () {
    const shape = this.get('shape')
    const target = this.getTarget()
    const targetAnchor = this.getTargetAnchor()
    const endAnchor = this.getEndAnchor()
    const endPoint = targetAnchor ? targetAnchor.getPoint() : ( target ? target.getAnchorPoint(endAnchor) : shape.endPoint )
    if (!endPoint.x || !endPoint.y) Object.assign(endPoint, this.getStartPoint())
    this.set('endPoint', endPoint)
    return endPoint
  }

  getData () {
    const cfg = Util.pick(this._cfg, ['id', 'state', 'source', 'sourceAnchor', 'startAnchor', 'target', 'targetAnchor', 'endAnchor', 'props', 'label', 'cfgKey', 'points'])
    return cfg
  }

  getLineDirection (line = []) {
    let p1 = line[0] || {}
    let p2 = line[1] || {}
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

      // 锚点id

      sourceAnchor: '',

      targetAnchor: '',

      // 锚点matrix
      startAnchor: [],

      endAnchor: null,

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
    return {
      id: this.get('id')
    }
  }
}

export default Edge
