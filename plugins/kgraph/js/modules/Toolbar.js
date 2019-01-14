const Toolbar = function (graph, config) {
  let tb = this,
  refs = graph.refs,
  options = {
    tools: [{
      undo: { title: '撤销', enabled: true },
      redo: { title: '重做', enabled: true }
    }, {
      copy: { title: '复制', enabled: true, requireDNode: true },
      paste: { title: '粘贴', enabled: true, requireDNode: true },
      delete: { title: '删除', enabled: true, requireDNode: true }
    }, {
      zoomin: { title: '放大', enabled: true },
      zoomout: { title: '缩小', enabled: true },
      fitpagewidth: { title: '适应画布', enabled: true },
      fitpage: { title: '实际尺寸', enabled: true }
    }, {
      tofront: { title: '前置', enabled: true, requireDNode: true },
      toback: { title: '后置', enabled: true, requireDNode: true }
    }]
  },
  container = kutil.newElement({
    tag: 'div',
    ref: 'toolbar',
    props: { className: 'kgraph-toolbar-container' }
  }, refs);

  config = config || {};
  config.toolsConfig || (config.toolsConfig = { });

  if (config.toolsConfig.tools) {
    options.tools.forEach(opts => {
      for (let name in opts) {
        let customOption = config.toolsConfig.tools[name];
        if (customOption) {
          for (let prop in customOption) {
            opts[name][prop] = customOption[prop];
          }
        }
      }
    })
  }

  kutil.extend(config, options);


  tb.graph = graph;
  let tools = { list: [], maps: {} };
  
  let init = function () {
    createTools();
    config.modules.forEach(m => m(refs, graph));
    config.hidden && container.hide();
    config.toolsConfig.hidden && refs.tools.hide();
  }
  let updateTools = function () {
    updateHistoryTools();
    updateDNodeTools();
    update();
  }
  let updateHistoryTools = function () {
    let stateId = graph.$ghistory.getStateId(), stateCount = graph.$ghistory.getLength();
    tools.maps['undo'].config.enabled = stateId > 0;
    tools.maps['redo'].config.enabled = stateId < stateCount - 1;
  }
  let updateDNodeTools = function () {
    let isSelected = !!graph.getSelectedDNode();
    tools.maps['copy'].config.enabled = isSelected;
    tools.maps['paste'].config.enabled = isSelected;
    tools.maps['delete'].config.enabled = isSelected;
    tools.maps['tofront'].config.enabled = isSelected;
    tools.maps['toback'].config.enabled = isSelected;
  }
  let update = function () {
    tools.list.forEach((tool) => {
      if (tool.config.enabled) {
        tool.dom.removeClass('disabled');
      } else {
        tool.dom.addClass('disabled');
      }
    })
  }
  let createTools = function () {
    let toolbar = kutil.newElement({ tag: 'div', ref: 'tools', props: { className: 'kgraph-toolbar' } }, refs)
    config.tools.forEach((ts, idx) => {
      if (idx !== 0) {
        let cutOff = kutil.newElement({ tag: 'div', props: { className: 'cut-off' } })
        toolbar.append(cutOff);
      }
      for (let toolname in ts) {
        let config = ts[toolname];
        if (config.enabled) {
          let tool = kutil.newElement({
            tag: 'div',
            props: { title: config.title, className: 'iconfont icon-' + toolname + ' disabled' },
            evts: {
              click: function () {
                if (!config.enabled) return false;
                graph.$trigger(toolname);
              }
            }
          })
          let tl = {
            name: toolname,
            config: config,
            dom: tool
          }
          tools.maps[tl.name] = tl;
          tools.list.push(tl);
          toolbar.append(tool);
        }
      }
    })
    container.append(toolbar);
  }
  init();
  return {
    container: container,
    updateTools: updateTools
  }
}

export default Toolbar;