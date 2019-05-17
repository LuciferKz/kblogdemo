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

export const customNode = {
  id: 1,
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
  }
}

export const circleNode = {
  id: 2,
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
  id: 3,
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