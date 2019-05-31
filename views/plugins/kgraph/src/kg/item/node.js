import Util from '../../util'
import Base from './base'
import Layer from '../../canvas/layer'

class Node extends Base {
  constructor (cfg) {
    // 必须重置的配置
    const defaultCfg = {
      /* 状态 */
      state: {},
      /* 子节点 */
      children: [],

      anchors: {},
    }

    super(Util.mix(cfg, defaultCfg))
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
  removeEdge (type, edge) {
    let edges = this.get(`${type}Edges`)
    let index = edges.indexOf(edge)
    edges.splice(index, 1)
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

    graph.paint()
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
  // _getShapeCfg () {
  //   return shape
  // }
  getData () {
    const cfg = this._cfg
    return {
      id: cfg.id,
      // 横坐标
      x: cfg.x,
      // 纵坐标
      y: cfg.y,
      // 状态
      state: cfg.state,
      // 出发线
      outEdges: cfg.outEdges,
      // 接入线
      inEdges: cfg.inEdges,
      // 自定义属性
      props: cfg.props,
      // 图形属性
      shape: cfg.shape,

      label: cfg.label,

      labelCfg: cfg.labelCfg,
    }
  }
  /**
   * 通过计算锚点和节点的位置关系获取在画布内坐标
   * @param {array} anchor
   */
  getAnchorPoint (m) {
    const box = this.get('box')
    let x = box.l + box.width * m[0]
    let y = box.t + box.height * m[1]
    return { x, y, m }
  }
  _getDefaultCfg () {
    return {
      /* 中心横坐标 */
      x: 0,
      /* 中心纵坐标 */
      y: 0,
      /* 模型 */
      box: {},
      /* 父级Id */
      parent: '',

      label: '',
      /* 所有锚点位置，每个锚点至少要有一个值是1or0 */
      anchorMatrix: [],
      /* 出发的线 */
      outEdges: [],
      /* 结束的线 */
      inEdges: [],

      labelCfg: {},
    }
  }
}

export default Node
