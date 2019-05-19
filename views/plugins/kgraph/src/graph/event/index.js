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
      
      if (isPointIn(item, point)) {

        event.callback.apply(this, [e, event])

        if (type === 'mousemove') {
          if (!state.enter) {
            item.setState('enter', true)
            this._emitEvent(item, 'mouseenter', e)
          }

          if (state.down && !state.draging) {
            const downPoint = item.get('down-point')
            const isDragStart = this._isDragStart([downPoint, point])

            if (isDragStart) {
              item.setState('draging', true)
              this._emitEvent(item, 'dragstart', e)
            }
          }
        }

        if (type === 'mousedown') {
          item.setState('down', true)
          item.set('down-point', point)
        }
      } else if (state.enter) {
        item.setState('enter', false)
        this._emitEvent(item, 'mouseleave', e)
      }

      if (type === 'mousemove') {
        if (state.draging) {
          this._emitEvent(item, 'drag', e)
        }
      }

      if (type === 'mouseup') {
        if (state.draging) {
          item.setState('draging', false)
          this._emitEvent(item, 'drop', e)
        }

        if (state.down) {
          item.setState('down', false)
        }
      }
    })
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
}



export default Event