import Util from '../../util'

function useShortcutKey (g) {
  window.addEventListener('keydown', (event) => {
    if (!g.get('state').focus) return false
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (window.event.shiftKey) keyCode = 'shift+' + keyCode;
    if (window.event.ctrlKey) keyCode = 'ctrl+' + keyCode;
    switch (keyCode) {
      case 8:
      case 46:
        g.$trigger('delete');
        break;
      case 'ctrl+67':
        g.$trigger('copy');
        break;
      case 'ctrl+86':
        g.$trigger('paste');
        break;
      case 'ctrl+90':
        g.$trigger('undo');
        break;
      case 'ctrl+shift+90':
        g.$trigger('redo');
        break;
      default: break;
    }
  })
}

function trigger (graph) {
  let events = {
    insert (cfg) {
      return graph.insert(cfg)
    },
    copy () {
      let targetMap = graph.get('targetMap')
      if (targetMap.focus.length > 1) return false
      let focusItem = targetMap.focus[0]
      graph.set('copiedItem', focusItem)
    },
    paste () {
      let newItem = graph.paste(graph.get('copiedItem'))
      graph.set('copiedItem', newItem)
      return newItem
    },
    delete () {
      let targetMap = graph.get('targetMap')
      let focusItems = targetMap.focus
      Util.each(focusItems, item => {
        graph.removeItem(item)
      })
      targetMap.focus = []
      return focusItems
    },
    tofront () {
      let targetMap = graph.get('targetMap')
      if (targetMap.focus.length > 1) return false
      let focusItem = targetMap.focus
      graph.tofront(focusItem)
    },
    toback () {
      let targetMap = graph.get('targetMap')
      if (targetMap.focus.length > 1) return false
      let focusItem = targetMap.focus
      graph.toback(focusItem)
    },
    undo () {
      let data = graph.$history.prevState()
      graph.render(data)
    },
    redo () {
      let data = graph.$history.nextState()
      graph.render(data)
    },
    zoomin () {
      graph.zoomin()
    },
    zoomout () {
      graph.zoomout()
    },
    fitpage () {
      graph.scale(1)
    },
    fitpagewidth () {
      const diagramWidth = graph.get('diagramWidth')
      const width = graph.get('width')
      graph.scale(width / diagramWidth)
    },
    clear () {
      graph.clear()
      graph.autoPaint()
    }
  }

  useShortcutKey(graph)
  
  return function (evt) {
    let args = Array.from(arguments).slice(1)
    let result = events[evt].apply(events, args)
    graph.saveData()
    let cb = args.pop()
    if (Util.isFunction(cb)) cb(result)
  }
}

export default trigger