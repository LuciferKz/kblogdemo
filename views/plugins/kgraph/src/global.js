import Util from './util'
import kg from './kg'

export let refs = {}

export const customNode = {
  x: 150,
  y: 75,
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
  label: '开始',
  labelCfg: {
    offsetY: 80,
    style: {
      color: '#F00',
      size: '14px'
    }
  },
  event: true
}

export const circleNode = {
  event: true,
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
    type: 'line',
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
      borderRadius: 10,
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
  event: true
}

export const anchorCfg = {
  event: true,
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
  },
  alwaysShow: false
}

const edgeCfg = {
  event: true,
  shape : {
    type: 'polyline',
    style: {
      stroke: '#edeef4',
      lineWidth: 10
    }
  },
  stateShapeMap: {
    default: {
      type: 'polyline',
      style: {
        stroke: '#edeef4',
        lineWidth: 10
      }
    },
    hover: {
      style: {
        stroke: '#CCC'
      } 
    },
    focus: {
      style: {
        stroke: '#CCC'
      }
    }
  }
}

export function nodeEvent (node, refs, graph) {
  let debugEvent = true

  node.on('stateChange', function (key, val, state) {
    let item = this
    const graph = item.get('graph')
    const targetMap = graph.get('targetMap')
    const children = item.get('children')

    if (key === 'hover') {
      if (targetMap.focus !== item) {
        Util.each(children, child => {
          if (!child.get('alwaysShow')) {
            val ? child.show() : child.hide()
          }
        })
      }
    }

    if (key === 'focus') {
      targetMap.focus = val ? item : null
      Util.each(children, child => {
        if (!child.get('alwaysShow')) {
          val ? child.show() : child.hide()
        }
      })
    }
  })

  node.on('mouseenter', function (e) {
    debugEvent && console.log('mouseenter', e, refs.canvas)
    refs.canvas.css('cursor', 'move')
    // let item = e.target
    // let graph = item.get('graph')
    // let canvas = graph.get('canvas')
    // canvas.style.cursor = 
  })

  node.on('mousemove', function (e) {
  })

  node.on('mouseleave', function (e) {
    debugEvent && console.log('mouseleave', e)
    refs.canvas.css('cursor', 'auto')
  })

  node.on('mousedown', function (e) {
    debugEvent && console.log('mousedown', e)
  })

  node.on('click', function (e) {
    debugEvent && console.log('click', e)
  })

  node.on('mouseup', function (e) {
    debugEvent && console.log('mousedown', e)
  })

  const originPoint = { x: 0, y: 0 }
  let startPoint = { x: 0, y: 0 }

  node.on('dragstart', function (e) {
    debugEvent && console.log('dragstart', e)
    const item = e.target
    originPoint.x = item._cfg.x
    originPoint.y = item._cfg.y
    startPoint = graph.get('downPoint')
  })

  node.on('drag', function (e) {
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
      if (child.get('type') === 'anchor') {
        child.updatePosition(node.getAnchorPoint(child.get('m')))
      } else {
        child.updatePosition(node.get('box'))
      }
    })
    
    graph.setAutoPaint(true)
  })

  node.on('drop', function (e) {
    debugEvent && console.log('drop', e)
    if (!e.target || e.target.get('type') !== 'edge') return false
    const edge = e.target
    const point = { x: e.clientX, y: e.clientY };
    let linePart = edge.getPathPart(point);
    let midPoint = edge.getMidPoint(linePart);

    graph.setAutoPaint(false)
    // 移到中点位置
    node.update(midPoint)

    Util.each(node.get('children'), child => {
      if (child.get('type') === 'anchor') {
        child.updatePosition(node.getAnchorPoint(child.get('m')))
      } else {
        child.updatePosition(node.get('box'))
      }
    })

    // 截断前面部分的线，修改终点为当前节点
    let target = edge.get('target')
    edge.set('target', node.get('id'))
    // 从目标节点删除该连入线
    let targetNode = graph.findById(target)
    // 新增一条线，充作后面部分的线，连接拖拽节点和原先的目标节点
    let newEdgeCfg = Util.clone(edgeCfg)
    newEdgeCfg.source = node.get('id')
    newEdgeCfg.target = target
    newEdgeCfg.startAnchor = edge.get('startAnchor')
    newEdgeCfg.endAnchor = edge.get('endAnchor')
    newEdgeCfg.arrow = true
    let newEdge = graph.addItem('edge', newEdgeCfg)
    edgeEvent(newEdge)
    targetNode.removeEdge('in', edge.get('id'))
    targetNode.addEdge('in', newEdge.get('id'))
    node.addEdge('in', edge.get('id'))
    node.addEdge('out', newEdge.get('id'))
    edge.updatePath()
    graph.setAutoPaint(true)

    console.log(edge)
  })
}

const edgeEvent = function (edge) {
  edge.on('mouseenter', function (e) {
    console.log('edge mouseenter')
    const point = { x: e.clientX, y: e.clientY };
    if (this.getPointOnDir(point) === 'V') {
      refs.canvas.css('cursor', 'col-resize')
    } else if (this.getPointOnDir(point) === 'H') {
      refs.canvas.css('cursor', 'row-resize')
    } else {
      refs.canvas.css('cursor', 'col-resize')
    }
  })

  edge.on('mouseover', function () {
  })
  
  edge.on('mouseleave', function () {
    refs.canvas.css('cursor', 'auto')
    console.log('edge mouseleave')
  })

  edge.on('mousedown', function (e) {
    const graph = edge.get('graph')
    console.log(edge)
  })

  edge.on('dragenter', function (e) {
    console.log('dragenter', edge)
    const point = { x: e.clientX, y: e.clientY };
    let linePart = this.getPathPart(point)
    console.log(linePart)
    console.log(this.getMidPoint(linePart))
  })
}

export function anchorEvent (anchor) {
  
  const eventsMap = {
    mousedown (e) {
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

      const activeEdge = graph.addItem('edge', Util.mix({
        source: this.get('parent'),
        target: null,
        startAnchor: this.get('m'),
        endPoint: { x: clientX, y: clientY }
      }, edgeCfg))
      graph.set('activeEdge', activeEdge)
    },

    drag (e) {
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      const clientX = e.clientX
      const clientY = e.clientY
      activeEdge.update({
        endPoint: { x: clientX, y: clientY }  
      })
    },
    drop (e) {
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      if (e.target && e.target.get('type') === 'anchor') {
        const source = graph.findById(activeEdge.get('source'))
        const startAnchor = this
        const endAnchor = e.target
        const targetId = endAnchor.get('parent')
        const target = graph.findById(targetId)

        activeEdge.set('target', targetId)
        activeEdge.set('endAnchor', endAnchor.get('m'))
  
        const id = activeEdge.get('id')
        source.addEdge('out', id)
        target.addEdge('in', id)
        activeEdge.set('arrow', true)

        activeEdge.updatePath()
        startAnchor.setState('visited', true)
        endAnchor.setState('visited', true)
        edgeEvent(activeEdge)
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
        activeEdge.set('endAnchor', endAnchor.get('m'))
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

kg.registerNode('outline', item => {
  return class anchor extends item {
    _getShapeCfg () {
      const state = this.get('state')
      const stateShapeMap = this.get('stateShapeMap')
  
      let shape = this.get('shape')
      shape.x = this._cfg.x
      shape.y = this._cfg.y
      shape = Util.mix(shape, stateShapeMap.default)
      shape.points = this.getPoints()
      Util.each(state, (value, name) => {
        if (value) {
          Util.mix(shape, stateShapeMap[name])
        }
      })
      shape.hidden = this.get('hidden')
      return shape
    }

    getPoints () {
      const graph = this.get('graph')
      const parentId = this.get('parent')
      const parent = graph.findById(parentId)
      const box = parent.get('box')
      return [{ x: box.l - 10, y: box.t - 10 }, { x: box.r + 10, y: box.t - 10 }, { x: box.r + 10, y: box.b + 10  }, { x: box.l - 10, y: box.b + 10 }, { x: box.l - 10, y: box.t - 10 }]
    }
  
    getDefaultCfg () {
      return {
        state: {},

        stateShapeMap: {},
  
        hidden: false,

        shape: {
          
          type: 'line',

          style: {

            stroke: '#333',

            lineWidth: 3,

            lineDash: [8, 8],
            
            points: []
          }
        }
      }
    }
  
    updatePosition () {
      const shape = this.getShape()
      shape.update({ points: this.getPoints() })
    }
  }
})

export default kg