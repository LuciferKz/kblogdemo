import Util from '@/util'
import { shapes } from './kg.config'
import $k from '@/util/dom'
import newElement from '@/util/dom/new-element'

/**
 * 
 * 实现节点的拖拽移动
 * 
 */

export const nodeDragAndDrop = function (node) {
  const debugEvent = false
  const graph = node.get('graph')
  const originPoint = { x: 0, y: 0 }
  const startPoint = { x: 0, y: 0 }

  node.on('dragstart', function (e) {
    debugEvent && console.log('dragstart', e)
    const item = node
    originPoint.x = item._cfg.x
    originPoint.y = item._cfg.y
    Object.assign(startPoint, { x: e.clientX, y: e.clientY })
  })

  node.on('drag', function (e) {
    debugEvent && console.log('drag', e)
    const clientX = e.clientX
    const clientY = e.clientY
    const startClientX = startPoint.x
    const startClientY = startPoint.y
    graph.updateItem(node, { x: originPoint.x + (clientX - startClientX), y: originPoint.y + (clientY - startClientY) })
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

/**
 * 
 * 实现节点hover时的cursor效果切换
 * 
 */

export const nodeHoverCursor = function (node) {
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

  node.on('mouseenter', function (e) {
    container.css('cursor', 'move')
  })

  node.on('mouseleave', function (e) {
    container.css('cursor', 'auto')
  })
}

/**
 * 
 * 实现暂停滚动功能
 * 
 */

export const nodeSwitchScroller = function (node) {
  const graph = node.get('graph')
  node.on('mouseenter', function (e) {
    graph.$scroller.pause()
  })

  node.on('mouseleave', function (e) {
    graph.$scroller.start()
  })
}

/**
 * 
 * 
 * 实现节点focus状态的切换
 * 
 */

export const nodeFocus = function (node) {

  node.on('blur', function (e) {
    let item = this
    const children = item.get('children')
    Util.each(children, child => {
      if (!child.get('alwaysShow')) child.hide()
    })
  })
}

/**
 * 
 * 实现锚点的连线即节点之间的关联
 */

export const nodeConnect = function (anchor) {
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

/**
 * 
 * 实现Edge在hover时的cursor效果切换
 * 
 */

export const edgeHoverCursor = function (edge) {
  const graph = edge.get('graph')
  const container = graph.get('container')
  
  edge.on('mouseenter', function (e) {
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

/**
 * 
 * 实现拖拽入场新增节点
 * 
 */

const createDragNode = function(x, y) {
  let width = 60
  let height = 60
  let dragNode = newElement({
    tag: 'div',
    style: {
      width: width + 'px',
      height: height + 'px',
      border: '1px dashed #333',
      position: 'absolute',
      left: x - width / 2 + 'px',
      top: y - height / 2 + 'px',
      zIndex: 9999,
      transform: 'translate(0, 0)'
    }
  })
  $k('body').append(dragNode)
  return dragNode
}

export const nodeCreateEvent = function(item, dom, graph) {
  let downPoint = {}
  let grabing = false
  let enter = false
  let dragNode
  let box = []
  let ratio = 1
  let pagePoint = {}

  let drag = function(e) {
    let clientX = e.clientX
    let clientY = e.clientY
    let pageX = e.pageX
    let pageY = e.pageY

    if (!grabing) {
      if (
        Math.abs(downPoint.x - clientX) > 10 ||
        Math.abs(downPoint.y - clientY) > 10
      ) {
        grabing = true
        // 画布外落点处新建 pageX和pageY
        dragNode = createDragNode(pagePoint.x, pagePoint.y)
        $k('body').css('cursor', 'move')
      } else {
        return false
      }
    }

    enter = clientX > box.l && clientX < box.r && clientY > box.t && clientY < box.b
    let scale = enter ? ratio : 1
    if (enter) {
      graph.$event.trigger(e)
    }
    const translateX = clientX - downPoint.x
    const translateY = clientY - downPoint.y
    dragNode.css({
      transform: `translate(${ translateX }px, ${ translateY }px) scale(${ scale })`
    })
  }

  let drop = function(e) {
    if (enter) {
      const point = graph.getPointByClient(e.clientX, e.clientY)
      item.x = point.x
      item.y = point.y
      const cfg = Object.assign({}, {
        cfgKey: item.cfgKey,
        props: item.props,
        shape: item.shape,
        label: item.label,
        isShowLabel: item.isShowLabel,
        vue: item.vue,
      }, { x: point.x, y: point.y })

      if (item.cfgKey === 'image') {
        cfg.shape = { img: item.icon.dom }
      }
      const newNode = graph.addItem('node', cfg)
      const targetMap = graph.get('targetMap')
      const mouseenter = targetMap.mouseenter
      if (mouseenter) newNode.emit('drop', { origin: e, clientX: point.x, clientY: point.y, target: mouseenter })
      graph.saveData()
    }
    $k('body').css('cursor', 'auto')
    if (dragNode) {
      dragNode.remove()
      dragNode = null
    }
    grabing = false
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', drop)
  }

  dom.on('mousedown', e => {
    if (e.which === 1) {
      downPoint.x = e.clientX
      downPoint.y = e.clientY

      box = graph.get('canvas').getBox()
      ratio = graph.get('ratio')
      pagePoint.x = e.pageX
      pagePoint.y = e.pageY

      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', drop)
    }
  })
}

/**
 * 
 * 实现节点的自动排布 
 * 
 * */

const generateArray = function(edges, nodeTable, graph) {
  let row = 0
  let col = 0
  let usedEdges = {}
  try {
    while (edges.length > 0) {
      const edgeId = edges.shift()
      const edge = graph.findById(edgeId)
      usedEdges[edgeId] = true
      const startAnchor = edge.get('startAnchor')
      const endAnchor = edge.get('endAnchor')
      const targetId = edge.get('target')
      const target = graph.findById(targetId)
      const sourceId = edge.get('source')
      const source = graph.findById(sourceId)
  
      const nodeRc = nodeTable[sourceId]
      let increaserow = false
      if (col > nodeRc.col) increaserow = true
      col = nodeRc.col
      
      if (startAnchor[1] < endAnchor[1]) {
        row--
      } else if (startAnchor[1] > endAnchor[1]) {
        row++
      }

      if (startAnchor[0] !== endAnchor[0]) {
        col++
      }
  
      nodeTable[targetId] = { row, col }
      
      // outedges.map(graph.findById.bind(graph))
      const outedges = Util.clone(target.get('outEdges'))
      .map(outedgeId => graph.findById(outedgeId)).sort((e1, e2) => {
        if (e2.get('endAnchor')[0] === 0) {
          return 1
        } else {
          return -1
        }
      })
  
      for (let j = outedges.length - 1; j >= 0; j--) {
        const outedgeId = outedges[j].get('id')
        if (!usedEdges[outedgeId]) edges.unshift(outedgeId)
      }
    }
  } catch (err) {
    throw err
  }
}

export function rearrange (graph) {
  const nodeTable = {}
  const nodes = graph.get('nodes')
  const _nodes = Util.filter(nodes, (node) => !node.get('inEdges').length)

  if (_nodes.length > 1) return
  const start = _nodes[0]

  if (start) {
    nodeTable[start.get('id')] = { row: 0, col: 0 }
    const edges = Util.clone(start.get('outEdges'))
    generateArray(edges, nodeTable, graph)
    let minRow = 0 // 整体画布向下移动数值
    Object.values(nodeTable).forEach((rc) => {
      if (rc && minRow > rc.row) minRow = rc.row
    })
    console.log(minRow)
    Util.each(nodeTable, (rc, id) => {
      const node = graph.findById(id)
      graph.updateItem(node, { x: rc.col * 120 + 100, y: (rc.row - minRow) * 120 + 50 })
    })
  }
}