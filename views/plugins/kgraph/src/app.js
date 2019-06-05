/* style sheet */
import './css/iconfont/iconfont.css'
import './css/icon.css'
import './css/kgraph.css'

import newElement from './util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import $k from './util/dom'
import kg from './global'
import { refs, cfgs, nodeEvent, edgeEvent, anchorEvent, rearrange } from './global'
import Util from './util'

const initializeGraph = function (cfg) {
  let a = { a: 1, b: 2 }
  let b = { c: 3, d: 4 }

  let c = Util.mix(a, b)
  c.a = 11
  c.c = 13

  const graph = new kg.Graph(cfg, 'Root')

  console.log(graph)

  graph.setAutoPaint(true)

  graph.on('afterAddItem', function (item) {
    if (item.get('type') === 'edge') {
      edgeEvent(item)
    } else if (item.get('type') === 'node') {
      let box = item.get('box')
      graph.addItem('base', {
        x: box.x,
        y: box.y,
        parent: item.get('id'),
        hidden: true,
        shape: {
          type: 'rect',
          size: [60, 60],
          style: {
            borderRadius: 5,
            stroke: '#333',
            lineDash: [8, 8]
          }
        },
        alwaysShow: false
      })
      graph.addItem('base', {
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
      Util.each(item.get('anchorMatrix'), m => {
        let anchorPoint = item.getAnchorPoint(m)
        let anchor = graph.addItem('anchor', Util.mix({}, cfgs.anchor, {
          m,
          parent: item.get('id'),
          hidden: true,
          x: anchorPoint.x,
          y: anchorPoint.y
        }))
        anchorEvent(anchor)
      })
      nodeEvent(item)
    }
  })

  graph.on('mousedown', function (e) {
    // console.log('graph mousedown', e)
  })

  graph.on('beforeChangeSize', function () {

  })

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
    container: 'kgraph-diagram',
    canvasId: 'kgraph-canvas',
    width: window.innerWidth - 210,
    height: 400,
    enableGrid: true
  })

  let d = {"nodes":[{"id":"86f49908a99179c8","x":673,"y":219,"state":{"hover":false},"outEdges":["a444f44bfe8b68c6"],"inEdges":["dbc4579857ea386f"],"props":{"key":"wait","value":"wait"},"shape":{"type":"circle","size":25,"style":{"stroke":"#00678a","fill":"#eee","lineWidth":2,"r":25,"x":673,"y":219},"x":673,"y":219},"label":"等待","labelCfg":{"offsetX":0,"offsetY":0,"type":"text","content":"等待","x":673,"y":219},"anchorMatrix":[[0.5,0],[1,0.5],[0.5,1],[0,0.5]],"event":true},{"id":"a614d5fa84114ea0","x":916,"y":91,"state":{"hover":false},"outEdges":[],"inEdges":["54a4d16a8abc39df","a444f44bfe8b68c6"],"props":{"key":"end","value":"end"},"shape":{"type":"diamond","size":[60,60],"style":{"borderRadius":10,"stroke":"#00678a","fill":"#eee","lineWidth":2,"width":60,"height":60,"x":916,"y":91},"x":916,"y":91},"label":"结束","labelCfg":{"offsetX":0,"offsetY":0,"type":"text","content":"结束","x":916,"y":91},"anchorMatrix":[[0.5,0],[1,0.5],[0.5,1],[0,0.5]],"event":true},{"id":"86946278914211c1","x":687,"y":96,"state":{"hover":false},"outEdges":["54a4d16a8abc39df"],"inEdges":["16f40f7ab892f33b"],"props":{"key":"wait","value":"wait"},"shape":{"type":"circle","size":25,"style":{"stroke":"#00678a","fill":"#eee","lineWidth":2,"r":25,"x":687,"y":96},"x":687,"y":96},"label":"等待","labelCfg":{"offsetX":0,"offsetY":0,"type":"text","content":"等待","x":687,"y":96},"anchorMatrix":[[0.5,0],[1,0.5],[0.5,1],[0,0.5]],"event":true},{"id":"e764173862c94f66","x":470,"y":217,"state":{"hover":false},"outEdges":["dbc4579857ea386f"],"inEdges":["8524dae924988548"],"props":{"key":"wait","value":"wait"},"shape":{"type":"circle","size":25,"style":{"stroke":"#00678a","fill":"#eee","lineWidth":2,"r":25,"x":470,"y":217},"x":470,"y":217},"label":"等待","labelCfg":{"offsetX":0,"offsetY":0,"type":"text","content":"等待","x":470,"y":217},"anchorMatrix":[[0.5,0],[1,0.5],[0.5,1],[0,0.5]],"event":true},{"id":"c5d4bcd87a7bdd9f","x":480,"y":92,"state":{"hover":false},"outEdges":["16f40f7ab892f33b","8524dae924988548"],"inEdges":["ce140ac983b8f9cf"],"props":{"key":"wait","value":"wait"},"shape":{"type":"circle","size":25,"style":{"stroke":"#00678a","fill":"#eee","lineWidth":2,"r":25,"x":480,"y":92},"x":480,"y":92},"label":"等待","labelCfg":{"offsetX":0,"offsetY":0,"type":"text","content":"等待","x":480,"y":92},"anchorMatrix":[[0.5,0],[1,0.5],[0.5,1],[0,0.5]],"event":true},{"id":"b1c458c88284ef33","x":278,"y":91,"state":{"hover":false},"outEdges":["ce140ac983b8f9cf"],"inEdges":[],"props":{"key":"start","value":"Start"},"shape":{"type":"rect","size":[50,50],"style":{"stroke":"#00678a","fill":"#eee","lineWidth":2,"width":50,"height":50,"x":253,"y":66},"x":278,"y":91},"label":"开始","labelCfg":{"offsetX":0,"offsetY":60,"style":{"color":"#F00","size":"14px"},"type":"text","content":"开始","x":278,"y":151},"anchorMatrix":[[0.5,0],[1,0.5],[0.5,1],[0,0.5]],"event":true}],"edges":[{"id":"a444f44bfe8b68c6","state":{},"source":"86f49908a99179c8","startAnchor":[1,0.5],"target":"a614d5fa84114ea0","endAnchor":[0,0.5],"arrow":true,"shape":{"type":"polyline","style":{"stroke":"#edeef4","lineWidth":10}},"event":true},{"id":"dbc4579857ea386f","state":{},"source":"e764173862c94f66","startAnchor":[1,0.5],"target":"86f49908a99179c8","endAnchor":[0,0.5],"arrow":true,"shape":{"type":"polyline","style":{"stroke":"#edeef4","lineWidth":10}},"event":true},{"id":"8524dae924988548","state":{},"source":"c5d4bcd87a7bdd9f","startAnchor":[0.5,1],"target":"e764173862c94f66","endAnchor":[0.5,0],"arrow":true,"shape":{"type":"polyline","style":{"stroke":"#edeef4","lineWidth":10}},"event":true},{"id":"54a4d16a8abc39df","state":{"hover":false},"source":"86946278914211c1","startAnchor":[1,0.5],"target":"a614d5fa84114ea0","endAnchor":[0,0.5],"arrow":true,"shape":{"type":"polyline","style":{"stroke":"#edeef4","lineWidth":10}},"event":true},{"id":"16f40f7ab892f33b","state":{},"source":"c5d4bcd87a7bdd9f","startAnchor":[1,0.5],"target":"86946278914211c1","endAnchor":[0,0.5],"arrow":true,"shape":{"type":"polyline","style":{"stroke":"#edeef4","lineWidth":10}},"event":true},{"id":"ce140ac983b8f9cf","state":{},"source":"b1c458c88284ef33","startAnchor":[1,0.5],"target":"c5d4bcd87a7bdd9f","endAnchor":[0,0.5],"arrow":true,"shape":{"type":"polyline","style":{"stroke":"#edeef4","lineWidth":10}},"event":true}]}
  graph.render(d)

  window.onkeydown = function (e) {
    if (window.event.metaKey && e.keyCode === 75) {
      rearrange(graph)
    }
  }
  
  const sb = new Sidebar(graph, refs)
  const tb = new Toolbar(graph, refs)
  
  kgraphContainer.append(refs.sidebar)
  kgraphContainer.append(refs.toolbar)

  sb.createSection('基础流程节点', [{
    key: 'start',
    text: '开始',
    value: 'start',
    iconText: '&#xe6ec;',
    item: cfgs.rect
  }, {
    key: 'wait',
    text: '等待',
    value: 'wait',
    iconText: '&#xe644;',
    item: cfgs.circle
  }, {
    key: 'time',
    text: '结束',
    value: 'time',
    iconText: '&#xe69d;',
    item: cfgs.diamond
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


  let drawJson = JSON.parse('{"dnodes":[{"id":"3db462a9a6f422c1","state":1,"isShowCMButton":false,"isShowMenu":false,"key":"Start","x":0,"y":70,"dir":"horizontal","focusing":false,"entering":false,"grabing":false,"textY":20,"iconY":20,"campaignNodeId":"3431421","borderColor":"#f6c231","iconColor":"#f6c231"},{"isEdited":false,"id":"a894cdb8b1cd577e","state":1,"isShowCMButton":false,"isShowMenu":false,"key":"Groups","x":200,"y":70,"dir":"horizontal","focusing":false,"entering":false,"grabing":false,"textY":20,"iconY":20,"campaignNodeId":"3431422","borderColor":"#007fb1","iconColor":"#007fb1"},{"isEdited":false,"id":"8814742825d5849a","state":1,"isShowCMButton":false,"isShowMenu":false,"key":"Time","x":400,"y":70,"dir":"horizontal","focusing":false,"entering":false,"grabing":false,"textY":20,"iconY":20,"cmenuOffsetY":127.5,"campaignNodeId":"3431423","borderColor":"#007fb1","iconColor":"#007fb1"},{"isEdited":true,"id":"0f6425ea4338b9dd","state":1,"isShowCMButton":false,"isShowMenu":false,"key":"Mmsms","x":600,"y":70,"dir":"horizontal","focusing":true,"entering":true,"grabing":false,"textY":20,"iconY":20,"campaignNodeId":"3431424","borderColor":"#007fb1","iconColor":"#007fb1","remark":"","isStopped":false},{"id":"49e4dc68b4328836","state":1,"isShowCMButton":true,"isShowMenu":false,"key":"End","x":800,"y":70,"dir":"horizontal","focusing":false,"entering":false,"grabing":false,"textY":20,"iconY":20,"campaignNodeId":"3431425","borderColor":"#f6c231","iconColor":"#f6c231"}],"connects":[{"id":"51c4ed0adc030215","parentNode":"3db462a9a6f422c1","state":1,"connected":true,"position":"right","type":"end","cx":140,"cy":90,"x":128,"y":78,"borderColor":"#007fb1"},{"id":"bd94ca98c501caeb","parentNode":"a894cdb8b1cd577e","state":1,"connected":true,"position":"left","type":"start","cx":200,"cy":90,"x":188,"y":78,"borderColor":"#007fb1"},{"id":"953416bb652a92f9","parentNode":"a894cdb8b1cd577e","state":1,"connected":true,"position":"right","type":"end","cx":340,"cy":90,"x":328,"y":78,"borderColor":"#007fb1"},{"id":"5724f338d974ad8b","parentNode":"8814742825d5849a","state":1,"connected":true,"position":"left","type":"start","cx":400,"cy":90,"x":388,"y":78,"borderColor":"#007fb1"},{"id":"11547b6bae428062","parentNode":"8814742825d5849a","state":1,"connected":true,"position":"right","type":"end","cx":540,"cy":90,"x":528,"y":78,"borderColor":"#007fb1"},{"id":"04845e08ed4762b5","parentNode":"0f6425ea4338b9dd","state":1,"connected":true,"position":"left","type":"start","cx":600,"cy":90,"x":588,"y":78,"borderColor":"#007fb1"},{"id":"aa4409b82da796da","parentNode":"0f6425ea4338b9dd","state":1,"connected":true,"position":"right","type":"end","cx":740,"cy":90,"x":728,"y":78,"borderColor":"#007fb1"},{"id":"e34477787bd1e64b","parentNode":"49e4dc68b4328836","state":1,"connected":true,"position":"left","type":"start","cx":800,"cy":90,"x":788,"y":78,"borderColor":"#007fb1"}],"paths":[{"id":"6cd4594a1c981986","dir":"horizontal","state":1,"start":"51c4ed0adc030215","end":"bd94ca98c501caeb","campaignNodeId":"flow1559289249617"},{"id":"99545dda4692ea35","dir":"horizontal","state":1,"start":"953416bb652a92f9","end":"5724f338d974ad8b","campaignNodeId":"flow1559289251473"},{"id":"0db4e4e8c04591dc","dir":"horizontal","state":1,"start":"11547b6bae428062","end":"04845e08ed4762b5","campaignNodeId":"flow1559289259793"},{"id":"7c4426c87499dccc","dir":"horizontal","state":1,"start":"aa4409b82da796da","end":"e34477787bd1e64b","campaignNodeId":"flow1559289261479"}],"diagramWidth":1088,"diagramHeight":681,"gridWidth":10,"gridAlign":true,"scale":1,"direction":"horizontal","currentId":6}')
  console.log(drawJson)
}