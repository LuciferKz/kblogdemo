/* style sheet */
import './css/iconfont/iconfont.css'
import './css/icon.css'
import './css/kgraph.css'

import newElement from '@/util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import $k from '@/util/dom'
import kg from '@/kg'
import { nodeDragAndDrop, nodeConnect, nodeHoverCursor, nodeSwitchScroller, nodeFocus, edgeHoverCursor, rearrange } from './js/kg.extend'
import { items, shapes } from './js/kg.config'
import './js/kg.register'
import Util from '@/util'
import test from './component/test.vue'
import table from './component/table.vue'

const refs = {}

const initializeGraph = function (cfg) {
  let a = { a: 1, b: 2 }
  let b = { c: 3, d: 4 }

  let c = Util.mix(a, b)
  c.a = 11
  c.c = 13
  
  cfg.shapeCfgs = shapes
  const graph = new kg.Graph(cfg, 'Root')

  graph.setAutoPaint(true)

  graph.on('beforeAddItem', function (item) {
    console.log(item)

    if (item.type === 'edge') {
      if (!item.id) item.id = 'flow' + Date.now()
    }

    let counter = graph.get('counter')
    graph.set('counter', ++counter)
  })

  graph.on('afterAddItem', function (item) {
    if (item.get('type') === 'node') {
      let box = item.get('box')
      graph.addItem('outline', {
        cfgKey: 'outline',
        x: box.x,
        y: box.y,
        parent: item.get('id'),
        shape: {
          size: [box.width + 20, box.height + 20]
        }
      })

      if (item.get('cfgKey') === 'vueElement') {
        // graph.$vue.create(Util.mix({ component: test }, item.get('props').vue, { parent: item }))
      } else if (item.get('cfgKey') === 'table') {
        const box = item.get('box')
        const props = item.get('props')
        const data = props.vue.props.value
        Util.each(data, (v, idx) => {
          let m = [0, (32 * idx + 21) / box.height]
          v.m = m
          let anchorPoint = item.getAnchorPoint(m)
          let anchor = graph.addItem('anchor', {
            cfgKey: 'anchor2',
            m,
            parent: item.get('id'),
            hidden: true,
            x: anchorPoint.x,
            y: anchorPoint.y,
            edgeOffset: 25 + idx * 15
          })
        })
        let vueElement = graph.$vue.create(Util.mix({ component: table }, item.get('props').vue, { parent: item }))
        vueElement.$component.$on('connect', (v) => {
          
        })
      }
    }
  })

  graph.on('beforeChangeSize', function () {

  })
  graph.on('copy', function () {
    console.log(graph.get('copiedItem'))
  })

  document.getElementById('save').onclick = function () {
    const graphData = graph.getData()
    graphData.counter = graph.get('counter')
    localStorage.setItem('graphData',JSON.stringify(graphData))
  }

  document.getElementById('changeSize').onclick = function () {
    const width = document.getElementById('width').value
    const height = document.getElementById('height').value
    graph.changeSize(width, height)
  }

  document.getElementById('changeLabel').onclick = function () {
    const focusItem = graph.get('targetMap').focus[0]
    focusItem.changeLabel(document.getElementById('label').value)
  }

  // setTimeout(function () {
  //   graph.changeSize(500, 200)
  // }, 3000)
  return graph
}

window.onload = function () {
  const kgraphContainer = $k('#kgraph-container-test')
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
      // children: [{
      //   tag: 'canvas',
      //   ref: 'canvas',
      //   props: {
      //     id: 'canvas'
      //   }
      // }]
    }]
  }, refs)

  const kgrpahSidebr = newElement({
    tag: 'div',
    props: {
      className: 'kgraph-sidebar-container'
    },
    ref: 'sidebar',
  }, refs)
  kgraphContainer.append(kgraphDiagram)
  kgraphContainer.append(kgrpahSidebr)

  const graph = initializeGraph({
    container: '.kgraph-diagram',
    canvasId: '#canvas',
    width: 1000,
    height: 800,
    // diagramWidth: 800,
    // diagramHeight: 400,
    enableRubberband: true,
    enableScroll: true,
    // fitcanvas: true,
    // translateX: 0,
    // translateY: 0,
    originRatio: 2,

    grid: {
      show: false,
      align: false,
      size: 10,
    },

    bgColor: '#000',
  })

  graph.on('click', function (e) {
    console.log('graph click', e)
  })
  
  graph.on('dblclick', function (e) {
    console.log('graph dbclick', e)
  })

  graph.on('contextmenu', function (e) {
    console.log('graph contextmenu', e)
  })

  graph.on('focus', function (e) {
    console.log('graph focus', e)
  })

  graph.on('blur', function (e) {
    console.log('graph blur', e)
  })

  // let d = {"counter": 3, "nodes":[{"id":"4184744bfe800b37","x":591,"y":228,"state":{"hover":false},"outEdges":[],"inEdges":["flow1562666092454"],"props":{"key":"end","value":"end"},"label":"结束","cfgKey":"diamond"},{"id":"dfd48ea9c0697bd8","x":452,"y":146,"state":{"hover":false},"outEdges":["flow1562666092454"],"inEdges":["flow1562666091039"],"props":{"key":"wait","value":"wait"},"label":"等待","cfgKey":"circle"},{"id":"a7d4ad286aa7995a","x":202,"y":212,"state":{"hover":false},"outEdges":["flow1562666091039"],"inEdges":[],"props":{"key":"start","value":"Start"},"label":"开始","cfgKey":"rect"}],"edges":[{"id":"flow1562666092454","state":{"hover":false},"source":"dfd48ea9c0697bd8","startAnchor":[1,0.5],"target":"4184744bfe800b37","endAnchor":[0,0.5],"props":{},"label":"Label","cfgKey":"edge"},{"id":"flow1562666091039","state":{},"source":"a7d4ad286aa7995a","startAnchor":[1,0.5],"target":"dfd48ea9c0697bd8","endAnchor":[0,0.5],"props":{},"label":"Label","cfgKey":"edge"}]}
  
  //   // let d = {"counter":3,"nodes":[{"id":"5a9463a8d42e3b24","x":194,"y":81,"state":{"hover":false},"outEdges":[],"inEdges":["flow1572506913573"],"props":{"iconText":"&#xe697;","key":"End","text":"结束","value":"end","id":3,"icon":"","campaignNodeId":"31384502"},"label":"结束","cfgKey":"circle"},{"id":"1ec40819044fe36e","x":80,"y":80,"state":{"hover":false},"outEdges":["flow1572506913573"],"inEdges":[],"props":{"iconText":"&#xe697;","key":"Start","text":"开始","value":"start","id":1,"icon":"","campaignNodeId":"31384501"},"label":"开始","cfgKey":"circle"}],"edges":[{"id":"flow1572506913573","state":{},"source":"1ec40819044fe36e","startAnchor":[1,0.5],"target":"5a9463a8d42e3b24","endAnchor":[0,0.5],"props":{},"label":"","cfgKey":"edge","points":[{"x":100,"y":80},{"x":130,"y":80},{"x":137,"y":80},{"x":137,"y":81},{"x":144,"y":81},{"x":164,"y":81},{"x":174,"y":81,"m":[0,0.5]}]}]}
  //   console.log(d)
  let d = localStorage.getItem('graphData')
  if (d) {
    d = JSON.parse(d)
    graph.render(d)
    graph.set('counter', d.counter)
    graph.saveData()
  }

  graph.add('node', {})
  graph.add('node', {
    vueComponent: test
  })


  window.onkeydown = function (e) {
    if ((window.event.metaKey || (window.event.ctrlKey && window.event.shiftKey)) && e.keyCode === 75) {
      rearrange(graph)
    }
  }
  
  const sb = new Sidebar('.kgraph-sidebar-container', graph, refs)
  const tb = new Toolbar(graph, refs)
  
  // kgraphContainer.append(refs.sidebar)
  kgraphContainer.append(refs.toolbar)

  sb.createSection('基础流程节点', items.list)

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

