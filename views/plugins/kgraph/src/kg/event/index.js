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
  'drop',
  'focus',
  'blur',
];

class Event {
  constructor(graph) {
    this.graph = graph
    this.record = {}
    this._initEvents()
  }

  _initEvents() {
    const graph = this.graph
    const container = graph.get('container')
    const canvas = graph.get('canvas')
    const ca = canvas.get('canvas')
    const fn = this._canvasEvent()

    Util.each(EVENTS, evt => {
      document.addEventListener(evt, (e) => {
        if (e.target === ca) {
          fn(e)
        } else if (e.type === 'mousedown' && graph.get('state').focus) {
          graph.emit('blur', { type: 'blur', clientX: e.clientX, clientY: e.clientY, origin: e })
          graph.setState('focus', false)
        }
      })
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
      let _child = children ? Util.find(children, child => (child.isPointIn(point)) && child.get('event')) : null
      let isPointIn = false
      if (_child) {
        isPointIn = true
        item = _child
      } else {
        isPointIn = item.isPointIn(point)
      }

      if (isPointIn && activeEdge !== item && dragItem !== item && item.get('event')) {
        e.target = item
        items.push(item)
        return false
      }
    })

    e.items = items

    if (type === 'click') {
      let hasLongDelay = Date.now() - this.record.mousedown.timestamp > 300
      let hasMoved = (Math.abs(this.record.mousedown.point.x - point.x) || Math.abs(this.record.mousedown.point.y - point.y))
      if (hasLongDelay || hasMoved) return false
      if (!this.eventDelay) {
        this.eventDelay = setTimeout(() => { 
          graph.emit(type, e)
          this.eventDelay = null
        }, 300)
      }
    } else {
      switch (type) {
        case 'mousemove': 
          this._handleEventMousemove(e, items)
          break
        case 'mousedown':
          this._handleEventMousedown(e, items)
          break
        case 'mouseup':
          this._handleEventMouseup(e, items)
          break
        case 'dblclick':
          clearTimeout(this.eventDelay)
          this.eventDelay = null
          break
        default:
          if (items.length) {
            let item = items[0]
            item.emit(type, e)
          }
          break
      }
      graph.emit(type, e)
    }

    const state = graph.get('state')
    if (type === 'mousedown' && !state.focus) {
      graph.emit('focus', e)
      graph.setState('focus', true)
    }
  }

  _handleEventMousedown(e, items) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')

    
    this.record.mousedown = { timestamp: Date.now(), point: { x: e.clientX, y: e.clientY } }
    
    let item = items[0] // 暂时不处理冒泡多个节点

    if (item) {
      targetMap.mousedown = item
      this.downPoint = { x: e.clientX, y: e.clientY }
      item.emit('mousedown', e)
    }
  }

  _handleEventMouseup(e, items) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    let item = items[0] // 暂时不处理冒泡多个节点
    let drop = false

    
    if (targetMap.focus) {
      targetMap.focus = Util.filter(targetMap.focus, focusItem => {
        if (focusItem != item) {
          focusItem.setState('focus', false)
          return false
        } else {
          return true
        }
      })
    }

    if (targetMap.mousedown) {
      targetMap.mousedown = null
    }

    if (targetMap.drag) {
      drop = true
      targetMap.drag.emit('drop', e)
      targetMap.drag.emit('dragend', e)
      targetMap.drag = null
    }

    if (item && !drop) {
      if (Date.now() - this.record.mousedown.timestamp < 300 || (Math.abs(this.record.mousedown.point.x - e.clientX) < 10 && Math.abs(this.record.mousedown.point.y - e.clientY) < 10)) {
        item.setState('focus', true)
        targetMap.focus = [item]
        item.emit('click', e)
      }
      item.emit('mouseup', e)
    }
  }

  __handleEventMousemove(e, items) {
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
          // mousedownItem.setState('focus', true)
          targetMap.drag = mousedownItem
          mousedownItem.emit('dragstart', e)
        }
      } else if (dragItem) {
        // 有拖拽节点
        isDraging = true
        dragItem.emit('drag', e)
      } else if (!mousedownItem && mouseenterItem && (!mouseenterItem.isPointIn({ x: e.clientX, y: e.clientY }) || (item && mouseenterItem !== item))) {
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
            // && (!targetMap.focus || (targetMap.focus && !targetMap.focus.find(item => item === mouseenterItem)))
            if (!mousedownItem && mouseenterItem) {
              mouseenterItem.setState('focus', false)
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

  _handleEventMousemove (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const mousedownItem = targetMap.mousedown
    const mouseenterItem = targetMap.mouseenter
    const dragItem = targetMap.drag
    const dragenterItem = targetMap.dragenter
    const item = e.items[0]
    
    if (mousedownItem && !dragItem) {
      // 有点击节点 没有拖拽节点
      const downPoint = this.downPoint
      const isDragStart = this._isDragStart([downPoint, { x: e.clientX, y: e.clientY }])
      if (isDragStart) {
        targetMap.drag = mousedownItem
        mousedownItem.emit('dragstart', {
          clientX: downPoint.x,
          clientY: downPoint.y,
          target: mousedownItem,
          origin: e.origin
        })
      }
    }

    if (dragItem) {
      dragItem.emit('drag', e)
      if (dragenterItem !== item) {
        dragenterItem && this._handleEventDragleave(e)
        if (item) {
          this._handleEventDragenter(e)
        }
      }
    } else if (!dragItem) {
      if (mouseenterItem !== item) {
        mouseenterItem && this._handleEventMouseleave(e)
        if (item) {
          this._handleEventMouseenter(e)
        }
      }
    }
  }

  _handleEventMouseenter (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const item = e.items[0]
    /**
     * 处理mouseleave
     * 遍历所有父级验证是否都不包含点击点
     */ 
    targetMap.mouseenter = item
    parent = item
    const cancelBubble = item.get('cancelBubble')
    while (parent) {
      const state = parent.get('state')
      if (!state.hover) {
        if (parent === item || (parent !== item && !cancelBubble)) parent.emit('mouseenter', e)
        parent.setState('hover', true)
        parent = graph.findById(parent.get('parent'))
      } else {
        break
      }
    }
  }

  _handleEventMouseleave (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const mouseenterItem = targetMap.mouseenter
    const item = e.items[0]
    // 即将进入节点和已进入节点是否有关联，如果没有任何关联，不管鼠标位置都要对已进入节点进行leave操作
    const isRelated = item ? mouseenterItem.hasParent(item.get('id')) || item.hasParent(mouseenterItem.get('id')) : false
    /**
     * 处理mouseenter
     * 未阻止冒泡前提下，所有父级默认enter
     */
    targetMap.mouseenter = null
    let parent = mouseenterItem
    while (parent) {
      if (!isRelated || !parent.isPointIn({ x: e.clientX, y: e.clientY })) {
        parent.setState('hover', false)
        parent.emit('mouseleave', e)
        parent = graph.findById(parent.get('parent'))
      } else {
        targetMap.mouseenter = parent
        break
      }
    }
  }

  _handleEventDragenter (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const item = e.items[0]
    /**
     * 处理mouseleave
     * 遍历所有父级验证是否都不包含点击点
     */ 
    targetMap.dragenter = item
    parent = item
    const cancelBubble = item.get('cancelBubble')
    while (parent) {
      const state = parent.get('state')
      if (!state.hover) {
        if (parent === item || (parent !== item && !cancelBubble)) parent.emit('dragenter', e)
        parent.setState('hover', true)
        parent = graph.findById(parent.get('parent'))
      } else {
        break
      }
    }
  }

  _handleEventDragleave (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const dragenterItem = targetMap.dragenter
    const item = e.items[0]
    // 即将进入节点和已进入节点是否有关联，如果没有任何关联，不管鼠标位置都要对已进入节点进行leave操作
    const isRelated = item ? dragenterItem.hasParent(item.get('id')) || item.hasParent(dragenterItem.get('id')) : false
    /**
     * 处理dragenter
     * 未阻止冒泡前提下，所有父级默认enter
     */
    targetMap.dragenter = null
    let parent = dragenterItem
    while (parent) {
      if (!isRelated || !parent.isPointIn({ x: e.clientX, y: e.clientY })) {
        parent.setState('hover', false)
        parent.emit('dragleave', e)
        parent = graph.findById(parent.get('parent'))
      } else {
        targetMap.dragenter = parent
        break
      }
    }
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