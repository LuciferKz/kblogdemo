import Base from './base'

class Anchor extends Base {
  _init () {
    const graph = this.get('graph')
    const parent = graph.findById(this.get('parent'))
    let dir = this.getPosition()
    let anchors = parent.get('anchors')
    anchors[dir] = this

    super._init()
  }

  isPointIn (point) {
    const eventRadius = this.get('eventRadius') || 10
    return this.pointDistance({ x: this._cfg.x, y: this._cfg.y }, point) < Math.pow(eventRadius, 2)
  }
  
  pointDistance (p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  }

  _getShapeCfg () {
    super._getShapeCfg()
    let shape = this.get('shape')
    shape.hidden = this.get('hidden')
    return shape
  }

  _getDefaultCfg () {
    return {
      state: {},

      hidden: false,

      position: '',

      m: [],

      shape: {
        size: 5,

        type: 'circle',
  
        style: {
          lineWidth: 2,
  
          stroke: '#CCC',
  
          fill: '#FFF'
        }
      }
    }
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