import Item from './index'
import { anchorEvent } from '../../global';

const eventMap = {
  mousedown (e) {
    // console.log('anchor mousedown', e)
  },

  mouseenter (e) {
    // console.log('anchor mouseenter', e)
    this.update({
      size: 15,
      style: {
        fill: '#FF0'
      }
    })
  },

  mouseleave (e) {
    // console.log('anchor mouseleave', e)
    this.update({
      size: 5,
      style: {
        fill: '#FFF'
      }
    })
  },

  dragstart (e) {
    // console.log('anchor dragstart', e)
    const graph = this.get('graph')
    const clientX = e.clientX
    const clientY = e.clientY

    const activeEdge = graph.addItem('edge', {
      type: 'line',
      source: this.get('parent'),
      target: null,
      startAnchor: this.get('m'),
      endPoint: graph.getPointByClient(clientX, clientY),
      style: {
        stroke: '#00678a',
        lineWidth: 3
      }
    })
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
    this.update({
      size: 15,
      style: {
        fill: '#FF0'
      }
    })
    // console.log('anchor dragenter', e, this)
  },
  dragleave (e) {
    this.update({
      size: 5,
      style: {
        fill: '#FFF'
      }
    })
  },
  mouseup (e) {
    // console.log('anchor mouseup', e, this)
    const graph = this.get('graph')
    const activeEdge = graph.get('activeEdge')

    const source = graph.findById(activeEdge.get('source'))
    const target = graph.findById(this.get('parent'))

    activeEdge.update({
      target: this.get('parent'),
      endAnchor: this.get('m')
    })

    
    // console.log(activeEdge, source, target)

    const id = activeEdge.get('id')
    source.addEdge('out', id)
    target.addEdge('in', id)
  }
}

class Anchor extends Item {
  constructor (cfg) {
    super(cfg)
  }

  emit (evt, e) {
    eventMap[evt] && eventMap[evt].call(this, e)
  }

  isPointIn (point) {
    return this.pointDistance(this._getBox(), point) < 225
  }
  
  pointDistance (p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  }
}

export default Anchor