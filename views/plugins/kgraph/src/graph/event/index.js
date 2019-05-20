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
    console.log(canvas)

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
    const graph = this.graph
    const events = graph.get('eventMap')[type]
    if (!events) return
    Util.each(events, event => {
      const item = event.item
      const point = graph.getPointByClient(e.clientX, e.clientY)
      const state = item.get('state')
      const option = Util.mix(this.getDefaultOption(), event.option)
      if(this._handleAnchorEvents(e, item)) return false
      if (type === 'mousemove') {
        if (state.down && !state.draging) {
          const downPoint = graph.get('downPoint')
          const isDragStart = this._isDragStart([downPoint, point])

          if (isDragStart) {
            item.setState('draging', true)
            graph.set('dragingItem', item)
            this._emitEvent(item, 'dragstart', e)
          }
        } else if (state.draging) {
          this._emitEvent(item, 'drag', e)
          return false
        }
      } else if (type === 'mouseup') {
        if (state.down) {
          graph.set('downPoint', null)
          item.setState('down', false)
          this._emitEvent(item, 'mouseup', e)
        }

        if (state.draging) {
          item.setState('draging', false)
          graph.set('dragingItem', null)
          this._emitEvent(item, 'drop', e)
        }
      }
      
      // console.log(events, item, isPointIn(item, point))

      if (isPointIn(item, point)) {
        event.callback.apply(this, [e, event])

        if (type === 'mousemove') {
          if (!state.enter) {
            const hoveringItem = graph.get('hoveringItem')
            hoveringItem && hoveringItem.setState('enter', false)
            item.setState('enter', true)
            graph.set('hoveringItem', item)
            this._emitEvent(item, 'mouseenter', e)
          }
          if (option.cancelBubble && !graph.get('dragingItem')) return false
        }

        if (type === 'mousedown') {
          item.setState('down', true)
          graph.set('downPoint', point)
          if (option.cancelBubble) return false
        }
      } else if (state.enter && !state.draging) {
        item.setState('enter', false)
        graph.set('hoveringItem', null)
        this._emitEvent(item, 'mouseleave', e)
      }
    })
  }

  _handleAnchorEvents (e, item) {
    const graph = item.get('graph')
    const type = e.type

    const clientX = e.clientX
    const clientY = e.clientY

    const point = graph.getPointByClient(clientX, clientY)
    const downPoint = graph.get('downPoint')

    const anchors = item.get('anchorPoints')
    const dragingAnchor = graph.get('dragingAnchor')
    const downAnchor = graph.get('downAnchor')

    let isPointIn = false

    Util.each(anchors, anchor => {
      let anchorPoint = { x: anchor._cfg.x, y: anchor._cfg.y }
      let distance = item.pointDistance(point, anchorPoint)
      // Math.sqrt(anchor.get('size'))
      if (distance < 225) {
        isPointIn = true
        if (type === 'mousedown') {
          item.updateAnchor(anchor, {
            style: {
              fill: '#0ff'
            }
          })

          graph.set('downPoint', point)
          graph.set('downAnchor', anchor)
          console.log('mousedown', anchor)
        } else if (type === 'mousemove') {
          graph.get('canvas').get('canvas').style.cursor = 'auto'
          graph.set('hoveringItem', null)
          item.setState('enter', false)
          // console.log('mousemove', anchor)
        }
      }
    })

    if (type === 'mousemove') {
      if (!dragingAnchor && downAnchor && (Math.abs(clientX - downPoint.x) > 10 || Math.abs(clientY - downPoint.y) > 10)) {
        graph.set('dragingAnchor', downAnchor)
        console.log('dragstart', downAnchor)
      } else if (dragingAnchor) {
        console.log('drag', dragingAnchor)
      }
    }

    if (type === 'mouseup') {
      if (downAnchor) {
        item.updateAnchor(downAnchor, {
          style: {
            fill: '#fff'
          }
        })

        graph.set('downPoint', null)
        graph.set('downAnchor', null)
        console.log('mouseup', dragingAnchor)
      }

      if (dragingAnchor) {
        graph.set('dragingAnchor', null)
        console.log('drop', dragingAnchor)
      }
    }

    return isPointIn
  }

  _emitEvent (item, type, e) {
    const graph = this.graph

    const eventItemMap = graph.get('eventItemMap')

    const eventItems = eventItemMap[item.get('id')]

    const event = eventItems[type]

    if (!event) return false

    const callback = event.callback

    callback.apply(item, [e, event])
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