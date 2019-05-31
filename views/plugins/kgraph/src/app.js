/* style sheet */
import './css/iconfont/iconfont.css'
import './css/icon.css'
import './css/kgraph.css'

import newElement from './util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import $k from './util/dom'
import kg from './global'
import { refs, customNode, circleNode, diamondNode, nodeEvent, anchorEvent, anchorCfg } from './global'
import Util from './util'

const initializeGraph = function (cfg) {
  let a = { a: 1, b: 2 }
  let b = { c: 3, d: 4 }

  let c = Util.mix(a, b)
  c.a = 11
  c.c = 13

  const graph = new kg.Graph(cfg, 'Root')

  graph.setAutoPaint(true)

  graph.on('beforeAddItem', function () {
  })

  graph.on('afterAddItem', function (item) {
    if (item.get('type') === 'edge') {
      item.on('mousedown', function (e, event) {
      })
    } else if (item.get('type') === 'node') {
      let box = item.get('box')
      graph.addItem('base', {
        x: box.x,
        y: box.y,
        parent: item.get('id'),
        hidden: true,
        shape: {
          type: 'rect',
          size: [120, 120],
          style: {
            borderRadius: 5,
            stroke: '#333',
            lineDash: [8, 8]
          }
        },
        alwaysShow: false
      })
      let _c = graph.addItem('base', {
        x: box.x,
        y: box.y,
        shape: {
          type: 'circle',
          size: 20,
          style: {
            stroke: '#F00'
          }
        },
        event: false,
        parent: item.get('id')
      })
      console.log(_c)
      Util.each(item.get('anchorMatrix'), m => {
        anchorCfg.m = m
        anchorCfg.parent = item.get('id')
        anchorCfg.hidden = true
        let anchorPoint = item.getAnchorPoint(m)
        anchorCfg.x = anchorPoint.x
        anchorCfg.y = anchorPoint.y
        let anchor = graph.addItem('anchor', anchorCfg)
        anchorEvent(anchor)
      })
    }
  })

  graph.on('mousedown', function (e) {
    console.log('graph mousedown', e)
  }) 

  return graph
}

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

  const graph = initializeGraph({
    containerId: 'kgraph-canvas',
    width: window.innerWidth - 210,
    height: 800
  })

  console.log(graph)

  const start = graph.addItem('node', customNode)

  nodeEvent(start, refs, graph)
  
  const sb = new Sidebar(graph, refs)
  const tb = new Toolbar(graph, refs)
  console.log(refs)
  
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