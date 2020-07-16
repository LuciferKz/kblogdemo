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
      const item = graph.insert(cfg)
      graph.saveData()
      return item
    },
    copy () {
      const targetMap = graph.get('targetMap')
      if (targetMap.focus.length > 1) return false
      const focusItem = targetMap.focus[0]
      const copiedItem = Util.pick(focusItem._cfg, ['x', 'y', 'label', 'props', 'cfgKey'])
      copiedItem.props = Util.clone(copiedItem.props)
      graph.set('copiedItem', copiedItem)
      graph.emit('afterCopyItem')
    },
    paste () {
      const copiedItem = graph.get('copiedItem')
      copiedItem.y += 50
      const newItem = graph.addItem('node', copiedItem)
      graph.set('copiedItem', copiedItem)
      graph.saveData()
      return newItem
    },
    delete () {
      const targetMap = graph.get('targetMap')
      const focusItems = targetMap.focus
      Util.each(focusItems, item => {
        graph.removeItem(item)
      })
      targetMap.focus = []
      graph.saveData()
      return focusItems
    },
    tofront () {
      const targetMap = graph.get('targetMap')
      if (targetMap.focus.length > 1) return false
      const focusItem = targetMap.focus
      graph.tofront(focusItem)
      graph.saveData()
    },
    toback () {
      const targetMap = graph.get('targetMap')
      if (targetMap.focus.length > 1) return false
      const focusItem = targetMap.focus
      graph.toback(focusItem)
      graph.saveData()
    },
    undo () {
      const data = graph.$history.prevState()
      graph.render(data)
    },
    redo () {
      const data = graph.$history.nextState()
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
    const args = Array.from(arguments).slice(1)
    const result = events[evt].apply(events, args)
    graph.emit(evt, result)
    // const cb = args.pop()
    // if (Util.isFunction(cb)) cb(result)
  }
}

export default trigger