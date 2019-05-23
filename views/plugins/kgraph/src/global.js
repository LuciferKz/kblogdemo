import Layer from './canvas/layer'
import Util from './util'
import kg from './kg'

const getActiveAnchor = function (point) {
  const anchors = this.get('anchors')
  return Util.find(anchors, anchor => {
    const shape = anchor.get('shape')
    return this.pointDistance({ x: anchor._cfg.x, y: anchor._cfg.y }, point) < 225
  })
}

const createAnchors = function (item) {
  const anchorMatrix = item.get('anchorMatrix')
  const anchorCfg = item.get('anchorCfg')
  const anchors = item.get('anchors')
  const anchorMap = item.get('anchorMap')

  Util.each(anchorMatrix, anchor => {
    let anchorPoint = item.getAnchorPoint(anchor)
    let id = guid()
    anchorPoint.id = id
    anchorPoint.parent = item.get('id')
    anchorPoint.graph = item.get('graph')
    let newAnchorCfg = Util.deepMix(anchorPoint, anchorCfg)
    let newAnchor = new Anchor(newAnchorCfg)
    anchors.push(newAnchor)
    anchorMap[id] = newAnchor
  })
}

const createNode = function () {
  
  graph.on('afterAddItem', item => {
    createAnchors(item)
  })

}

export let refs = {}

export const customNode = {
  x: 150,
  y: 55,
  shape: {
    type: 'rect',
    size: [100, 100],
    style: {
      stroke: '#00678a',
      fill: '#eee',
      lineWidth: 2,
    }
  },
  props: {
    key: 'start',
    value: 'Start'
  },
  anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  outlineCfg: {
    type: 'rect',
    size: [120, 120],
    style: {
      stroke: '#000',
      lineWidth: 2,
      lineDash: [8, 8],
    }
  }
}

export const circleNode = {
  shape: {
    type: 'circle',
    size: 50,
    style: {
      stroke: '#00678a',
      fill: '#eee',
      lineWidth: 2,
    }
  },
  props: {
    key: 'wait',
    value: 'wait'
  },
  anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  outlineCfg: {
    type: 'rect',
    size: [120, 120],
    style: {
      stroke: '#000',
      lineWidth: 2,
      lineDash: [8, 8],
    }
  }
}

export const diamondNode = {
  shape: {
    type: 'diamond',
    size: [100, 100],
    style: {
      stroke: '#00678a',
      fill: '#eee',
      lineWidth: 2,
    }
  },
  props: {
    key: 'end',
    value: 'end'
  },
  anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  outlineCfg: {
    type: 'rect',
    size: [120, 120],
    style: {
      stroke: '#000',
      lineWidth: 2,
      lineDash: [8, 8],
    }
  }
}

export const anchorCfg = {
  shape: {
    size: 5,
    style: {
      lineWidth: 2,

      stroke: '#00678a',

      fill: '#FFF',
      
    }
  },
  stateShapeMap: {
    default: {
      size: 5,
      style: {
        lineWidth: 2,
        stroke: '#00678a',
        fill: '#FFF',
      }
    },
    active: {
      size: 15,
      style: {
        lineWidth: 2,
        stroke: '#CCC',
        fill: '#FFB2B2'
      }
    },
    hover: {
      size: 15,
      style: {
        lineWidth: 2,
        stroke: '#CCC',
        fill: '#FFB2B2'
      }
    },
    visited: {
      size: 5,
      style: {
        lineWidth: 2,
        stroke: '#CCC',
        fill: '#FFB2B2'
      }
    }
  }
}

export function nodeEvent (node, refs, graph) {
  
  let down = false

  let debugEvent = false

  node.on('mouseenter', function (e, event) {
    debugEvent && console.log('mouseenter', e, event)
    refs.canvas.css('cursor', 'move')
  })

  node.on('mousemove', function (e) {
  })

  node.on('mouseleave', function (e) {
    debugEvent && console.log('mouseleave', e)
    refs.canvas.css('cursor', 'auto')
  })

  node.on('mousedown', function (e) {
    down = true
    debugEvent && console.log('mousedown', e)
  })

  node.on('click', function (e) {
    debugEvent && console.log('click', e)
  })

  node.on('mouseup', function (e) {
    down = false
    debugEvent && console.log('mousedown', e)
  })

  const originPoint = { x: 0, y: 0 }
  let startPoint = { x: 0, y: 0 }

  node.on('dragstart', function (e, event) {
    debugEvent && console.log('dragstart', e)
    const item = event.item
    originPoint.x = item._cfg.x
    originPoint.y = item._cfg.y
    startPoint = graph.get('downPoint')
    startPoint.y += 40
  })

  node.on('drag', function (e, event) {
    // debugEvent && console.log('drag', e)
    const clientX = e.clientX
    const clientY = e.clientY
    const startClientX = startPoint.x
    const startClientY = startPoint.y
    
    graph.setAutoPaint(false)

    graph.updateItem(node, {
      x: originPoint.x + (clientX - startClientX),
      y: originPoint.y + (clientY - startClientY)
    })

    Util.each(node.get('children'), child => {
      let childX = child._cfg.x
      let childY = child._cfg.y
      child.updatePosition()
    })
    
    graph.setAutoPaint(true)
  })

  node.on('drop', function (e) {
    debugEvent && console.log('drop', e)
  })
}

export function anchorEvent (anchor) {
  
  const eventsMap = {
    mousedown (e) {
      console.log('anchor mousedown', e)
    },

    mouseenter (e) {
      const graph = this.get('graph')
      
      let parent = graph.findById(this.get('parent'))
      while (parent) {
        parent.setState('hover', true)
        parent = graph.findById(parent.get('parent'))
      }

      this.update()
    },

    mouseleave (e) {
      const graph = this.get('graph')
      
      let parent = graph.findById(this.get('parent'))
      while (parent) {
        parent.setState('hover', false)
        parent = graph.findById(parent.get('parent'))
      }
      
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
      graph.set('activeEdge', activeEdge)
    },

    drag (e) {
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      const clientX = e.clientX
      const clientY = e.clientY
      activeEdge.update({
        endPoint: graph.getPointByClient(clientX, clientY)  
      })
    },
    drop (e) {
      console.log('anchor drop', e, this)
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      if (e.target) {
        const source = graph.findById(activeEdge.get('source'))
        const endAnchor = e.target
        const target = graph.findById(endAnchor.get('parent'))

        activeEdge.set('target', endAnchor.get('parent'))
        activeEdge.set('endAnchor', endAnchor.get('id'))
  
        const id = activeEdge.get('id')
        source.addEdge('out', id)
        target.addEdge('in', id)
        activeEdge.updatePath()
  
        graph.findById(activeEdge.get('startAnchor')).setState('visited', true)
        endAnchor.setState('visited', true)
      } else {
        graph.removeItem(activeEdge)
      }
      graph.set('activeEdge', null)
    },
    dragenter (e) {
      const endAnchor = e.target
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      if (activeEdge) {
        activeEdge.set('target', endAnchor.get('parent'))
        activeEdge.set('endAnchor', endAnchor.get('id'))
      }


      this.update()
      // console.log('anchor dragenter', e, this)
    },
    dragleave (e) {
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      if (activeEdge) {
        activeEdge.set('target', null)
        activeEdge.set('endAnchor', null)
      }

      this.update()
      // console.log('anchor dragleave', e, this)
    },
    mouseup (e) {
      console.log('anchor mouseup', e, this)
    }
  }
  
  Util.each(eventsMap, (fn, evt) => {
    anchor.on(evt, fn)
  })
}

export function edgeEvent (edge) {

}

kg.registerNode('anchor', item => {
  return class anchor extends item {
    _init () {
      const point = this.getAnchorPoint()
      this._cfg.x = point.x
      this._cfg.y = point.y
      super._init()
      // Util.each(eventMap, (fn, name) => {
      //   this.on(name, fn)
      // })
      // this.hide()
    }
  
    isPointIn (point) {
      return this.pointDistance({ x: this._cfg.x, y: this._cfg.y }, point) < 225
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
      shape.hidden = this.get('hidden')
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
  
    updatePosition () {
      let point = this.getAnchorPoint(this.get('m'))
      delete point.m
      this._cfg.x = point.x
      this._cfg.y = point.y
      const shape = this.getShape()
      shape.update(point)
    }
    /**
     * 通过计算锚点和节点的位置关系获取在画布内坐标
     * @param {array} anchor
     */
    getAnchorPoint () {
      const graph = this.get('graph')
      const item = graph.findById(this.get('parent'))
      const box = item.get('box')
      const m = this.get('m')
      let x = box.l + box.width * m[0]
      let y = box.t + box.height * m[1]
      return { x, y, m }
    }
  }
})

export default kg