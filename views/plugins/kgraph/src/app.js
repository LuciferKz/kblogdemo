/* style sheet */
import './css/iconfont/iconfont.css'
import './css/icon.css'
import './css/kgraph.css'

/* main */
let toolbarHeaderMenu = []

toolbarHeaderMenu.push({
  tag: 'i',
  props: { className: 'iconfont icon-duanxinmoban btn-save-as-template', title: '保存为模板' },
  evts: {
    click: function () {
      alert('保存为模板');
    }
  }
})

toolbarHeaderMenu.push({
  tag: 'i',
  props: { className: 'iconfont icon-zuobianjiantou btn-prev', title: '上一步' },
  evts: {
    click: function () {
      alert('上一步');
    }
  }
})

toolbarHeaderMenu.push({
  tag: 'i',
  props: { className: 'iconfont icon-baocun btn-save', title: '保存' },
  evts: {
    click: function () {
      alert('保存');
    }
  }
})

toolbarHeaderMenu.push({
  tag: 'i',
  props: { className: 'iconfont icon-shanchu btn-cancel', title: '取消' },
  evts: {
    click: function () {
      alert('取消');
    }
  }
})

const kgraph = new KGraph({
  container: document.getElementById('kgraph-container'),
  containerHeight: function () { return 500 },
  diagram: {
    dragable: false,
    scroll: true,
    horizontalAlign: 'center',
    verticalAlign: 'center',
    gridWidth: 10,
    gridLineWidth: 2,
    gridAlign: true,
    direction: 'horizontal',
    contextMenu: true,
    diagramSize: 'full',
    diagramWidth: 1002,
    diagramHeight: 802,
    verifyConnection: function (startPoint, endPoint) {
      console.log('定制通用连接规则');
    },
    beforeInsertDNode: function (key, type, dnode) {
      console.log('插入节点前执行，根据返回的boolean值决定是否插入')
      return true;
    },
    afterInsertDNode: function (dnode, index) {
      console.log('插入节点后执行')
    },
    afterCreatePath: function (path) {
      console.log('完成一次连线后执行');
    }
  },
  toolbar: {
    modules: [
      function (refs, graph) {
        let handlerBar = kutil.newElement({
          tag: 'div',
          props: { className: 'kgraph-tool-head' },
          style: { flex: 1, justifyContent: 'flex-end' },
          children: [{
            tag: 'div',
            props: { className: 'kgraph-handle-container' },
            children: toolbarHeaderMenu
          }]
        })

        refs.toolbar.append(handlerBar)
      }
    ],
    toolsConfig: {
      zoomin: {
        title: 'Zoom In'
      }
    },
  },
  footer: {
    modules: [
      function (refs, graph) {
        kutil.newElement({
          tag: 'div',
          ref: 'fieldbar',
          props: { className: 'graph-mode vertical' },
          children: [{
            tag: 'div',
            ref: 'option1',
            props: { className: 'option option-hor' },
            children: [{
              tag: 'i',
              props: { className: 'iconfont icon-liucheng' }
            }, {
              tag: 'span',
              props: { innerHTML: '流程图（横向）' }
            }]
          }, {
            tag: 'i',
            props: { className: 'iconfont icon-qiehuan' }
          }, {
            tag: 'div',
            ref: 'option2',
            props: { className: 'option option-ver' },
            children: [
              {
                tag: 'i',
                props: { className: 'iconfont icon-liucheng' }
              }, {
                tag: 'span',
                props: { innerHTML: '流程图（纵向）' }
              }
            ]
          }]
        }, refs)
        refs.option1.on('click', () => {
          graph.$trigger('changeDir', 'horizontal');
        })
        refs.option2.on('click', () => {
          graph.$trigger('changeDir', 'vertical');
        })
        refs.footer.append(refs.fieldbar);
      }
    ]
  },
});
kgraph.sidebar.createSection('基础流程节点', [{
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
}]);