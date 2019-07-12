const toolsConfig = [
  { key: 'undo', title: '撤销' },
  { key: 'redo', title: '重做'},
  { key: 'cutOff' },
  { key: 'copy', title: '复制' },
  { key: 'paste', title: '粘贴' },
  { key: 'delete', title: '删除' },
  { key: 'cutOff' },
  { key: 'zoomin', title: '放大' },
  { key: 'zoomout', title: '缩小' },
  { key: 'cutOff' },
  { key: 'fitpagewidth', title: '适应画布' },
  { key: 'fitpage', title: '实际尺寸' },
  { key: 'cutOff' },
  { key: 'tofront', title: '前置' },
  { key: 'toback', title: '后置' }
]

const Toolbar = function (graph, config) {
  const tb = this;
  tb.graph = graph;

  const refs = graph.refs;

  kutil.newElement({ tag: 'div', ref: 'toolbar', props: { className: 'kgraph-toolbar-container' } }, refs);
  
  const defaults = {
    hidden: false,
    toolsHidden: false,
    toolsConfig: {},
    modules: []
  };

  kutil.extend(defaults, config);
  config = defaults;

  toolsConfig.forEach(t => {
    const c = config.toolsConfig[t.key];
    if (c) kutil.extend(t, c);
  })

  const tools = { list: [], maps: {} };
  
  const init = function () {
    createTools();
    config.modules.forEach(m => m(refs, graph));
    config.hidden && refs.toolbar.hide();
    config.toolsHidden && refs.tools.hide();
  }
  
  const updateTools = function () {
    updateHistoryTools();
    updateDNodeTools();
    update();
  }

  const updateHistoryTools = function () {
    let stateId = graph.$ghistory.getStateId(), stateCount = graph.$ghistory.getLength();
    tools.maps['undo'].config.disabled = stateId === 0;
    tools.maps['redo'].config.disabled = stateId >= stateCount - 1;
  }

  const updateDNodeTools = function () {
    let noSelected = !graph.getSelectedDNode();
    tools.maps['copy'].config.disabled = noSelected;
    tools.maps['paste'].config.disabled = noSelected;
    tools.maps['delete'].config.disabled = noSelected;
    tools.maps['tofront'].config.disabled = noSelected;
    tools.maps['toback'].config.disabled = noSelected;
  }

  const update = function () {
    tools.list.forEach(t => t.dom[t.config.disabled ? 'addClass' : 'removeClass']('disabled'));
  }

  const createCutOff = function () {
    let cutOff = kutil.newElement({ tag: 'div', props: { className: 'cut-off' } })
    refs.tools.append(cutOff);
  }

  const createTool = function (t) {
    let tool = kutil.newElement({
      tag: 'div',
      props: { title: t.title, className: 'iconfont icon-' + t.key + ' disabled' },
      evts: {
        click: function () {
          if (config.disabled) return false;
          graph.$trigger(t.key);
        }
      }
    });

    let tl = { name: t.key, config: t, dom: tool };
    
    tools.maps[t.key] = tl;
    tools.list.push(tl);
    refs.tools.append(tool);
  }

  const createTools = function () {
    kutil.newElement({ tag: 'div', ref: 'tools', props: { className: 'kgraph-toolbar' } }, refs);

    toolsConfig.forEach((t) => {
      t.key === 'cutOff' ? createCutOff() : (!t.hidden && createTool(t));
    });
    
    refs.toolbar.append(refs.tools);
  }

  init();

  return {
    updateTools: updateTools
  }
}

export default Toolbar;