import Util from './util'
import kg from './kg'
import { shapes } from './config'

export let refs = {}

export function genNodes (graph) {
  let cfg = shapes.rect
  cfg.x = Math.random() * 1000
  cfg.y = Math.random() * 400

  graph.addItem('node', cfg)

  let n = 0
  while (n < 5) {
    n++
    let cfg = shapes[['circle', 'diamond'][Math.floor(Math.random() * 2)]]
    cfg.x = Math.random() * 1000
    cfg.y = Math.random() * 400
    graph.addItem('node', cfg)
  }
}

export function rearrange (graph) {
  const generateArray = function (edges, arr, level) {
    Util.each(edges, edgeId => {
      let edge = graph.findById(edgeId)
      let id = edge.get('target')
      let node = nodeMap[id]
      if (node) {
        let index = arr[node.level].indexOf(node.target)
        delete arr[node.level][index]
      }
      let target = graph.findById(id)
      nodeMap[id] = { level, target }
      arr[level] ? arr[level].push(target) : arr[level] = [target]
      generateArray(target.get('outEdges'), arr, level + 1)
    })
  }

  const getArray = function () {
    const nodes = graph.get('nodes')
    let start
    Util.each(nodes, node => {
      if (node.get('props').key === 'start') {
        start = node
        return false
      }
    })
    let array = []
    array[0] = [start]
    generateArray(start.get('outEdges'), array, 1)
    return array
  }

  const nodeMap = {}
  const array = getArray()
  Util.each(array, (col, colIdx) => {
    Util.each(col, (row, rowIdx) => {
      if (row) {
        updatePosition(row, colIdx * 120 + 100, rowIdx * 120 + 50)
      }
    })
  })
}

// #f65259

// const gradient = ctx.createLinearGradient(this.start.x, this.start.y, this.start.x + this.opt.size, this.start.y);
// gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
// gradient.addColorStop(1, "transparent");

export function updatePosition (node, x, y) {
  const graph = node.get('graph')
  
  graph.setAutoPaint(false)

  graph.updateItem(node, { x, y })

  Util.each(node.get('children'), child => {
    if (child.get('type') === 'anchor') {
      child.updatePosition(node.getAnchorPoint(child.get('m')))
    } else {
      child.updatePosition(node.get('box'))
    }
  })
  
  graph.setAutoPaint(true)
}

export function nodeEvent (node) {
  if (!node) return false
  const debugEvent = false
  const graph = node.get('graph')
  const container = graph.get('container')

  node.on('stateChange', function (key, val, state) {
    let item = this
    const children = item.get('children')
    if (key === 'hover' && !state.focus) {
      Util.each(children, child => {
        if (!child.get('alwaysShow')) {
          val ? child.show() : child.hide()
        }
      })
    }
  })

  node.on('wheel', function (e) {
    debugEvent && console.log('wheel', e)
  })

  node.on('focus', function (e) {
    debugEvent && console.log('focus', e)
    // container.css('cursor', 'hover')
  })

  node.on('blur', function (e) {
    debugEvent && console.log('blur', e)
    let item = this
    const children = item.get('children')
    Util.each(children, child => {
      if (!child.get('alwaysShow')) child.hide()
    })
  })

  node.on('hover', function (e) {
    debugEvent && console.log('hover', e)
    // container.css('cursor', 'hover')
  })

  node.on('mouseenter', function (e) {
    debugEvent && console.log('mouseenter', e)
    graph.$scroller.pause()
    container.css('cursor', 'move')
  })

  node.on('mousemove', function (e) {
  })

  node.on('mouseleave', function (e) {
    // debugEvent && console.log('mouseleave', e)
    graph.$scroller.start()
    container.css('cursor', 'auto')
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
    const item = node
    originPoint.x = item._cfg.x
    originPoint.y = item._cfg.y
    startPoint = { x: e.clientX, y: e.clientY }
  })

  node.on('drag', function (e) {
    debugEvent && console.log('drag', e)
    const clientX = e.clientX
    const clientY = e.clientY
    const startClientX = startPoint.x
    const startClientY = startPoint.y
    updatePosition(node, originPoint.x + (clientX - startClientX), originPoint.y + (clientY - startClientY))
  })

  node.on('dragend', function (e) {
    debugEvent && console.log('drag', e)
  })

  node.on('drop', function (e) {
    debugEvent && console.log('drop', e)
    
    if (!e.target || e.target.get('type') !== 'edge') {
      graph.expandDiagram(node)
      graph.saveData()
      return false
    }
    const edge = e.target
    const point = { x: e.clientX, y: e.clientY }
    let linePart = edge.getPathPart(point)
    let midPoint = edge.getMidPoint(linePart)
    let endAnchor = edge.get('endAnchor')
    let dir = edge.getLineDirection(linePart)

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
    edge.set('endAnchor', dir === 'V' ? [0.5,0] : [0,0.5])
    // 从目标节点删除该连入线
    let targetNode = graph.findById(target)
    // 新增一条线，充作后面部分的线，连接拖拽节点和原先的目标节点
    let newEdge = graph.addItem('edge', {
      cfgKey: 'edge',
      source: node.get('id'),
      target: target,
      startAnchor: dir === 'V' ? [0.5,1] : [1,0.5],
      endAnchor,
      arrow: true
    })
    targetNode.removeEdge('in', edge.get('id'))
    targetNode.addEdge('in', newEdge.get('id'))
    node.addEdge('in', edge.get('id'))
    node.addEdge('out', newEdge.get('id'))
    edge.updatePath()
    graph.setAutoPaint(true)
  })
}

export function edgeEvent (edge) {
  const graph = edge.get('graph')
  const container = graph.get('container')
  
  edge.on('mouseenter', function (e) {
    // console.log('edge mouseenter', e.target.get('state').hover)
    const point = { x: e.clientX, y: e.clientY };
    const linePart = this.getPathPart(point)
    const dir = this.getLineDirection(linePart)
    if (dir === 'V') {
      container.css('cursor', 'col-resize')
    } else if (dir === 'H') {
      container.css('cursor', 'row-resize')
    } else {
      container.css('cursor', 'col-resize')
    }
  })
  edge.on('mouseleave', function (e) {
    container.css('cursor', 'auto')
  })
}

export function anchorEvent (anchor) {
  const anchorDebug = false
  const graph = anchor.get('graph')
  const container = graph.get('container')

  const eventsMap = {
    mousedown (e) {
    },

    mouseenter (e) {
      anchorDebug && console.log('anchor mouseenter', e)
      container.css('cursor', 'auto')
    },
    mouseleave (e) {
      if (e.target && e.target.get('type') === 'node') {
        container.css('cursor', 'move')
      }
    },
    dragstart (e) {
      anchorDebug && console.log('anchor dragstart', e)
      const graph = this.get('graph')
      const clientX = e.clientX
      const clientY = e.clientY

      const activeEdge = graph.addItem('edge', {
        cfgKey: 'edge',
        source: this.get('parent'),
        target: null,
        startAnchor: this.get('m'),
        endPoint: { x: clientX, y: clientY },
        shape: {
          parent: graph.get('canvas')
        },
        arrow: true
      })
      graph.set('activeEdge', activeEdge)
    },
    dragend (e) {
      anchorDebug && console.log('anchor dragend', e)
    },
    drag (e) {
      anchorDebug && console.log('anchor drag', e, this)
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
        const shape = graph.findShapeById(id)
        shape.parent.remove(shape)
        graph.get('edgeLayer').add(shape)
        graph.saveData()
      } else {
        graph.removeItem(activeEdge)
      }
      graph.set('activeEdge', null)
    },
    dragenter (e) {
      anchorDebug && console.log('anchor dragenter', e)
      const endAnchor = e.target
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      if (activeEdge) {
        activeEdge.set('target', endAnchor.get('parent'))
        activeEdge.set('endAnchor', endAnchor.get('m'))
      }

      this.update()
    },
    dragleave (e) {
      anchorDebug && console.log('anchor dragleave', e, this)
      const graph = this.get('graph')
      const activeEdge = graph.get('activeEdge')
      if (activeEdge) {
        activeEdge.set('target', null)
        activeEdge.set('endAnchor', null)
      }

      this.update()
    },
    mouseup (e) {
      anchorDebug && console.log('anchor mouseup', e, this)
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