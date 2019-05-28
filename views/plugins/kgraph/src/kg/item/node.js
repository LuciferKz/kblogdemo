import Util from '../../util'
import Base from './base'
import Layer from '../../canvas/layer'

class Node extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  _init () {
    const graph = this.get('graph')
    const nodeLayer = graph.get('nodeLayer')
    
    const shapeCfg = this.getShapeCfg()
    let shape = nodeLayer.addLayer(new Layer(shapeCfg))
    shape.parent = nodeLayer

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    // this._initOutline()
    this.getBox()
    this.addLabel()
  }
  /* 添加连线 */
  addEdge (type, edge) {
    this.get(`${type}Edges`).push(edge)
  }
  addLabel () {
    const graph = this.get('graph')
    const label = this.get('label')
    const defaultLabelCfg = {
      offsetX: 0,
      offsetY: 0
    }
    const shapeMap = graph.get('shapeMap')
    const labelCfg = Util.mix(defaultLabelCfg, this.get('labelCfg'))
    labelCfg.type = 'text'
    labelCfg.content = label
    labelCfg.x = this._cfg.x + labelCfg.offsetX
    labelCfg.y = this._cfg.y + labelCfg.offsetY
    labelCfg.parent = shapeMap[this.get('id')]
    this.set('labelCfg', labelCfg)
    const labelId = graph.addShape(labelCfg)
    this.set('labelId', labelId)
  }
  /* 设置状态 */
  setState (key, val) {
    super.setState(key, val)
    this.handleStateChange(key)
  }
  /* 处理状态变化 */
  handleStateChange (key) {
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    const state = this.get('state')

    graph.autoPaint()
  }
  /**
   * 更新位置
   * @param {object} cfg 
   */
  updatePosition (cfg) {
    super.updatePosition(cfg)
    const graph = this.get('graph')
    const shapeMap = graph.get('shapeMap')
    // const outlineCfg = this.get('outlineCfg')
    // outlineCfg.x = cfg.x
    // outlineCfg.y = cfg.y
    // const outline = shapeMap[this.get('outline')]
    // outline && outline.updatePosition(cfg.x, cfg.y)

    this.getBox()

    const outEdges = this.get('outEdges')
    Util.each(outEdges, id => {
      let edge = graph.findById(id)
      edge.updatePath()
    })

    const inEdges = this.get('inEdges')
    Util.each(inEdges, id => {
      let edge = graph.findById(id)
      edge.updatePath()
    })
    
    const labelId = this.get('labelId')
    if (labelId) {
      const label = shapeMap[labelId]
      if (label) {
        const labelCfg = this.get('labelCfg')
        label.update({ x: cfg.x + labelCfg.offsetX, y: cfg.y + labelCfg.offsetY })
      }
    }
  }
  /**
   * 获取图形配置
   */
  _getShapeCfg () {
    const shape = this.get('shape')
    Util.mix(shape, {
      x: this._cfg.x,
      y: this._cfg.y
    })
    return shape
  }
  getDefaultCfg () {
    return {
      /* 中心横坐标 */
      x: 0,
      /* 中心纵坐标 */
      y: 0,
      /* 状态 */
      state: {},
      /* 模型 */
      box: {},
      /* 父级Id */
      parent: '',
      /* 子节点 */
      children: [],
      /* 所有锚点位置，每个锚点至少要有一个值是1or0 */
      anchorMatrix: [],
      /* 出发的线 */
      outEdges: [],
      /* 结束的线 */
      inEdges: [],

      label: '',

      labelCfg: {}
    }
  }
}

export default Node
