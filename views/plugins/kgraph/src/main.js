import newElement from './util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import $k from './util/dom'
import kg from './global'
import { refs, customNode, circleNode, diamondNode, nodeEvent, anchorEvent, anchorCfg } from './global'
import Util from './util'

window.onload = function () {
  const kgraphContainer = $k('#kgraph-container-test')
  // let refs = { container: kgraphContainer }
  refs.container = kgraphContainer
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

  const graph = new kg.Graph({
    containerId: 'kgraph-canvas',
    width: window.innerWidth - 210,
    height: window.innerHeight - 40
  }, 'Root')

  graph.setAutoPaint(true)

  graph.on('beforeAddItem', function () {
  })

  graph.on('afterAddItem', function (item) {
    if (item.get('type') === 'edge') {
      item.on('mousedown', function (e, event) {
      })
    } else if (item.get('type') === 'node') {
      Util.each(item.get('anchorMatrix'), m => {
        anchorCfg.m = m
        anchorCfg.parent = item.get('id')
        let anchor = graph.addItem('anchor', anchorCfg)
        anchorEvent(anchor)
      })
    }
  })
  console.log(graph)

  const start = graph.addItem('node', customNode)

  nodeEvent(start, refs, graph)
  
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