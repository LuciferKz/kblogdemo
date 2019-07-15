/* style sheet */
import './css/iconfont/iconfont.css'
import './css/icon.css'
import './css/kgraph.css'

window.onload = function () {
  console.log(kcomponents)
  const kgraph = new KGraph({
    container: document.getElementById('kgraph-container'),
    containerWidth: null,
    containerHeight: function () { return window.innerHeight > 600 ? window.innerHeight - 60 : 540 },
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
      // adjustCr: true,
      offsetX: 240,
      afterCreatePath: function (path) {
        pathCount++
        !path.campaignNodeId && (path.campaignNodeId = 'flow' + (+new Date() + 10 * pathCount ));
      }
    },
    toolbar: {
      toolsHidden: false,
    },
    footer: {
      hidden: false
    },
    sidebar: {
      hidden: false,
    }
  });
  
  kgraph
  .init()
  .then(() => {
    kgraph.sidebar.createSection('组1', [
      {
        key: 'Start',
        text: 'Start',
        value: 'start',
        iconText: '&#xe6ec;',
        top: false,
        left: false,
        onlyone: true,
      },
      {
        key: 'Start',
        text: 'Start',
        value: 'start',
        iconText: '&#xe6ec;',
        top: false,
        left: false,
        onlyone: true,
      },
      {
        key: 'Start',
        text: 'Start',
        value: 'start',
        iconText: '&#xe6ec;',
        top: false,
        left: false,
        onlyone: true,
      },
      {
        key: 'Start',
        text: 'Start',
        value: 'start',
        iconText: '&#xe6ec;',
        top: false,
        left: false,
        onlyone: true,
      },
      {
        key: 'Start',
        text: 'Start',
        value: 'start',
        iconText: '&#xe6ec;',
        top: false,
        left: false,
        onlyone: true,
      },
      {
        key: 'Start',
        text: 'Start',
        value: 'start',
        iconText: '&#xe6ec;',
        top: false,
        left: false,
        onlyone: true,
      },
    ]);
    kgraph.sidebar.createSection('组2', []);
  
    // kgraph.set('message', vm.$message);
  
    window.onresize = kgraph.resize;
  })
}