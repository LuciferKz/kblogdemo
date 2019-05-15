import Util from '../util'

let graph = {}

let events = {
  insert: function (cfg) {
    graph.insert(cfg)
  },
  copy: function (item) {
    graph.paste(item)
  },
  paste: function (item) {
    graph.paste(item)
  },
  remove: function (item) {
    graph.remove(item)
  },
  tofront: function (item) {
    graph.tofront(item)
  },
  toback: function (item) {
    graph.toback(item)
  },
  undo: function () {
    graph.undo()
  },
  redo: function () {
    graph.redo()
  },
  zoomin: function () {
    graph.zoomin()
  },
  zoomout: function () {
    graph.zoomout()
  },
  fitpage: function () {
    graph.fitpage()
  },
  fitpagewidth: function () {
    graph.fitpagewidth()
  }
}

let trigger = function (evt) {
  let args = Array.from(arguments).slice(1)
  events[evt].apply(events, args)
  let cb = args.pop()
  if (Util.isFunction(cb)) cb()
}

export default trigger