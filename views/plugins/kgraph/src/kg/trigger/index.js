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
      let newItem = graph.paste(graph.get('copiedItem'))
      graph.set('copiedItem', newItem)
      return newItem
    },
    delete: function () {
      let targetMap = graph.get('targetMap')
      let focusItem = targetMap.focus
      graph.removeItem(focusItem)
    },
    tofront: function () {
      let targetMap = graph.get('targetMap')
      let focusItem = targetMap.focus
      graph.tofront(focusItem)
    },
    toback: function () {
      let targetMap = graph.get('targetMap')
      let focusItem = targetMap.focus
      graph.toback(focusItem)
    },
    undo: function () {
      let data = graph.$history.prevState()
      console.log(data)
      graph.render(data)
    },
    redo: function () {
      let data = graph.$history.nextState()
      console.log(data)
      graph.render(data)
    },
    zoomin: function () {
      graph.zoomin()
    },
    zoomout: function () {
      graph.zoomout()
    },
    fitpage: function () {
      graph.scale(1)
    },
    fitpagewidth: function () {
      const diagramWidth = graph.get('diagramWidth')
      const width = graph.get('width')
      graph.scale(width / diagramWidth)
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