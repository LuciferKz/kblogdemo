import Item from './index'
import { anchorEvent } from '../../global';
import Util from '../../util';

const eventMap = {
  mousedown (e) {
    // console.log('anchor mousedown', e)
  },

  mouseenter (e) {
    this.update()
  },

  mouseleave (e) {
    this.update()
  },

  dragstart (e) {
    // console.log('anchor dragstart', e)
    const graph = this.get('graph')
    const clientX = e.clientX
    const clientY = e.clientY

    const activeEdge = graph.addItem('edge', {
      source: this.get('parent'),
      target: null,
      startAnchor: this.get('id'),
      endPoint: graph.getPointByClient(clientX, clientY),
      shape : {
        type: 'polyline',
        style: {
          stroke: '#00678a',
          lineWidth: 3
        }
      }
    })
    console.log(activeEdge)
    graph.set('activeEdge', activeEdge)
  },

  drag (e) {
    const graph = this.get('graph')
    const clientX = e.clientX
    const clientY = e.clientY
    const activeEdge = graph.get('activeEdge')
    activeEdge.update({
      endPoint: graph.getPointByClient(clientX, clientY)  
    })
  },
  drop (e) {
    // console.log('anchor drop', e, this)
  },
  dragenter (e) {
    this.update()
    console.log('anchor dragenter', e, this)
  },
  dragleave (e) {
    this.update()
    console.log('anchor dragleave', e, this)
  },
  mouseup (e) {
    // console.log('anchor mouseup', e, this)
    const graph = this.get('graph')
    const activeEdge = graph.get('activeEdge')

    const source = graph.findById(activeEdge.get('source'))
    const target = graph.findById(this.get('parent'))

    activeEdge.set('target', this.get('parent'))
    activeEdge.set('endAnchor', this.get('id'))

    const id = activeEdge.get('id')
    source.addEdge('out', id)
    target.addEdge('in', id)
    activeEdge.updatePath()

    source.findAnchorById(activeEdge.get('startAnchor')).setState('visited', true)
    this.setState('visited', true)
  }
}

class Anchor extends Item {
  constructor (cfg) {
    super(cfg)
  }

  // emit (evt, e) {
  //   eventMap[evt] && eventMap[evt].call(this, e)
  // }

  _init () {
    super._init()
    Util.each(eventMap, (fn, name) => {
      this.on(name, fn)
    })
  }

  isPointIn (point) {
    return this.pointDistance(this._getBox(), point) < 225
  }
  
  pointDistance (p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  }

  _getShapeCfg () {
    const state = this.get('state')
    const stateShapeMap = this.get('stateShapeMap')

    let shape = this.get('shape')
    shape.x = this._cfg.x
    shape.y = this._cfg.y
    shape = Util.mix(shape, stateShapeMap.default)
    Util.each(state, (value, name) => {
      if (value) {
        Util.mix(shape, stateShapeMap[name])
      }
    })
    return shape
  }

  getDefaultCfg () {
    return {
      state: {},

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
}

export default Anchor