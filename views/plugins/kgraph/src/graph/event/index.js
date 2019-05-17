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
    const eventItemMap = graph.get('eventItemMap')
    if (!events) return
    Util.each(events, event => {
      const item = event.item
      const eventItem = eventItemMap[item.get('id')]
      const point = graph.getPointByClient(e.clientX, e.clientY)
      
      if (isPointIn(item, point)) {
        event.callback.apply(this, [e, event])
        if (!item.get('state').enter) {
          item.set('state', { enter: true })
          if (eventItem) {
            eventItem.mouseenter && eventItem.mouseenter.callback.apply(this, [e, event])
          }
        }
      } else if (item.get('state').enter) {
        item.set('state', { enter: false })
        if (eventItem) {
          eventItem.mouseleave && eventItem.mouseleave.callback.apply(this, [e, event])
        }
      }
    })
  }
}



export default Event