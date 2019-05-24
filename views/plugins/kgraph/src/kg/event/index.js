import Util from '../../util';

const EVENTS = [
  'click',
  'mousedown',
  'mouseup',
  'dblclick',
  'contextmenu',
  'mouseenter',
  'mouseout',
  'mouseover',
  'mousemove',
  'mouseleave',
  'dragstart',
  'dragend',
  'drag',
  'dragenter',
  'dragleave',
  'drop'
];

// const debounce = function (fn, delay) {
//   return function () {
//     setTimeout(() => {
//       fn.apply(this, [].slice.call(arguments))
//     }, delay)
//   }
// }

const requestFrame = window.requestAnimationFrame

class Event {
  constructor(graph) {
    this.graph = graph
    this._initEvents()
  }

  _initEvents() {
    const graph = this.graph
    const canvas = graph.get('canvas')
    // console.log(canvas)

    Util.each(EVENTS, evt => {
      canvas.on(evt, this._canvasEvent())
    })
  }

  _canvasEvent() {
    const self = this
    return function (e) {
      self._handleEvents({
        type: e.type,
        clientX: e.clientX,
        clientY: e.clientY,
        origin: e
      })
    }
  }

  _handleEvents(e) {
    const type = e.type
    const graph = this.graph
    const nodes = graph.get('nodes')
    const edges = graph.get('edges')
    const eventItemMap = graph.get('eventItemMap')
    const activeEdge = graph.get('activeEdge')
    const targetMap = graph.get('targetMap')
    const dragItem = targetMap.drag
    const point = graph.getPointByClient(e.clientX, e.clientY)
    e.clientX = point.x
    e.clientY = point.y
    const items = []
    Util.each(nodes.concat(edges), item => {
      let children = item.get('children')
      let _child = children ? Util.find(children, child => child.isPointIn(point)) : null
      // console.log(_child)
      let isPointIn = false
      if (_child) {
        isPointIn = true
        item = _child
      } else {
        isPointIn = item.isPointIn(point)
      }
      if (isPointIn && activeEdge !== item && dragItem !== item) {
        e.target = item
        let id = item.get('id')
        items.push(item)
        return false
      }
    })

    if (type === 'mousemove') {
      this._handleEventMousemove(e, items)
    } else if (type === 'mousedown') {
      this._handleEventMousedown(e, items)
    } else if (type === 'mouseup') {
      this._handleEventMouseup(e, items)
    }
  }

  _handleEventMousedown(e, items) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    let item = items[0] // 暂时不处理冒泡多个节点

    let focusItem = targetMap.focus
    if (focusItem) {
      focusItem.setState('focus', false)
      targetMap.focus = null
    }

    if (item) {
      targetMap.mousedown = item
      item.setState('focus', true)
      targetMap.focus = item
      item.setState('active', true)
      graph.set('downPoint', { x: e.clientX, y: e.clientY })
      item.emit('mousedown', e)
    }
  }

  _handleEventMouseup(e, items) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    let item = items[0] // 暂时不处理冒泡多个节点
    let drop = false

    if (targetMap.mousedown) {
      targetMap.mousedown.setState('active', false)
      targetMap.mousedown = null
    }
    if (targetMap.drag) {
      drop = true
      targetMap.drag.emit('drop', e)
      targetMap.drag.setState('active', false)
      targetMap.drag = null
    }

    if (item && !drop) {
      item.emit('mouseup', e)
    }
  }

  _handleEventMousemove(e, items) {
    // requestFrame(() => {
      const graph = this.graph
      const targetMap = graph.get('targetMap')
      let item = items[0]
  
      let isDraging = false
  
      let mousedownItem = targetMap.mousedown
      let mouseenterItem = targetMap.mouseenter
      let dragenterItem = targetMap.dragenter
      let dragItem = targetMap.drag
  
      if (mousedownItem && !dragItem) {
        // 有点击节点 没有拖拽节点
        const downPoint = graph.get('downPoint')
        const isDragStart = this._isDragStart([downPoint, { x: e.clientX, y: e.clientY }])
        if (isDragStart) {
          mousedownItem.setState('active', true)
          targetMap.drag = mousedownItem
          mousedownItem.emit('dragstart', e)
        }
      } else if (dragItem) {
        // console.log('drag')
        // 有拖拽节点
        isDraging = true
        dragItem.emit('drag', e)
      } else if (mouseenterItem && !mouseenterItem.isPointIn({ x: e.clientX, y: e.clientY })) {
        // console.log('mouseleave')
        targetMap.mouseenter = null
        mouseenterItem.setState('hover', false)
        mouseenterItem.emit('mouseleave', e)
        mouseenterItem = null
      }
  
      if (dragenterItem && !dragenterItem.isPointIn({ x: e.clientX, y: e.clientY })) {
        targetMap.dragenter = null
        dragenterItem.setState('hover', false)
        dragenterItem.emit('dragleave', e)
      }
  
      if (item) {
        if (!isDraging) {
          if (targetMap.mouseenter !== item) {
            if (mouseenterItem) {
              mouseenterItem.setState('active', false)
              mouseenterItem.emit('mouseleave', e)
            }
            item.setState('hover', true)
            targetMap.mouseenter = item
            item.emit('mouseenter', e)
          }
        } else {
          // 没有dragenter的对象，且当前进入对象不是连接中的路线
          if (!dragenterItem && dragItem !== item && graph.get('activeEdge') !== item) {
            targetMap.dragenter = item
            item.setState('hover', true)
            item.emit('dragenter', e)
          }
  
          item.emit('mousemove', e)
        }
      }
    // })
  }

  _isDragStart(points) {
    return Math.abs(points[0].x - points[1].x) > 5 || Math.abs(points[0].y - points[1].y) > 5
  }

  getDefaultOption() {
    return {
      cancelBubble: true
    }
  }
}



export default Event