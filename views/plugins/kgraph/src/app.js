/* style sheet */
import './css/iconfont/iconfont.css'
import './css/icon.css'
import './css/kgraph.css'

import newElement from './util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import $k from './util/dom'
import kg from './global'
import { refs, items, cfgs, nodeEvent, edgeEvent, anchorEvent, rearrange } from './global'
import Util from './util'

const initializeGraph = function (cfg) {
  let a = { a: 1, b: 2 }
  let b = { c: 3, d: 4 }

  let c = Util.mix(a, b)
  c.a = 11
  c.c = 13
  
  cfg.configMap = cfgs
  const graph = new kg.Graph(cfg, 'Root')

  console.log(graph)

  graph.setAutoPaint(true)

  graph.on('beforeAddItem', function (item) {
    if (item.type === 'edge') {
      if (!item.id) item.id = 'flow' + Date.now()
    }
    let counter = graph.get('counter')
    graph.set('counter', ++counter)
  })

  graph.on('afterAddItem', function (item) {
    if (item.get('type') === 'edge') {
      edgeEvent(item)
    } else if (item.get('type') === 'node') {
      let box = item.get('box')
      graph.addItem('base', {
        cfgKey: 'outline',
        x: box.x,
        y: box.y,
        parent: item.get('id'),
      })
      graph.addItem('base', {
        x: box.x,
        y: box.y,
        parent: item.get('id'),
        shape: {
          type: 'circle',
          size: 20,
          style: {
            stroke: '#F00'
          }
        },
        event: false,
      })
      Util.each(item.get('anchorMatrix'), m => {
        let anchorPoint = item.getAnchorPoint(m)
        let anchor = graph.addItem('anchor', {
          cfgKey: 'anchor',
          m,
          parent: item.get('id'),
          hidden: true,
          x: anchorPoint.x,
          y: anchorPoint.y,
        })
        anchorEvent(anchor)
      })
      nodeEvent(item)
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
    console.log(graph.get('counter'))
    console.log(JSON.stringify(graphData))
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
  kgraphContainer.append(kgraphDiagram)

  const graph = initializeGraph({
    container: '.kgraph-diagram',
    canvasId: '#canvas',
    width: window.innerWidth - 210,
    height: 400,
    // diagramWidth: 800,
    // diagramHeight: 400,
    // enableRubberband: true,
    enableScroll: true,
    // fitcanvas: true,
    // translateX: 0,
    // translateY: 0,
    originRatio: 2,

    grid: {
      show: false,
      align: false,
      size: 10,
    }
  })

  console.log(graph);

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
  
  let d = {"nodes":[{"id":"27346a484ffb5f56","x":772,"y":1057,"state":{"hover":false,"focus":true},"outEdges":[],"inEdges":["flow1595914773666"],"props":{"itemId":"27346a484ffb5f56","detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231038","setting":false,"remark":"","isEdited":true,"isStopped":false},"label":"短信","cfgKey":"rect1"},{"id":"02f46c1905631b3a","x":772,"y":977,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773664"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231037"},"label":"短信","cfgKey":"rect1"},{"id":"55f44d18af43cef4","x":772,"y":897,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773664"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231036"},"label":"短信","cfgKey":"rect1"},{"id":"a3c407f83e16e211","x":772,"y":817,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773663"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231035"},"label":"短信","cfgKey":"rect1"},{"id":"1454e05bc497b7ff","x":772,"y":737,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773662"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231034"},"label":"短信","cfgKey":"rect1"},{"id":"0ce450c8cc4cef05","x":772,"y":657,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773661"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231033"},"label":"短信","cfgKey":"rect1"},{"id":"0254fe88d712efbe","x":772,"y":577,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773660"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231032"},"label":"短信","cfgKey":"rect1"},{"id":"28545648d900a0e2","x":772,"y":497,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773659"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231031"},"label":"短信","cfgKey":"rect1"},{"id":"daa48f282a83eda6","x":772,"y":417,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773658"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231030"},"label":"短信","cfgKey":"rect1"},{"id":"3e640b89e585f6e9","x":772,"y":337,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773657"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231029"},"label":"短信","cfgKey":"rect1"},{"id":"05648fb8d21d0731","x":772,"y":257,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773656"],"props":{"detail":"通过指定的短信模版向客户发送短信","iconText":"&#xe6ad;","key":"Sms","text":"短信","value":"NC_Sms","id":10,"icon":"","campaignNodeId":"13231028"},"label":"短信","cfgKey":"rect1"},{"id":"8234973bfeabc1a8","x":772,"y":177,"state":{"hover":false},"outEdges":[],"inEdges":["flow1595914773655"],"props":{"detail":"结合公众号中设定的沟通模版，向客户发送微信消息","iconText":"&#xe6ac;","key":"Wechat","text":"微信","value":"NCWech","id":17,"icon":"","campaignNodeId":"13231027"},"label":"微信","cfgKey":"rect1"},{"id":"2ea4af0803c1f0dd","x":512,"y":1057,"state":{},"outEdges":["flow1595914773666"],"inEdges":["flow1595914773643"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":1323100211,"remark":"测试分组2","isEdited":true},"label":"测试分组2","cfgKey":"rect1"},{"id":"6f74ebb871d29ce5","x":512,"y":977,"state":{},"outEdges":["flow1595914773664"],"inEdges":["flow1595914773641"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":1323100210,"remark":"测试分组6","isEdited":true},"label":"测试分组6","cfgKey":"rect1"},{"id":"c764ea78732e0f8e","x":512,"y":897,"state":{},"outEdges":["flow1595914773664"],"inEdges":["flow1595914773639"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310029,"remark":"测试分组5","isEdited":true},"label":"测试分组5","cfgKey":"rect1"},{"id":"5df4b87806331677","x":512,"y":817,"state":{},"outEdges":["flow1595914773663"],"inEdges":["flow1595914773637"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310028,"remark":"测试分组7","isEdited":true},"label":"测试分组7","cfgKey":"rect1"},{"id":"409403f86676a9f8","x":512,"y":737,"state":{},"outEdges":["flow1595914773662"],"inEdges":["flow1595914773635"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310027,"remark":"测试分组10","isEdited":true},"label":"测试分组10","cfgKey":"rect1"},{"id":"f504e6c9e6ad207a","x":512,"y":657,"state":{},"outEdges":["flow1595914773661"],"inEdges":["flow1595914773632"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310026,"remark":"测试分组9","isEdited":true},"label":"测试分组9","cfgKey":"rect1"},{"id":"5c246dc953d90c1d","x":512,"y":577,"state":{},"outEdges":["flow1595914773660"],"inEdges":["flow1595914773629"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310025,"remark":"ykl_test","isEdited":true},"label":"ykl_test","cfgKey":"rect1"},{"id":"4c2479c8b881ea94","x":512,"y":497,"state":{},"outEdges":["flow1595914773659"],"inEdges":["flow1595914773627"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310024,"remark":"测试分组3","isEdited":true},"label":"测试分组3","cfgKey":"rect1"},{"id":"47e4c9fb5f8a737d","x":512,"y":417,"state":{},"outEdges":["flow1595914773658"],"inEdges":["flow1595914773623"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310023,"remark":"测试分组4","isEdited":true},"label":"测试分组4","cfgKey":"rect1"},{"id":"bad41a08f9adbaab","x":512,"y":337,"state":{},"outEdges":["flow1595914773657"],"inEdges":["flow1595914773620"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310022,"remark":"测试分组11","isEdited":true},"label":"测试分组11","cfgKey":"rect1"},{"id":"cfa48c1864a9d136","x":512,"y":257,"state":{},"outEdges":["flow1595914773656"],"inEdges":["flow1595914773616"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310021,"remark":"测试分组8","isEdited":true},"label":"测试分组8","cfgKey":"rect1"},{"id":"7f54873a1a48190b","x":512,"y":177,"state":{"hover":false},"outEdges":["flow1595914773655"],"inEdges":["flow1595914773605"],"props":{"detail":"人群包","iconText":"&#xe6ab;","key":"Segment","text":"人群包","value":"NCSegment","id":58,"icon":"","campaignNodeId":132310020,"remark":"动态人群测试","isEdited":true},"label":"动态人群测试","cfgKey":"rect1"},{"id":"aa74782876c0c204","x":252,"y":177,"state":{"hover":false,"focus":false},"outEdges":["flow1595914773605","flow1595914773616","flow1595914773620","flow1595914773623","flow1595914773627","flow1595914773629","flow1595914773632","flow1595914773635","flow1595914773637","flow1595914773639","flow1595914773641","flow1595914773643"],"inEdges":[],"props":{"itemId":"aa74782876c0c204","detail":"人群组","iconText":"&#xe6a6;","key":"SgmtGroup","text":"人群组","value":"NCSgmtGroup","id":57,"icon":"","campaignNodeId":"13231002","setting":false,"remark":"ykl_多人群组测试","isEdited":true,"isStopped":false},"label":"ykl_多人群组测试","cfgKey":"diamond"},{"id":"dc54953813e1fc93","x":80,"y":80,"state":{},"outEdges":[],"inEdges":[],"props":{"iconText":"&#xe697;","key":"Start","text":"开始","value":"start","id":1,"icon":"","campaignNodeId":"13231001"},"label":"开始","cfgKey":"circle"}],"edges":[{"id":"flow1595914773666","state":{},"source":"2ea4af0803c1f0dd","startAnchor":[1,0.5],"target":"27346a484ffb5f56","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":1057},{"x":562,"y":1057},{"x":717,"y":1057},{"x":737,"y":1057},{"x":747,"y":1057,"m":[0,0.5]}]},{"id":"flow1595914773664","state":{"hover":false},"source":"6f74ebb871d29ce5","startAnchor":[1,0.5],"target":"02f46c1905631b3a","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":977},{"x":562,"y":977},{"x":717,"y":977},{"x":737,"y":977},{"x":747,"y":977,"m":[0,0.5]}]},{"id":"flow1595914773664","state":{},"source":"c764ea78732e0f8e","startAnchor":[1,0.5],"target":"55d489ea585a0dd5","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":897},{"x":562,"y":897},{"x":717,"y":897},{"x":737,"y":897},{"x":747,"y":897,"m":[0,0.5]}]},{"id":"flow1595914773663","state":{},"source":"5df4b87806331677","startAnchor":[1,0.5],"target":"a3c407f83e16e211","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":817},{"x":562,"y":817},{"x":717,"y":817},{"x":737,"y":817},{"x":747,"y":817,"m":[0,0.5]}]},{"id":"flow1595914773662","state":{},"source":"409403f86676a9f8","startAnchor":[1,0.5],"target":"1454e05bc497b7ff","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":737},{"x":562,"y":737},{"x":717,"y":737},{"x":737,"y":737},{"x":747,"y":737,"m":[0,0.5]}]},{"id":"flow1595914773661","state":{},"source":"f504e6c9e6ad207a","startAnchor":[1,0.5],"target":"0ce450c8cc4cef05","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":657},{"x":562,"y":657},{"x":717,"y":657},{"x":737,"y":657},{"x":747,"y":657,"m":[0,0.5]}]},{"id":"flow1595914773660","state":{},"source":"5c246dc953d90c1d","startAnchor":[1,0.5],"target":"0254fe88d712efbe","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":577},{"x":562,"y":577},{"x":717,"y":577},{"x":737,"y":577},{"x":747,"y":577,"m":[0,0.5]}]},{"id":"flow1595914773659","state":{"hover":false},"source":"4c2479c8b881ea94","startAnchor":[1,0.5],"target":"28545648d900a0e2","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":497},{"x":562,"y":497},{"x":717,"y":497},{"x":737,"y":497},{"x":747,"y":497,"m":[0,0.5]}]},{"id":"flow1595914773658","state":{},"source":"47e4c9fb5f8a737d","startAnchor":[1,0.5],"target":"daa48f282a83eda6","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":417},{"x":562,"y":417},{"x":717,"y":417},{"x":737,"y":417},{"x":747,"y":417,"m":[0,0.5]}]},{"id":"flow1595914773657","state":{},"source":"bad41a08f9adbaab","startAnchor":[1,0.5],"target":"3e640b89e585f6e9","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":337},{"x":562,"y":337},{"x":717,"y":337},{"x":737,"y":337},{"x":747,"y":337,"m":[0,0.5]}]},{"id":"flow1595914773656","state":{},"source":"cfa48c1864a9d136","startAnchor":[1,0.5],"target":"05648fb8d21d0731","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":257},{"x":562,"y":257},{"x":717,"y":257},{"x":737,"y":257},{"x":747,"y":257,"m":[0,0.5]}]},{"id":"flow1595914773655","state":{"hover":false},"source":"7f54873a1a48190b","startAnchor":[1,0.5],"target":"8234973bfeabc1a8","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":532,"y":177},{"x":562,"y":177},{"x":717,"y":177},{"x":737,"y":177},{"x":747,"y":177,"m":[0,0.5]}]},{"id":"flow1595914773643","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"2ea4af0803c1f0dd","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":1057},{"x":462,"y":1057},{"x":482,"y":1057},{"x":492,"y":1057,"m":[0,0.5]}]},{"id":"flow1595914773641","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"6f74ebb871d29ce5","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":977},{"x":462,"y":977},{"x":482,"y":977},{"x":492,"y":977,"m":[0,0.5]}]},{"id":"flow1595914773639","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"c764ea78732e0f8e","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":897},{"x":462,"y":897},{"x":482,"y":897},{"x":492,"y":897,"m":[0,0.5]}]},{"id":"flow1595914773637","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"5df4b87806331677","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":817},{"x":462,"y":817},{"x":482,"y":817},{"x":492,"y":817,"m":[0,0.5]}]},{"id":"flow1595914773635","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"409403f86676a9f8","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":737},{"x":462,"y":737},{"x":482,"y":737},{"x":492,"y":737,"m":[0,0.5]}]},{"id":"flow1595914773632","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"f504e6c9e6ad207a","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":657},{"x":462,"y":657},{"x":482,"y":657},{"x":492,"y":657,"m":[0,0.5]}]},{"id":"flow1595914773629","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"5c246dc953d90c1d","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":577},{"x":462,"y":577},{"x":482,"y":577},{"x":492,"y":577,"m":[0,0.5]}]},{"id":"flow1595914773627","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"4c2479c8b881ea94","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":497},{"x":462,"y":497},{"x":482,"y":497},{"x":492,"y":497,"m":[0,0.5]}]},{"id":"flow1595914773623","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"47e4c9fb5f8a737d","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":417},{"x":462,"y":417},{"x":482,"y":417},{"x":492,"y":417,"m":[0,0.5]}]},{"id":"flow1595914773620","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"bad41a08f9adbaab","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":337},{"x":462,"y":337},{"x":482,"y":337},{"x":492,"y":337,"m":[0,0.5]}]},{"id":"flow1595914773616","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"cfa48c1864a9d136","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":385.75,"y":177},{"x":385.75,"y":257},{"x":462,"y":257},{"x":482,"y":257},{"x":492,"y":257,"m":[0,0.5]}]},{"id":"flow1595914773605","state":{},"source":"aa74782876c0c204","startAnchor":[1,0.5],"target":"7f54873a1a48190b","endAnchor":[0,0.5],"props":{},"label":"","points":[{"x":279.5,"y":177},{"x":309.5,"y":177},{"x":462,"y":177},{"x":482,"y":177},{"x":492,"y":177,"m":[0,0.5]}]}]}

//   // let d = {"counter":3,"nodes":[{"id":"5a9463a8d42e3b24","x":194,"y":81,"state":{"hover":false},"outEdges":[],"inEdges":["flow1572506913573"],"props":{"iconText":"&#xe697;","key":"End","text":"结束","value":"end","id":3,"icon":"","campaignNodeId":"31384502"},"label":"结束","cfgKey":"circle"},{"id":"1ec40819044fe36e","x":80,"y":80,"state":{"hover":false},"outEdges":["flow1572506913573"],"inEdges":[],"props":{"iconText":"&#xe697;","key":"Start","text":"开始","value":"start","id":1,"icon":"","campaignNodeId":"31384501"},"label":"开始","cfgKey":"circle"}],"edges":[{"id":"flow1572506913573","state":{},"source":"1ec40819044fe36e","startAnchor":[1,0.5],"target":"5a9463a8d42e3b24","endAnchor":[0,0.5],"props":{},"label":"","cfgKey":"edge","points":[{"x":100,"y":80},{"x":130,"y":80},{"x":137,"y":80},{"x":137,"y":81},{"x":144,"y":81},{"x":164,"y":81},{"x":174,"y":81,"m":[0,0.5]}]}]}
//   console.log(d)
  graph.render(d)
  graph.set('counter', d.counter)
  graph.saveData()

  window.onkeydown = function (e) {
    if ((window.event.metaKey || (window.event.ctrlKey && window.event.shiftKey)) && e.keyCode === 75) {
      rearrange(graph)
    }
  }
  
  const sb = new Sidebar(graph, refs)
  const tb = new Toolbar(graph, refs)
  
  kgraphContainer.append(refs.sidebar)
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

