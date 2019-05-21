import Util from '../../util';
import isPointIn from './util/isPointIn'

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

class Event {
  constructor (graph) {
    this.graph = graph
    this._initEvents()
  }

  _initEvents () {
    const graph = this.graph
    const canvas = graph.get('canvas')
    // console.log(canvas)

    Util.each(EVENTS, evt => {
      canvas.on(evt, this._canvasEvent())
    })
  }

  _canvasEvent () {
    const self = this
    return function (e) {
      self._handleEvents(e)
    }
  }

  _handleEvents (e) {
    const type = e.type
    if (type === 'mousemove') {
      this._handleEventMousemove(e)
    } else if (type === 'mousedown') {
      this._handleEventMousedown(e)
    } else if (type === 'mouseup') {
      this._handleEventMouseup(e)
    }
  }

  _handleEventMousedown (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const eventMap = graph.get('eventMap')
    const events = eventMap.mousedown

    if (!events) return
    Util.each(events, event => {
      let item = event.item
      let pointIn = false

      const point = graph.getPointByClient(e.clientX, e.clientY)
      const state = item.get('state')
      const option = Util.mix(this.getDefaultOption(), event.option)

      const activeAnchor = item.getActiveAnchor(point)
      
      if (activeAnchor) {
        item = activeAnchor
        pointIn = true
      } else {
        pointIn = item.isPointIn(point)
      }

      if (pointIn) {
        targetMap.mousedown = item
        item.setState('down', true)
        graph.set('downPoint', point)
        item.emit('mousedown', e)
        if (option.cancelBubble) return false
      }
    })
  }

  _handleEventMouseup (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const eventMap = graph.get('eventMap')
    const events = eventMap.mousedown
    
    if (targetMap.mousedown) {
      targetMap.mousedown.setState('down', false)
      targetMap.mousedown = null
    } 
    if (targetMap.drag) {
      targetMap.drag.emit('drop', e)
      targetMap.drag.setState('draging', false)
      targetMap.drag = null
    }

    if (!events) return
    Util.each(events, event => {
      let item = event.item
      let pointIn = false

      const point = graph.getPointByClient(e.clientX, e.clientY)
      const option = Util.mix(this.getDefaultOption(), event.option)

      const activeAnchor = item.getActiveAnchor(point)
      
      if (activeAnchor) {
        item = activeAnchor
        pointIn = true
      } else {
        pointIn = item.isPointIn(point)
      }

      if (pointIn) {
        item.emit('mouseup', e)
        if (option.cancelBubble) return false
      }
    })
  }

  _handleEventMousemove (e) {
    const graph = this.graph
    const targetMap = graph.get('targetMap')
    const eventMap = graph.get('eventMap')
    const events = eventMap.mousedown

    const point = graph.getPointByClient(e.clientX, e.clientY)

    let isDraging = false
    
    let mousedownItem = targetMap.mousedown
    let mouseenterItem = targetMap.mouseenter
    let dragenterItem = targetMap.dragenter
    let dragItem = targetMap.drag

    if (mousedownItem && !dragItem) {
      // 有点击节点 没有拖拽节点
      const downPoint = graph.get('downPoint')
      const isDragStart = this._isDragStart([downPoint, point])
      if (isDragStart) {
        mousedownItem.setState('draging', true)
        targetMap.drag = mousedownItem
        mousedownItem.emit('dragstart', e)
      }
    } else if (dragItem) {
      // 有拖拽节点
      isDraging = true
      dragItem.emit('drag', e)
    } else if (mouseenterItem && !mouseenterItem.isPointIn(point)) {
      mouseenterItem.setState('enter', false)
      mouseenterItem.emit('mouseleave', e)
      targetMap.mouseenter = null
      mouseenterItem = null
    }

    if (dragenterItem && !dragenterItem.isPointIn(point)) {
      targetMap.dragenter = null
      dragenterItem.emit('dragleave', e)
    }

    if (!events) return


    Util.each(events, event => {
      let item = event.item
      let pointIn = false

      const option = Util.mix(this.getDefaultOption(), event.option)
      
      const activeAnchor = item.getActiveAnchor(point)
        
      if (activeAnchor) {
        item = activeAnchor
        pointIn = true
      } else {
        pointIn = item.isPointIn(point)
      }

      if (pointIn) {
        if (!isDraging) {
          if (mouseenterItem !== item) {
            if (mouseenterItem) {
              mouseenterItem.setState('enter', false)
              mouseenterItem.emit('mouseleave', e)
            }
            item.setState('enter', true)
            targetMap.mouseenter = item
            item.emit('mouseenter', e)
          }
        } else {
          // item.setState('dragenter', true)
          if (!dragenterItem) {
            targetMap.dragenter = item
            item.emit('dragenter', e)
          }

          item.emit('mousemove', e)
        }
        if (option.cancelBubble) return false
      }
    })
  }

  getActiveChild () {
    const activeAnchor = item.getActiveAnchor(point)
      
    if (activeAnchor) {
      item = activeAnchor
      pointIn = true
    } else {
      pointIn = item.isPointIn(point)
    }

    return item
  }

  _isDragStart (points) {
    return Math.abs(points[0].x - points[1].x) > 10 || Math.abs(points[0].y - points[1].y) > 10
  }

  getDefaultOption () {
    return {
      cancelBubble: true
    }
  }
}



export default Event