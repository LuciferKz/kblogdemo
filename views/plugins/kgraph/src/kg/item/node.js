import Util from '../../util'
import Base from './base'
import Layer from '../../canvas/layer'
import { guid } from '../util'

class Node extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  _init () {
    // console.log('node', this, this._cfg)

    const graph = this.get('graph')
    const canvas = graph.get('canvas')
    
    const shapeCfg = this.getShapeCfg()
    let shape = canvas.addLayer(new Layer(shapeCfg))

    const shapeMap = graph.get('shapeMap')
    shapeMap[this.get('id')] = shape

    // this._initOutline()
    this.getBox()
  }
  /* 添加连线 */
  addEdge (type, edge) {
    this.get(`${type}Edges`).push(edge)
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
    const outlineCfg = this.get('outlineCfg')
    outlineCfg.x = cfg.x
    outlineCfg.y = cfg.y
    const outline = shapeMap[this.get('outline')]
    outline && outline.updatePosition(cfg.x, cfg.y)

    this.getBox()

    const outEdges = this.get('outEdges')
    // console.log('outEdges', outEdges)
    Util.each(outEdges, id => {
      let edge = graph.findById(id)
      edge.updatePath()
    })

    const inEdges = this.get('inEdges')
    // console.log('inEdges', inEdges)
    Util.each(inEdges, id => {
      let edge = graph.findById(id)
      edge.updatePath()
    })
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
      inEdges: []
    }
  }
}

export default Node
