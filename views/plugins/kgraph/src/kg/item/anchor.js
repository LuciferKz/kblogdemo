import Base from './base'

class Anchor extends Base {
  constructor (cfg) {
    super(cfg)
  }
  
  _init () {
    super._init()
    const graph = this.get('graph')
    const parent = graph.findById(this.get('parent'))
    let dir = this.getPosition()
    let anchors = parent.get('anchors')
    anchors[dir] = this
    this.subscribe()
  }

  subscribe () {
    const graph = this.get('graph')
    const parent = graph.findById(this.get('parent'))
    parent.on('updatePosition', () => {
      const offset = this.get('offset')
      const point = parent.getAnchorPoint(this.get('m'), offset)
      this.updatePosition({ x: point.x + offset.x, y: point.y + offset.y })
    })
  }

  _getShapeCfg () {
    super._getShapeCfg()
    let shape = this.get('shape')
    shape.hidden = this.get('hidden')
    return shape
  }

  _getDefaultCfg () {
    return {
      x: 0,

      y: 0,

      state: {},

      hidden: false,

      position: '',

      m: [],
      // 点偏移 px
      offset: { x: 0, y: 0 },

      shape: {
        size: 5,

        type: 'circle',
  
        style: {
          lineWidth: 2,
  
          stroke: '#CCC',
  
          fill: '#FFF'
        }
      },

      cancelBubble: true,
      
      // 生成线点时首个点的偏移量
      edgeOffset: 25
    }
  }

  isPointIn (point) {
    const eventArea = this.get('eventArea') || {}
    const shape = this.get('shape')
    const r = eventArea.r || shape.size
    return this.pointDistance({ x: this._cfg.x, y: this._cfg.y }, point) < Math.pow(r, 2)
  }
  
  pointDistance (p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  }

  getPoint () {
    return { x: this.get('x'), y: this.get('y') }
  }
  
  getPosition () {
    const m = this.get('m')
    let dir
    if (m[0] === 0) {
      dir = 'left'
    } else if (m[0] === 1) {
      dir = 'right'
    } else if (m[1] === 0) {
      dir = 'top'
    } else if (m[1] === 1) {
      dir = 'bottom'
    }
    return dir
  }
}

export default Anchor