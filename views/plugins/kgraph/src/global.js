import newElement from './util/dom/new-element'
import Sidebar from './modules/sidebar'
import Toolbar from './modules/toolbar'
import ca from './canvas.js'
import $k from './util/dom'

window.onload = function () {
  const kgraphContainer = $k('#kgraph-container-test')
  let refs = {
    container: kgraphContainer
  }

  const sb = new Sidebar(refs)
  const tb = new Toolbar(refs)
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
  
  kgraphContainer.append(refs.sidebar)
  kgraphContainer.append(refs.toolbar)
  kgraphContainer.append(kgraphDiagram)

  sb.createSection('基础流程节点', [{
    key: 'start',
    text: '开始',
    value: 'start',
    iconText: '&#xe6ec;',
    evts: {
      dblclick: {
        cb: function () {
          alert('双击事件');
        }
      },
      click: {
        cb: function () {
          console.log('点击事件');
        }
      }
    },
    nextSiblings: ['wait'], // 连接规则，可以连接哪些节点，设置的值是其他节点的key;
    verifyConnection: function (dnode, startDNode, endDNode) {
      // 对应节点的配置规则，返回值为提示消息，验证通过返回null或者不返回
      // return '连接失败';
    },
    // isEdited: false, // 该案例定制属性
  }, {
    key: 'wait',
    text: '等待',
    value: 'wait',
    iconText: '&#xe644;'
  }, {
    key: 'time',
    text: '结束',
    value: 'time',
    iconText: '&#xe69d;'
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
  
  console.log(ca)
  ca.init()
  ca.draw()
}