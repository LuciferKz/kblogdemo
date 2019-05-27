import Util from '../../util'

function trigger (graph) {
  let events = {
    insert: function (cfg) {
      graph.insert(cfg)
    },
    copy: function () {
      let targetMap = graph.get('targetMap')
      let focusItem = targetMap.focus
      graph.set('copiedItem', focusItem)
    },
    paste: function () {
      return graph.paste(graph.get('copiedItem'))
    },
    delete: function () {
      let targetMap = graph.get('targetMap')
      let focusItem = targetMap.focus
      graph.removeItem(focusItem)
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
  
  return function (evt) {
    let args = Array.from(arguments).slice(1)
    let result = events[evt].apply(events, args)
    let cb = args.pop()
    if (Util.isFunction(cb)) cb(result)
  }
}

export default trigger