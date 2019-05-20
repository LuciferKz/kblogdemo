import Layer from './canvas/layer'

const createNode = function () {
  const START_ICON = ''
  const WAIT_ICON = ''
  const END_ICON = ''
  console.log(START_ICON)

  let x = 100
  let y = 50

  let nodeBox = new Layer({
    id: 1,
    type: 'rect',
    x: x + 50,
    y: y + 25,
    size: [100, 50],
    style: {
      stroke: '#00678a',
      fill: '#eee',
      lineWidth: 2,
    },
    props: {
      key: 'start',
      value: 'Start'
    },
    isGuid: true
  }, '节点')
  nodeBox.addShape({
    id: 2,
    type: 'text',
    x: x + 10,
    y: y + 12,
    size: 24,
    content: END_ICON,
    style: {
      baseline: "top",
      color: "#00678a",
      weight: "normal",
      family: "iconfont",
      align: "left",
      shadowBlur: 0,
      shadowColor: "#000",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      stroke: false,
    },
    props: {
    }
  })
  nodeBox.addShape({
    id: 2,
    type: 'text',
    x: x + 55,
    y: y + 25,
    size: 12,
    content: "开始",
    style: {
      baseline: "middle",
      color: "#000",
      weight: "normal",
      family: "黑体",
      align: "left",
      shadowBlur: 0,
      shadowColor: "#000",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      stroke: false,
    },
    props: {
    }
  })
  return nodeBox
}



export let refs = {}

export const customNode = {
  type: 'rect',
  x: 150,
  y: 55,
  size: [100, 50],
  style: {
    stroke: '#00678a',
    fill: '#eee',
    lineWidth: 2,
  },
  props: {
    key: 'start',
    value: 'Start'
  },
  anchors: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
  anchorCfg: {
    size: 5,
    style: {
      stroke: '#00678a',
      lineWidth: 2
    }
  }
}

export const circleNode = {
  type: 'circle',
  size: 25,
  style: {
    stroke: '#00678a',
    fill: '#eee',
    lineWidth: 2,
  },
  props: {
    key: 'wait',
    value: 'wait'
  }
}

export const diamondNode = {
  type: 'diamond',
  size: [100, 100],
  style: {
    stroke: '#00678a',
    fill: '#eee',
    lineWidth: 2,
  },
  props: {
    key: 'end',
    value: 'end'
  }
}

export function addEvent (node, refs, graph) {
  
  let down = false

  let debugEvent = false

  node.on('mouseenter', function (e, event) {
    debugEvent && console.log('mouseenter', e, event)
    refs.canvas.css('cursor', 'move')
  })

  node.on('mousemove', function (e) {
  })

  node.on('mouseleave', function (e) {
    debugEvent && console.log('mouseleave', e)
    refs.canvas.css('cursor', 'auto')
  })

  node.on('mousedown', function (e) {
    down = true
    debugEvent && console.log('mousedown', e)
  })

  node.on('click', function (e) {
    debugEvent && console.log('click', e)
  })

  node.on('mouseup', function (e) {
    down = false
    debugEvent && console.log('mousedown', e)
  })

  const originPoint = { x: 0, y: 0 }
  let startPoint = { x: 0, y: 0 }

  node.on('dragstart', function (e, event) {
    debugEvent && console.log('dragstart', e)
    const item = event.item
    originPoint.x = item._cfg.x
    originPoint.y = item._cfg.y
    startPoint = graph.get('downPoint')
    startPoint.y += 40
    console.log(startPoint)
  })

  node.on('drag', function (e, event) {
    // debugEvent && console.log('drag', e)
    const clientX = e.clientX
    const clientY = e.clientY
    const startClientX = startPoint.x
    const startClientY = startPoint.y

    graph.updateItem(node, {
      x: originPoint.x + (clientX - startClientX),
      y: originPoint.y + (clientY - startClientY)
    })
  })

  node.on('drop', function (e) {
    debugEvent && console.log('drop', e)
  })

  console.log('addEvent', graph)
}

export function anchorEvent (anchor) {
  console.log('anchorEvent', anchor)
  let debugEvent = true

  anchor.on('mouseenter', (e) => {
    debugEvent && console.log('mouseenter', e, event)
    refs.canvas.css('cursor', 'auto')
  })

  anchor.on('mousedown', (e) => {
    debugEvent && console.log('mousedown', e, event)
    refs.canvas.css('cursor', 'auto')
  })

  anchor.on('mouseleave', (e) => {
    debugEvent && console.log('mouseleave', e, event)
    refs.canvas.css('cursor', 'auto')
  })

  anchor.on('dragstart', (e) => {

  })
}