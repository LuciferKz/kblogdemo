import newElement from './util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import $k from './util/dom'
import Graph from './graph'
import { customNode, circleNode, diamondNode } from './global'

window.onload = function () {
  const kgraphContainer = $k('#kgraph-container-test')
  let refs = { container: kgraphContainer }
  const kgraphDiagram = newElement({
    tag: 'div',
    props: {
      className: 'kgraph-diagram-container'
    },
    children: [{
      tag: 'div',
      props: {
        className: 'kgraph-diagram'
      },
      children: [{
        tag: 'canvas',
        ref: 'canvas',
        props: {
          id: 'kgraph-canvas'
        }
      }]
    }]
  }, refs)
  kgraphContainer.append(kgraphDiagram)

  const graph = new Graph({
    containerId: 'kgraph-canvas',
    width: window.innerWidth - 210,
    height: window.innerHeight - 40
  }, 'Root')

  const start = graph.addItem('node', customNode)
  graph.setAutoPaint(true)

  console.log(graph)
  console.log(start)
  
  let down = false

  start.on('mouseenter', function (e) {
    refs.canvas.css('cursor', 'move')
  })

  start.on('mousemove', function (e) {
    // refs.canvas.css('cursor', 'move')
    if (down) {
      
    }
  })

  start.on('mouseleave', function (e) {
    refs.canvas.css('cursor', 'auto')
  })

  start.on('mousedown', function (e) {
    down = true
    console.log('mousedown')
    // refs.canvas.css('cursor', 'move')
  })

  start.on('click', function (e) {
    console.log('click')
    // refs.canvas.css('cursor', 'move')
  })

  start.on('mouseup', function (e) {
    down = false
    console.log('mousedown')
    // refs.canvas.css('cursor', 'move')
  })

  const sb = new Sidebar(graph, refs)
  const tb = new Toolbar(refs)
  
  kgraphContainer.append(refs.sidebar)
  kgraphContainer.append(refs.toolbar)

  sb.createSection('基础流程节点', [{
    key: 'start',
    text: '开始',
    value: 'start',
    iconText: '&#xe6ec;',
    item: customNode
  }, {
    key: 'wait',
    text: '等待',
    value: 'wait',
    iconText: '&#xe644;',
    item: circleNode
  }, {
    key: 'time',
    text: '结束',
    value: 'time',
    iconText: '&#xe69d;',
    item: diamondNode
  }])

  kgraphContainer.on('mousedown', (e) => {
    e.preventDefault();
  })
  kgraphContainer.on('mousemove', (e) => {
    e.preventDefault();
  })
  kgraphContainer.on('contextmenu', (e) => {
    e.preventDefault();
  })
}