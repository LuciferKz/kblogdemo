const KGraph = function (container) {
  var kg = this;
  kg.container = document.getElementById(container);
  kg.graph = {}; // 通用数据总线;
}

KGraph.prototype = {
  init: function () {
    let kg = this;
    kg.configGraph();

    kg.fragment = document.createDocumentFragment();
    kg.createToolBar();
    kg.createSideBar();
    kg.createGraph();
    kg.createFooter();
    // kg.createFormat();
    kg.container.appendChild(kg.fragment);

    
    kg.container.addEventListener('mousedown', function (e) {
      e.preventDefault();
    })
    kg.container.addEventListener('mousemove', function (e) {
      e.preventDefault();
    })

    kg.diagram.initCanvas();
    kg.toolbar.updateTools();
  },
  configGraph: function () {
    let kg = this;
    kg.graph = {
      selectedDNode: null, // 当前选中的DNode
      cloneDNode: null, // 已复制的DNode
      startX: 60, // 开始横坐标
      startY: 60, // 开始纵坐标
      scale: 1, // 缩放比例
      direction: 'vertical', // 流程走向;
      updateToolbar: function () {
        // 更新工具栏
        kg.toolbar.updateTools();
      },
      updateFormat: function () {
        // 更新格式栏
        // kg.format.switchFormat();
      },
      updateDiagram: function () {
        // 更新图表
        kg.diagram.draw();
      },
      ghistory: new KGraphHistory(this)
    }

    KGEvent.call(kg);
  },
  createGraph: function () {
    let kg = this;
    kg.diagram = new Diagram();
    kg.diagram.init();
    kg.diagram.graph = kg.graph;
    kg.fragment.appendChild(kg.diagram.container);
  },
  createToolBar: function () {
    let kg = this;
    kg.toolbar = new Toolbar();
    kg.toolbar.init();
    kg.toolbar.graph = kg.graph;
    kg.fragment.appendChild(kg.toolbar.container);
  },
  createSideBar: function () {
    let kg = this;
    kg.sidebar = new Sidebar();
    kg.sidebar.init();
    kg.sidebar.graph = kg.graph;
    
    kg.sidebar.graph.sbdnodes = kg.sidebar.dnodes,
    kg.fragment.appendChild(kg.sidebar.container);
  },
  createFormat: function () {
    let kg = this;
    kg.format = new Format();
    kg.format.init();
    kg.format.graph = kg.graph;
    kg.fragment.appendChild(kg.format.container);
  },
  createFooter: function () {
    let kg = this;
    kg.footer = new Footer();
    kg.footer.init();
    kg.footer.graph = kg.graph;
    kg.diagram.container.appendChild(kg.footer.container);
  }
}

const Diagram = function () {
  let g = this;

  g.config = KGraphConfig.diagram;
  g.container = document.createElement('div');
  g.container.className = this.config.class.container;

  g.caWidth = 0; // 画布的宽度
  g.caHeight = 0; // 画布的高度
}

Diagram.prototype = {
  init: function () {
    this.reset();
    this.createCanvas();
  },
  reset: function () {
    let g = this;
  
    g.dnodes = []; // 节点列表集合
    g.paths = []; // 连接路线
    g.pathsMaps = {}; // 路线map集合
  
    g.diagramWidth = 602; // diagram的宽度
    g.diagramHeight = 802; // diagram的高度
  
    g.coordx = 0; // 坐标系原点横坐标
    g.coordy = 0; // 坐标系原点纵坐标
  
    g.gridWidth = 10; // 栅格的间距
    g.gridLineWidth = 2; // 栅格线粗细
  
    g.gridAlign = true; // 网格对齐;

    g.dragable = true;
  },
  createCanvas: function () {
    let g = this;
    let main = document.createElement('div');
    main.className = 'kgraph-diagram';

    let mainHead = document.createElement('div');
    mainHead.className = 'kgraph-diagram-head';

    let mainTitle = document.createElement('div');
    mainTitle.className = 'kgraph-diagram-title';
    let icon = document.createElement('i');
    icon.className = 'iconfont icon-huodong-copy-copy'
    let text = document.createElement('div');
    let en = document.createElement('div');
    en.className = 'text-en';
    let cn = document.createElement('div');
    cn.className = 'text-cn';
    en.innerHTML = 'Activity  Management';
    cn.innerHTML = '活动管理';

    let graphHandle = document.createElement('div');
    graphHandle.className = 'kgraph-handle-container';

    let button = document.createElement('button');
    button.className = 'btn-save-as-template';
    button.textContent = '保存为模板';
    graphHandle.appendChild(button);

    button = document.createElement('button');
    button.className = 'btn-prev';
    button.textContent = '上一步';
    graphHandle.appendChild(button);
    
    button = document.createElement('button');
    button.className = 'btn-save';
    button.textContent = '完成';
    graphHandle.appendChild(button);
    
    button = document.createElement('button');
    button.className = 'btn-cancel';
    button.textContent = '取消';
    graphHandle.appendChild(button);

    mainTitle.appendChild(graphHandle);

    mainTitle.appendChild(icon);
    text.appendChild(en);
    text.appendChild(cn);
    mainTitle.appendChild(text);
    mainHead.appendChild(mainTitle);
    mainHead.appendChild(graphHandle);

    let canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.style.backgroundColor = '#f8fbfb';
    g.canvas = canvas;

    let diagramDragLayer = document.createElement('div');
    diagramDragLayer.className = 'diagram-drag-layer'
    g.diagramDragLayer = diagramDragLayer;

    main.appendChild(canvas);
    main.appendChild(diagramDragLayer);
    g.container.appendChild(mainHead);
    g.container.appendChild(main);
  },
  initCanvas: function () {
    let g = this;
    g.ctx = g.canvas.getContext('2d');
    let clientRect = g.diagramDragLayer.getBoundingClientRect()
    g.graph.clientRect = clientRect;
    g.clientRect = clientRect;
    g.canvas.width = clientRect.width;
    g.canvas.height = clientRect.height;
    g.caWidth = clientRect.width;
    g.caHeight = clientRect.height;

    g.coordx = g.caWidth - g.diagramWidth > 0 ? (g.caWidth - g.diagramWidth) / 2 : 0;
    g.coordy = g.caHeight - g.diagramHeight > 0 ? (g.caHeight - g.diagramHeight) / 2 : 0;

    g.kevent = new KEvent();
    g.kevent.init(g.diagramDragLayer);
    g.kevent.setOffset(g.coordx, g.coordy);

    let downPoint = {};

    let downCanvas = function (e) {
      downPoint.x = e.clientX - g.coordx;
      downPoint.y = e.clientY - g.coordy;
      if (!g.dragable) return false;
      document.addEventListener('mousemove', g.dragCanvas)
      document.addEventListener('mouseup', g.dropCanvas)
    }

    g.dragCanvas = function (e) {
      g.coordx = e.clientX - downPoint.x; 
      g.coordy = e.clientY - downPoint.y;
      g.kevent.setOffset(g.coordx, g.coordy);
      g.draw();
    }

    g.dropCanvas = function (e) {
      g.selectDNode(null);
      document.removeEventListener('mousemove', g.dragCanvas)
      document.removeEventListener('mouseup', g.dropCanvas)
    }

    g.diagramDragLayer.addEventListener('mousedown', downCanvas)
    g.draw();
    
    g.saveState('init diagram');
  },
  selectDNode: function (dnode) {
    // if dnode === null 重置graph到无选中dnode状态;
    let g = this;
    if (g.graph.selectedDNode && g.graph.selectedDNode !== dnode) {
      g.graph.selectedDNode.blur();
      g.setCMEvt(g.graph.selectedDNode, 'del');
    }
    g.graph.selectedDNode = dnode;
      
    g.graph.updateFormat();
    g.graph.updateToolbar();
    g.draw();
  },
  findLastDNode: function () {
    let g = this, bottomDNode = { x: 0, y: 0 };
    g.mapDNodes((dnode, idx, dnodes) => {
      if (g.graph.direction === 'horizontal') {
        bottomDNode.x = Math.max(bottomDNode.x, dnode.x);
      } else if (g.graph.direction === 'vertical') {
        bottomDNode.y = Math.max(bottomDNode.y, dnode.y);
      }
    })
    return bottomDNode;
  },
  checkInsertAvailable: function (dnode) {
    let g = this, lastDNode = g.findLastDNode();

    dnode.x = g.graph.startX;
    dnode.y = g.graph.startY;

    if (lastDNode.y > 0) {
      dnode.y = lastDNode.y + dnode.height + 20;
    } else if (lastDNode.x > 0) {
      dnode.x = lastDNode.x + dnode.width + 20;
    }
  },
  clearCanvasEvent: function () {
    this.dragable = false;
    document.removeEventListener('mousemove', this.dragCanvas);
    document.removeEventListener('mouseup', this.dropCanvas);
  },
  updateDNodeEvt: function (dnode) {
    let g = this;
    g.setDNodeEvt(dnode, 'update');
    g.setConnectsEvt(dnode,'update');
    g.setCMButtonEvt(dnode, 'update');
    g.setCMEvt(dnode, 'update');
  },
  delDNodeEvt: function (dnode) {
    let g = this;
    console.log(dnode);
    g.setDNodeEvt(dnode, 'del');
    g.setConnectsEvt(dnode,'del');
    g.setCMButtonEvt(dnode, 'del');
    g.setCMEvt(dnode, 'del');
  },
  setDNodeEvt: function (dnode, type) {
    let g = this;
    g.setEvt(dnode, type);
  },
  setConnectsEvt: function (dnode, type) {
    let g = this;
    dnode.connects.forEach((cp) => {
      g.setEvt(cp, type);
    })
  },
  setCMButtonEvt: function (dnode, type) {
    if (!dnode.cmbutton) { return false };
    let g = this;
    g.setEvt(dnode.cmbutton, type);
  },
  setCMEvt: function (dnode, type) {
    let g = this;
    dnode.cmenu.forEach((cmitem) => {
      g.setEvt(cmitem, type);
    })
  },
  setEvt: function (o, type) {
    let g = this;
    console.log(type);
    let handler = type + 'Event';
    g.kevent[handler](o, 'mouseenter');
    g.kevent[handler](o, 'mousedown');
    g.kevent[handler](o, 'mouseleave');
  },
  initDNode: function (dnode) {
    // 初始化dnode, 包括给dnode绑定操作事件;
    let g = this,
    downPoint = {}, // 鼠标落点
    prevCoord = {}; // 开始移动前的坐标
    dnode.init(g.graph.direction);
    
    dnode.cmenu.forEach((item) => {
      let sbdnode = g.graph.sbdnodes.maps[item.id];
      item.setText(sbdnode.text);
      item.setIcon(sbdnode.icon);
    })

    let select = function (e) {
      downPoint.x = e.clientX;
      downPoint.y = e.clientY;
      prevCoord.x = dnode.x;
      prevCoord.y = dnode.y;

      g.clearCanvasEvent();

      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', drop)
    }
    let drag = function (e) {
      if (e.clientX === downPoint.x && e.clientY === downPoint.y) {
        return false;
      }
      dnode.drag();

      let movex = e.clientX - downPoint.x;
      let movey = e.clientY - downPoint.y;
      
      if (g.gridAlign) {
        movex = movex - movex % g.gridWidth;
        movey = movey - movey % g.gridWidth;
      }
      dnode.moveDragDNode(prevCoord.x + g.calcScale(movex), prevCoord.y + g.calcScale(movey));
      g.draw();
    }
    let drop = function (e) {
      g.dragable = true;
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
      if (e.clientX === downPoint.x && e.clientY === downPoint.y) {
        g.selectDNode(dnode);
        dnode.focus();
        return false;
      }
      dnode.drop();
      
      g.checkDiagramSize(dnode);
      // drop后更新kevent事件
      g.updateDNodeEvt(dnode);
      g.draw();

      g.saveState('drop dnode');
    }
    
    g.kevent.addEvent(dnode, 'mouseenter', () => {
      g.diagramDragLayer.style.cursor = 'move';
      dnode.enter();
      // g.createConnectsBtn(dnode);
      g.draw();
    })
    g.kevent.addEvent(dnode, 'mousedown', select)
    g.kevent.addEvent(dnode, 'mouseleave', () => {
      g.diagramDragLayer.style.cursor = '-webkit-grab';
      dnode.leave();
      g.draw();
    })

    if (dnode.cmbutton) {
      g.kevent.addEvent(dnode.cmbutton, 'mouseenter', () => {
        g.diagramDragLayer.style.cursor = 'pointer';
      }, dnode)
      g.kevent.addEvent(dnode.cmbutton, 'mousedown', () => {
        dnode.showMenu();
        dnode.cmenu.forEach((item) => {
          g.initConnectsMenuItem(dnode, item);
        })
        g.draw();
      }, dnode)
      g.kevent.addEvent(dnode.cmbutton, 'mouseleave', () => {
        g.diagramDragLayer.style.cursor = '-webkit-grab';
      }, dnode)
    }

    g.initConnects(dnode);
  },
  calcScale: function (n) {
    let g = this;
    return n / g.graph.scale;
  },
  initConnects: function (dnode) {
    let g = this, downPoint = {};

    dnode.connects && dnode.connects.forEach((cp) => {
      let begin = function (e) {
        g.tmpPath = new Path(cp, g.graph.direction);
        g.connecting = true;
        downPoint.x = e.pageX;
        downPoint.y = e.pageY;
        g.clearCanvasEvent();
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', close);
      }

      let move = function (e) {
        g.tmpPath.move(g.calcScale(e.pageX - g.clientRect.x - g.coordx), g.calcScale(e.pageY - g.clientRect.y - g.coordy));
        g.draw();
      }

      let close = function (e) {
        g.dragable = true;
        g.connecting = false;
        let connectPoint = g.checkConnect({ x: g.calcScale(e.pageX - g.clientRect.x - g.coordx), y: g.calcScale(e.pageY - g.clientRect.y - g.coordy) });
        if (connectPoint) {
          if (connectPoint.position === cp.position) {
            alert(cp.position === 'top' || cp.position === 'left' ? '需要连接节点开始位置' : '需要连接节点结束位置')
          } else if (cp.children && !~cp.children.indexOf(connectPoint.parentId)) {
            alert(g.graph.sbdnodes.maps[dnode.id].text + '节点只能连接' + dnode.children.map((id) => g.graph.sbdnodes.maps[id].text).join(','))
          } else {
            g.tmpPath.closePath(connectPoint);
            cp.paths.push(g.paths.length);
            connectPoint.paths.push(g.paths.length);
            g.paths.push(g.tmpPath);
            g.saveState('add path');
          }
        }
        g.tmpPath = null;
        g.draw();
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', close);
      }
      
      g.kevent.addEvent(cp, 'mouseenter', () => {
        g.diagramDragLayer.style.cursor = 'auto';
      })
      g.kevent.addEvent(cp, 'mousedown', begin)
      g.kevent.addEvent(cp, 'mouseleave', () => {
        g.diagramDragLayer.style.cursor = '-webkit-grab';
      })
    })
  },
  initConnectsMenuItem: function (dnode, cmitem) {
    let g = this;
    g.kevent.addEvent(cmitem, 'mouseenter', () => {
      g.diagramDragLayer.style.cursor = 'pointer';
    })
    g.kevent.addEvent(cmitem, 'mousedown', () => {
      g.graph.$trigger('insert', g.graph.sbdnodes.maps[cmitem.id], 'cmitem', (newDNode) => {
        let startCp = dnode.connects.slice(-1)[0],
        path = new Path(startCp, g.graph.direction),
        endCp = newDNode.connects[0];
        path.closePath(endCp);
        startCp.paths.push(g.paths.length);
        endCp.paths.push(g.paths.length);
        g.paths.push(path)
        g.saveState('add path and dnode');
      }, g.graph.direction === 'vertical' ? { x: dnode.x, y: dnode.y + dnode.height + 60 } : { x: dnode.x + dnode.width + 60, y: dnode.y });
    })
    g.kevent.addEvent(cmitem, 'mouseleave', () => {
      g.diagramDragLayer.style.cursor = '-webkit-grab';
    })
  },
  checkConnect: function (point) {
    let g = this, i = 0, len = g.dnodes.length, connectPoint = null;
    for (; i < len; i++) {
      let connects = g.dnodes[i].connects, j = 0, jlen = connects.length;
      for (; j < jlen; j++) {
        let cp = connects[j]
        if (cp.x - cp.outlineR < point.x && cp.x + cp.outlineR * 2 > point.x && cp.y - cp.outlineR < point.y && cp.y + cp.outlineR * 2 > point.y) {
          connectPoint = cp;
        }
      }
    }
    return connectPoint;
  },
  checkDiagramSize: function (dnode) {
    // 检查diagram尺寸是否将要溢出，并根据情况扩大。
    let g = this;
    if (dnode.x > g.diagramWidth - dnode.width - 100) {
      g.diagramWidth = dnode.x + dnode.width + 100;
    }
    if (dnode.y > g.diagramHeight - 100) {
      g.diagramHeight = dnode.y + dnode.height + 100;
    }
  },
  mapDNodes: function (cb) {
    let g = this, i = 0, len = g.dnodes.length;
    for (; i < len; i++) {
      cb(g.dnodes[i], i, g.dnodes);
    }
  },
  restoreState: function (s) {
    let g = this;
    g.kevent.clearEvent();

    let state = JSON.parse(s);
    Object.assign(g, state);

    console.log(state);

    g.graph.scale = state.scale;
    g.graph.$trigger('scalechanged');
    g.dnodes = g.dnodes.map((dnode) => {
      let newDNode = new DNode(dnode, g.ctx);
      g.initDNode(newDNode);
      return newDNode;
    });
    g.paths = g.paths.map((path) => {
      let _path = new Path(path.start, path.dir);
      _path.closePath(path.end);
      return _path;
    })
    g.selectDNode(null);
  },
  saveState: function (from) {
    let g = this;
    console.log(from);
    let state = JSON.stringify({
      dnodes: g.dnodes, // 所有的节点
      paths: g.paths, // 所有的连接路线
      diagramWidth: g.diagramWidth, // 图表宽度
      diagramHeight: g.diagramHeight, // 图表高度
      coordx: g.coordx, // 坐标原点x
      coordy: g.coordy, // 坐标原点y
      gridWidth: g.gridWidth, // 网格宽度
      gridAlign: g.gridAlign, // 网格是否对齐
      scale: g.graph.scale // 缩放比例
    });
    g.graph.ghistory.saveState(state);
    g.graph.updateToolbar();
  },
  draw: function (type) {
    requestAnimationFrame(() => {
      let g = this;
      g.clear();
      g.ctx.save();
      g.ctx.translate(g.coordx, g.coordy);
      g.ctx.scale(g.graph.scale, g.graph.scale);
      g.drawBackground();
      g.drawDNodes();
      g.drawConnectPoint();
      g.drawPaths();
      
      g.drawConnectsMenu();
      g.ctx.restore();
    })
  },
  clear: function () {
    this.ctx.clearRect(0, 0, this.caWidth, this.caHeight);
  },
  drawBackground: function () {
    let g = this, gridX = 0, gridY = 0, ctx = g.ctx;

    ctx.beginPath();
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth = g.gridLineWidth;
    while (gridY < g.diagramHeight) {
      ctx.moveTo(0, gridY);
      ctx.lineTo(g.diagramWidth, gridY);
      gridY += g.gridWidth;
    }
    while (gridX < g.diagramWidth) {
      ctx.moveTo(gridX, 0);
      ctx.lineTo(gridX, g.diagramHeight);
      gridX += g.gridWidth;
    }
    ctx.stroke();
  },
  drawDNodes: function () {
    let g = this;
    g.mapDNodes(function (dnode) {
      dnode.draw();
    })
  },
  drawConnectPoint: function () {
    let g = this;
    g.mapDNodes(function (dn) {
      dn.draw();
      dn.connects.forEach((cp) => {
        g.connecting && cp.drawOutline();
        cp.draw();
      })
    })
  },
  drawConnectsMenu: function () {
    let g = this;
    g.mapDNodes(function (dn) {
      dn.isShowMenu && dn.cmenu.forEach((cm) => {
        cm.draw();
      })
    })
  },
  drawPaths: function () {
    let g = this;
    g.tmpPath && g.tmpPath.draw();
    g.paths.forEach((p) => {
      if (p) {
        p.connectPoints();
        p.draw();
      }
    })
  },
  createConnectsBtn: function (dnode, x, y) {
    let g = this;
    // 创建连接按钮
    let button = document.createElement('div');
    button.className = 'iconfont icon-jia';

    button.style.position = 'absolute';
    button.style.left = dnode.x + g.coordx + 120 + 'px';
    button.style.top = dnode.y + g.coordy + dnode.height / 2 + 'px';
    button.style.width = '14px';
    button.style.height = '14px';
    button.style.transform = 'translate(0, -50%)';
    button.style.border = '1px solid #333';
    button.style.borderRadius = '13px';
    button.style.fontSize = '12px';
    button.style.lineHeight = '14px';
    button.style.textAlign = 'center';

    g.diagramDragLayer.appendChild(button);
  },
  scalechanged: function () {
    let dg = this, g = dg.graph;
    dg.coordx = dg.caWidth - dg.diagramWidth * g.scale > 0 ? (dg.caWidth - dg.diagramWidth * g.scale) / 2 : 0;
    dg.coordy = dg.caHeight - dg.diagramHeight * g.scale > 0 ? (dg.caHeight - dg.diagramHeight * g.scale) / 2 : 0;

    dg.kevent.setOffset(dg.coordx, dg.coordy);
    dg.kevent.setScale(g.scale);
  }
}

const Toolbar = function () {
  let tb = this;

  tb.config = KGraphConfig.toolbar;
  tb.container = document.createElement('div');
  tb.container.className = tb.config.class.container;

  tb.tools = { list: [], maps: {} };
}

Toolbar.prototype = {
  init: function () {
    this.createTools();
  },
  updateTools: function () {
    let tb = this;
    tb.updateHistoryTools();
    tb.updateDNodeTools();
    tb.updateCanvasTools();
    tb.update();
  },
  updateHistoryTools: function () {
    let tb = this, stateId = tb.graph.ghistory.getStateId(), stateCount = tb.graph.ghistory.getLength();
    tb.tools.maps['undo'].config.enabled = stateId > 0;
    tb.tools.maps['redo'].config.enabled = stateId < stateCount - 1;
  },
  updateDNodeTools: function () {
    let tb = this,
    isSelected = !!tb.graph.selectedDNode;

    tb.tools.maps['copy'].config.enabled = isSelected;
    tb.tools.maps['paste'].config.enabled = isSelected;
    tb.tools.maps['delete'].config.enabled = isSelected;
    tb.tools.maps['tofront'].config.enabled = isSelected;
    tb.tools.maps['toback'].config.enabled = isSelected;

  },
  updateCanvasTools: function () {

  },
  update: function () {
    let tb = this;
    tb.tools.list.forEach((tool) => {
      if (tool.config.enabled) {
        tool.dom.classList.remove('disabled');
      } else {
        tool.dom.classList.add('disabled');
      }
    })
  },
  handler: function () {
    tb.graph.$trigger(toolname);
  },
  createTools: function () {
    let tb = this,
    toolbar = document.createElement('div');
    toolbar.className = 'kgraph-toolbar';

    tb.config.tools.forEach((tools, idx) => {
      if (idx !== 0) {
        let cutOff = document.createElement('div');
        cutOff.className = 'cut-off';
        toolbar.appendChild(cutOff);
      }
      for (let toolname in tools) {
        let config = tools[toolname];
        if (config.enabled) {
          let tool = document.createElement('div');
          tool.title = config.title;
          tool.className = 'iconfont icon-' + toolname + ' disabled';
  
  
          tool.addEventListener('click', function () {
            if (!config.enabled) return false;
            tb.graph.$trigger(toolname);
          })
  
          toolbar.appendChild(tool);
          
          let tl = {
            name: toolname,
            config: config,
            dom: tool
          }
  
          tb.tools.maps[tl.name] = tl;
          tb.tools.list.push(tl);
          toolbar.appendChild(tool);
        }
      }
    })
    this.container.appendChild(toolbar);
  }
}

const FormatContainer = function (ft, title, style) {
  let df = this;

  // 格式容器
  let container = document.createElement('div');
  container.className = style;

  // 格式对应标题
  let containerTitle = document.createElement('div');
  containerTitle.className = 'format-title';

  let icon = document.createElement('i');
  icon.className = 'iconfont icon-fenlei1';
  
  let span = document.createElement('span');
  span.innerText = title;

  // 格式操作表单
  let containerForm = document.createElement('div');
  containerForm.className = 'format-form';

  containerTitle.appendChild(icon);
  containerTitle.appendChild(span);
  container.appendChild(containerTitle);
  container.appendChild(containerForm);
  ft.container.appendChild(container);

  return {
    clearForm: function () {
      containerForm.innerHTML = '';
    },
    append: function (node) {
      containerForm.appendChild(node);
    },
    show: function () {
      container.style.display = 'block';
    },
    hide: function () {
      container.style.display = 'none';
    }
  }
}

const Format = function () {
  let ft = this;
  ft.config = KGraphConfig.format;
  ft.container = document.createElement('div');
  ft.container.className = ft.config.class.container;
}

Format.prototype = {
  init: function () {
    let ft = this;
    ft.canvasFormat = new FormatContainer(ft, '画布属性', 'format-canvas-container');
    ft.createCanvasFormat();
    ft.dnodeFormat = new FormatContainer(ft, '节点属性', 'format-dnode-container');
    ft.dnodeFormat.hide();
  },
  createCanvasFormat: function () {
    let ft = this;
  },
  createDNodeFormat: function () {
    let ft = this;
    let fieldbar = document.createElement('div');
    fieldbar.className = 'text-input-panel';

    let fieldname = document.createElement('span');
    fieldname.className = 'field-name';
    fieldname.innerHTML = '节点名称';

    let fieldvalue = document.createElement('div');
    fieldvalue.className = 'field-value';

    let input = document.createElement('input');
    input.type = 'text';
    input.value = ft.graph.selectedDNode.text;

    fieldvalue.appendChild(input);
    fieldbar.appendChild(fieldname);
    fieldbar.appendChild(fieldvalue);
    ft.dnodeFormat.append(fieldbar);

    input.addEventListener('input', function () {
      ft.graph.selectedDNode.text = input.value;
      ft.graph.updateDiagram();
    })

    input.addEventListener('blur', function () {
      ft.graph.$trigger('editText');
    })
  },
  switchFormat: function () {
    let ft = this;
    if (ft.graph.selectedDNode) {
      ft.dnodeFormat.clearForm();
      ft.dnodeFormat.show();
      ft.canvasFormat.hide();
      ft.createDNodeFormat();
    } else {
      ft.dnodeFormat.hide();
      ft.canvasFormat.clearForm();
      ft.canvasFormat.show();
      ft.createCanvasFormat();
    }
  }
}

const Sidebar = function () {
  let sb = this;
  sb.config = KGraphConfig.sidebar;
  sb.container = document.createElement('div');
  sb.container.className = this.config.class.container;
  sb.dnodes = {
    list: [],
    maps: {}
  } // 可选项集合
}

Sidebar.prototype = {
  init: function () {
  },
  createSection: function (title, items) {
    let sb = this;
    let section = document.createElement('div');
    section.className = 'sidebar-section';

    let icon = document.createElement('i');
    icon.className = 'iconfont icon-fenlei1';

    let sectionTitle = document.createElement('div');
    sectionTitle.className = 'sidebar-section-title';
    sectionTitle.appendChild(icon);

    let span = document.createElement('span');
    span.innerText = title;
    sectionTitle.appendChild(span);

    section.appendChild(sectionTitle);
    
    let sectionItems = document.createElement('div');
    sectionItems.className = 'sidebar-section-items';

    items.forEach((item) => {
      sb.createItem(sectionItems, item)
      sb.addDNodeEvt(item);
    })
    section.appendChild(sectionItems);

    this.container.appendChild(section);
  },
  createItem: function (container, item) {
    let sectionItem = document.createElement('div');
    sectionItem.className = 'sidebar-section-item item-'+ item.value;

    let icontext = document.createElement('i');
    icontext.className = 'iconfont';
    icontext.innerHTML = item.iconText;

    let itemtext = document.createElement('span');
    itemtext.innerText = item.text;

    sectionItem.appendChild(icontext);
    sectionItem.appendChild(itemtext);
    
    item.dom = sectionItem;
    container.appendChild(sectionItem);
    item.width = 140;
    item.height = 40;
    item.icon = icontext.textContent;
    item.text = item.text;
    
    this.dnodes.list.push(item);
    this.dnodes.maps[item.id] = item;
  },
  addDNodeEvt: function (item) {
    let sb = this, downPoint = {}, grabing = false, enter = false, dragDNode;

    let drag = function (e) {
      if (!grabing) {
        if (Math.abs(downPoint.x - e.clientX) > 10  || Math.abs(downPoint.y - e.clientY) > 10) {
          grabing = true;
          dragDNode = sb.createDRagDNode(item, downPoint.x, downPoint.y);
        } else {
          return false;
        }
      }
      if (e.clientX > sb.graph.clientRect.left && e.clientX < sb.graph.clientRect.right
        && e.clientY > sb.graph.clientRect.top && e.clientY < sb.graph.clientRect.bottom) {
        if (!enter) {
          enter = true;
          dragDNode.style.width = item.width * sb.graph.scale + 'px';
          dragDNode.style.height = item.height * sb.graph.scale + 'px';
        }
      } else {
        if (enter) {
          enter = false;
          dragDNode.style.width = item.width + 'px';
          dragDNode.style.height = item.height + 'px';
        }
      }

      dragDNode.style.transform = 'translate('+ (e.clientX - downPoint.x) +'px, '+ (e.clientY - downPoint.y) +'px)';
    }

    let drop = function (e) {
      if (!grabing) {
        sb.graph.$trigger('insert', item, 'click');
      } else {
        if (dragDNode) {
          document.getElementsByTagName('body')[0].removeChild(dragDNode);
          item.x = e.clientX - sb.graph.clientRect.x;
          item.y = e.clientY - sb.graph.clientRect.y;
          sb.graph.$trigger('insert', item, 'drag');
        }
      }

      grabing = false;
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
    }

    item.dom.addEventListener('mousedown', (e) => {
      downPoint.x = e.clientX;
      downPoint.y = e.clientY;
      
      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', drop)
    });
  },
  createDRagDNode: function (item, x, y) {
    let dragDNode = document.createElement('div');
    dragDNode.style.width = item.width + 'px';
    dragDNode.style.height = item.height + 'px';
    dragDNode.style.border = '1px dashed #333';
    dragDNode.style.position = 'absolute';
    dragDNode.style.top = y + 'px';
    dragDNode.style.left = x + 'px';
    dragDNode.style.zIndex = 999;
    dragDNode.style.transform = 'translate(0,0)';
    document.getElementsByTagName('body')[0].appendChild(dragDNode);
    return dragDNode;
  }
}

const Footer = function () {
  let ftr = this;
  ftr.container = document.createElement('div');
  ftr.container.className = 'kgraph-footer-container';
}

Footer.prototype = {
  init: function () {
    let ftr = this;
    ftr.createDiagramScale();
    ftr.createGraphMode();
  },
  createDiagramScale: function () {
    let ftr = this;
    let diagramScale = document.createElement('div');
    diagramScale.className = 'diagram-scale';
    
    let scale = document.createElement('div');
    scale.className = 'scale';
    let scaleBar = document.createElement('div');
    scaleBar.className = 'scale-bar';
    scaleBar.style.width = '50%';
    let scaleDrag = document.createElement('div');
    scaleDrag.className = 'scale-drag';
    scaleBar.appendChild(scaleDrag);
    scale.appendChild(scaleBar);

    let zoom = document.createElement('div');
    zoom.className = 'zoom';
    let zoomOut = document.createElement('div');
    zoomOut.className = 'scale-zoom-out iconfont icon-jian2';
    let scaleValue = document.createElement('div');
    scaleValue.className = 'scale-value';
    scaleValue.innerHTML = '100%';
    let zommIn = document.createElement('div');
    zommIn.className = 'scale-zoom-in iconfont icon-jia1';

    zoom.appendChild(zoomOut);
    zoom.appendChild(scaleValue);
    zoom.appendChild(zommIn);

    zoomOut.addEventListener('click', () => {
      ftr.graph.$trigger('zoomout');
    });

    zommIn.addEventListener('click', () => {
      ftr.graph.$trigger('zoomin');
    });

    diagramScale.appendChild(scale);
    diagramScale.appendChild(zoom);
    ftr.scaleBar = scaleBar;
    ftr.scaleValue = scaleValue;
    ftr.container.appendChild(diagramScale);
  },
  createGraphMode: function () {
    let ftr = this;
    let fieldbar = document.createElement('div');
    fieldbar.className = 'graph-mode vertical';

    let option1 = document.createElement('div');
    option1.className = 'option option-hor'
    let icon = document.createElement('i');
    icon.className = 'iconfont icon-liucheng';
    option1.appendChild(icon);
    let text = document.createElement('span');
    text.innerHTML = '流程图（横向）';
    option1.appendChild(text);
    fieldbar.appendChild(option1);

    icon = document.createElement('icon');
    icon.className = 'iconfont icon-qiehuan';
    fieldbar.appendChild(icon);
    
    let option2 = document.createElement('div');
    option2.className = 'option option-ver'
    icon = document.createElement('i');
    icon.className = 'iconfont icon-liucheng';
    option2.appendChild(icon);
    text = document.createElement('span');
    text.innerHTML = '流程图（纵向）';
    option2.appendChild(text);
    fieldbar.appendChild(option2);

    option1.addEventListener('click', function () {
      ftr.graph.$trigger('changeDir', 'horizontal');
      fieldbar.className = 'graph-mode horizontal';
    })
    option2.addEventListener('click', function () {
      ftr.graph.$trigger('changeDir', 'vertical');
      fieldbar.className = 'graph-mode vertical';
    })
    ftr.container.append(fieldbar);
  },
  scalechanged: function (scale) {
    let ftr = this;
    ftr.scaleValue.innerHTML = scale * 100 + '%';
    ftr.scaleBar.style.width = scale / 2 * 100 + '%';
  }
}

// digrame node 线图节点
const DNode = function (dnode, ctx) {
  let dn = this;
  dn.borderColor = '#007fb1';
  dn.bgColor = '#fff';
  dn.textColor = '#333';
  dn.iconColor = '#007fb1';
  dn.top = true;
  dn.left = true;
  dn.bottom = true;
  dn.right = true;
  dn.isShowMenu = false;
  Object.assign(this, dnode);
  dn.ctx = ctx;
  dn.connects = [];
  dn.cmenu = [];
}

DNode.prototype = {
  init: function (dir) {
    let dn = this;
    dn.dir = dir;
    dn.connects.length > 0 ? dn.updateConnects() : dn.createConnects();

    if (dn.children) {
      dn.cmbutton = new ConnectsMenuButton()
      dn.cmbutton.init(dn);
    }

    if (dn.cmenu.length) {
      dn.cmenu.forEach((cmitem) => {
        cmitem.follow(dn);
      })
    } else {
      dn.cmenu = dn.children ? dn.children.map((id, idx) => {
        let cmitem = new ConnectsMenuItem(id, idx);
        cmitem.init(dn);
        return cmitem;
      }) : [];
    }
  },
  createConnects: function () {
    let dn = this, dir = dn.dir;
    dn.connects = [];
    if (dir === 'vertical') {
      if (dn.top) {
        dn.startCp = new ConnectPoint('top');
        dn.connects.push(dn.startCp);
      }
      if (dn.bottom) {
        dn.endCp = new ConnectPoint('bottom');
        dn.connects.push(dn.endCp);
      }
    } else if (dir === 'horizontal') {
      if (dn.left) {
        dn.startCp = new ConnectPoint('left');
        dn.connects.push(dn.startCp);
      }
      if (dn.right) {
        dn.endCp = new ConnectPoint('right');
        dn.connects.push(dn.endCp);
      }
    }

    dn.connects.forEach((cp) => {
      cp.init(dn);
    })
  },
  updateConnects: function () {
    let dn = this;
    if (dn.dir === 'vertical') {
      dn.startCp && dn.startCp.setPosition('top');
      dn.endCp && dn.endCp.setPosition('bottom');
    } else {
      dn.startCp && dn.startCp.setPosition('left');
      dn.endCp && dn.endCp.setPosition('right');
    }

    dn.moveConnects();
  },
  moveConnects: function () {
    let dn = this;
    dn.connects.forEach((cp) => {
      cp.follow(dn);
    })
  },
  reset: function () {
    let dn = this;
    dn.focusing = false;
    dn.entering = false;
    dn.grabing = false;
  },
  draw: function () {
    let dn = this;
    dn.drawRect(dn.ctx);
    dn.drawText(dn.ctx);
    dn.drawIcon(dn.ctx);
    dn.cmbutton && dn.cmbutton.draw();
    (dn.entering || dn.grabing || dn.focusing) && dn.drawOutline(dn.ctx);
    dn.grabing && dn.drawDragDNode(dn.ctx);
  },
  drawRect: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.fillStyle = dn.bgColor;
    ctx.fillRect(dn.x, dn.y, dn.width, dn.height);
    ctx.fillStyle = dn.borderColor;
    ctx.fillRect(dn.x, dn.y, 6, dn.height);
    ctx.restore();
  },
  getPoint: function (x, y) {
    return { x: x, y: y };
  },
  drawRoundedRect: function (r){
    var ptA = this.getPoint(this.x + r, this.y);
    var ptB = this.getPoint(this.x + this.width, this.y);
    var ptC = this.getPoint(this.x + this.width, this.y + this.height);
    var ptD = this.getPoint(this.x, this.y + this.height);
    var ptE = this.getPoint(this.x, this.y);
    
    let ctx = this.ctx;

    ctx.strokeStyle = '#f6c231';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

    ctx.stroke();
  },
  drawText: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = '12px 黑体'
    ctx.fillStyle = dn.textColor;
    ctx.fillText(dn.text, dn.x + 35, dn.y + dn.height / 2);
    ctx.restore();
  },
  drawIcon: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = '16px iconfont';
    ctx.fillStyle = dn.iconColor;
    ctx.fillText(dn.icon, dn.x + 14, dn.y + dn.height / 2);
    ctx.restore();
  },
  focus: function () {
    this.focusing = true;
  },
  blur: function () {
    this.focusing = false;
    this.isShowMenu = false;
  },
  enter: function () {
    this.entering = true;
  },
  leave: function () {
    this.entering = false;
  },
  showMenu: function () {
    this.isShowMenu = true;
  },
  drawOutline: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = dn.borderColor;
    ctx.strokeRect(dn.x - 5, dn.y - 8, dn.width + 10, dn.height + 16);
    ctx.restore();
  },
  drop: function () {
    let dn = this;
    dn.grabing = false;
    dn.x = dn.dragDNode.x;
    dn.y = dn.dragDNode.y;
    dn.moveConnects();
    dn.cmbutton && dn.cmbutton.follow(dn);
    dn.dragDNode = null;
    dn.cmenu.forEach((item) => {
      item.follow(dn);
    })
  },
  move: function (x, y) {
    let dn = this;
    dn.x = x;
    dn.y = y;
  },
  drag: function () {
    let dn = this;
    dn.grabing = dn;
    dn.dragDNode = { x: dn.x, y: dn.y }
  },
  moveDragDNode: function (x, y) {
    let dn = this;

    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }

    dn.dragDNode.x = x;
    dn.dragDNode.y = y;
  },
  
  drawDragDNode: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.strokeRect(dn.dragDNode.x, dn.dragDNode.y, dn.width, dn.height);
    ctx.restore();
  }
}

const ConnectsMenuItem = function (id, idx) {
  let cm = this;
  cm.r = 15;
  cm.id = id;
  cm.idx = idx;
  cm.width = 30;
  cm.height = 30;
}

ConnectsMenuItem.prototype = {
  init: function (dn) {
    let cm = this;
    cm.ctx = dn.ctx;
    cm.follow(dn);
  },
  draw: function () {
    let cm = this, ctx = cm.ctx, r = cm.r, cx = cm.cx, cy = cm.cy;

    ctx.beginPath();
    ctx.strokeStyle = '#ffbb05';
    ctx.fillStyle = '#fff';
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    cm.drawIconText();
  },
  drawText: function () {
    let cm = this;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = '12px 黑体'
    ctx.fillStyle = '';
    ctx.fillText(cm.text, cm.x + 35, cm.y + cm.height / 2);
    ctx.restore();
  },
  drawIconText: function () {
    let cm = this, ctx = cm.ctx;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '24px iconfont';
    ctx.fillStyle = '#333';
    ctx.fillText(cm.icon, cm.x + cm.width / 2, cm.y + cm.height / 2);
    ctx.restore();
  },
  follow: function (dn) {
    let cm = this, 
    idx = cm.idx,
    cmlen = dn.children.length,
    x, y;

    if (dn.dir === 'vertical') {
      x = dn.x + dn.width / 2;
      y = dn.y + dn.height + 20;
      if (cmlen % 2) {
        // 奇数
        x += [-1, 1][idx % 2] * Math.ceil(idx / 2) * 45 - 15;
      } else {
        // 偶数
        x += [-1, 1][idx % 2] * (Math.ceil((idx + 1) / 2) * 15 + ((1 ^ idx % 2) + Math.floor(idx / 2)) * 30) - [-1, 1][idx % 2] * 15 / 2;
      }
    } else if (dn.dir === 'horizontal') {
      x = dn.x + dn.width + 40;
      y = dn.y + dn.height / 2;
      if (cmlen % 2) {
        // 奇数
        y += [-1, 1][idx % 2] * Math.ceil(idx / 2) * 45 - 15;
      } else {
        // 偶数
        y += [-1, 1][idx % 2] * (Math.ceil((idx + 1) / 2) * 15 + ((1 ^ idx % 2) + Math.floor(idx / 2)) * 30) - [-1, 1][idx % 2] * 15 / 2;
      }
    }

    cm.x = x;
    cm.y = y;
    cm.cx = x + cm.r;
    cm.cy = y + cm.r;
  },
  setText: function (text) {
    this.text = text;
  },
  setIcon: function (icon) {
    this.icon = icon;
  }
}

const ConnectsMenuButton = function () {
  let cmb = this;
  cmb.width = 12;
  cmb.height = 12;
  cmb.r = 6;
}

ConnectsMenuButton.prototype = {
  init: function (dnode) {
    let cmb = this;
    cmb.follow(dnode);
    cmb.status = dnode.children.length > 0 ? 1 : 0;
  },
  draw: function () {
    let cmb = this, ctx = cmb.ctx, r = cmb.r, cx = cmb.cx, cy = cmb.cy;
    ctx.save();
    
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    
    ctx.beginPath();
    ctx.moveTo(cx - (r - 2), cy);
    ctx.lineTo(cx + (r - 2), cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - (r - 2));
    ctx.lineTo(cx, cy + (r - 2));
    ctx.stroke();

    ctx.restore();
  },
  follow: function (dnode) {
    let cmb = this;
    cmb.ctx = dnode.ctx;
    cmb.cx = dnode.x + 120;
    cmb.cy = dnode.y + dnode.height / 2;
    cmb.x = cmb.cx - 6;
    cmb.y = cmb.cy - 6;
  }
}

const ConnectPoint = function (pos) {
  let cp = this;
  cp.width = 24;
  cp.height = 24;
  cp.r = 4;
  cp.outlineR = 12;
  cp.position = pos;
  cp.paths = [];
}

ConnectPoint.prototype = {
  init: function (dn) {
    let cp = this;
    cp.ctx = dn.ctx;
    cp.parentId = dn.id;
    cp.children = dn.children;
    cp.follow(dn);
  },
  follow: function (dn) {
    let cp = this;
    switch (cp.position) {
      case 'top':
        cp.cx = dn.x + dn.width / 2;
        cp.cy = dn.y;
        break;
      case 'left':
        cp.cx = dn.x;
        cp.cy = dn.y + dn.height / 2;
        break;
      case 'bottom':
        cp.cx = dn.x + dn.width / 2;
        cp.cy = dn.y + dn.height;
        break;
      case 'right':
        cp.cx = dn.x + dn.width;
        cp.cy = dn.y + dn.height / 2;
        break
      default:
        break;
    }
    cp.x = cp.cx - cp.width / 2;
    cp.y = cp.cy - cp.height / 2;
  },
  setPosition: function (pos) {
    this.position = pos;
  },
  drawOutline: function () {
    let cp = this, ctx = cp.ctx;
    ctx.save();
    ctx.strokeStyle = '#c5e3ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.fillStyle = '#c5e3ff';
    ctx.arc(cp.cx, cp.cy, cp.outlineR, 0, Math.PI * 2);
    // ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  draw: function () {
    let cp = this, ctx = cp.ctx;
    ctx.save();
    ctx.strokeStyle = '#007fb1';
    ctx.lineWidth = 1;

    ctx.beginPath();
    cp.hasConnect ? ctx.fillStyle = '#007fb1' : ctx.fillStyle = '#FFFFFF';
    ctx.arc(cp.cx, cp.cy, cp.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
  disConnect: function () {
    this.hasConnect = false;
  }
}

const Path = function (start, dir) {
  let p = this;
  p.start = start;
  p.ctx = start.ctx;
  p.dir = dir;
}

Path.prototype = {
  closePath: function (end) {
    let p = this;
    p.end = end;
  },
  move: function (x, y) {
    let p = this;
    p.createPoints({x: p.start.cx, y: p.start.cy}, {x: x, y: y});
  },
  connectPoints: function () {
    let p = this, 
    start = {x: p.start.cx, y: p.start.cy}, 
    end = {x: p.end.cx, y: p.end.cy};

    p.start.hasConnect = true;
    p.end.hasConnect = true;

    p.createPoints(start, end);
  },
  createPoints: function (start, end) {
    let p = this;
    p.points = [{x: start.x, y: start.y}];

    if (p.dir === 'vertical' || p.dir === 'horizontal') {
      if (end.y < start.y) {
        p.points.push({ x: (end.x - start.x) / 2 + start.x, y: start.y })
        p.points.push({ x: (end.x - start.x) / 2 + start.x, y: end.y })
      } else if (Math.abs(end.x - start.x) > 0) {
        p.points.push({ x: end.x, y: start.y});
      }
    }

    p.points.push({x: end.x, y: end.y});
  },
  draw: function () {
    let p = this, ctx = p.ctx;
    ctx.beginPath();
    ctx.strokeStyle = '#a0d1e1';
    p.points.forEach((pt, idx) => {
      idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
    })
    ctx.stroke();
  }
}

const KGEvent = function () {
  let kgraph = this;

  let trigger = function (evt) {
    let args = Array.from(arguments).slice(1);
    events[evt].apply(events, args);
    evt === 'undo' || evt === 'redo' ? kgraph.diagram.draw('restore') : kgraph.diagram.draw();
  }

  let sum = function (n1, n2) {
    return (n1 * 10 + n2 * 10) / 10;
  }

  let minus = function (n1, n2) {
    return (n1 * 10 - n2 * 10) / 10;
  }

  let scalechanged = function () {
    kgraph.diagram.scalechanged();
    kgraph.footer.scalechanged(kgraph.graph.scale);
  }

  let events = {
    insert: function (dnode, type, cb, opt) {
      let dg = kgraph.diagram;
      // 添加dnode进入diagram
      if (type === 'click') dg.checkInsertAvailable(dnode);
      if (type === 'drag') {
        if (dg.gridAlign) {
          let dnodex = dnode.x - dg.coordx,
          dnodey =  dnode.y - dg.coordy;
          
          dnode.x = dnodex < 0 ? 0 : dnodex - dnodex % dg.gridWidth;
          dnode.y = dnodey < 0 ? 0 : dnodey - dnodey % dg.gridWidth;
        }
      }
      let newDNode = new DNode(dnode, dg.ctx);

      if (type === 'copy') {
        newDNode.reset();
        kgraph.graph.cloneDNode = newDNode;
        newDNode.move(kgraph.graph.cloneDNode.x + dg.gridWidth, kgraph.graph.cloneDNode.y + dg.gridWidth);
      }

      if (type === 'cmitem') {
        newDNode.x = opt.x;
        newDNode.y = opt.y;
      }
      
      dg.initDNode(newDNode);
      dg.dnodes ? dg.dnodes.push(newDNode) : dg.dnodes = [newDNode];
      dg.checkDiagramSize(newDNode);
      dg.saveState('insert');
      cb && cb(newDNode);
    },
    copy: function (dnode) {
      kgraph.graph.cloneDNode = kgraph.graph.selectedDNode;
    },
    paste: function () {
      let evt = this;
      if (!kgraph.graph.cloneDNode) return false;
      evt.insert(kgraph.graph.cloneDNode, 'copy');
    },
    splice: function () {
      let dg = kgraph.diagram, index = null, arrs = null;
      dg.mapDNodes(function (dnode, idx, dnodes) {
        if (dnode === kgraph.graph.selectedDNode) {
          arrs = dnodes;
          index = idx;
        }
      })
      dg.selectDNode(null);
      
      return arrs.splice(index, 1)[0];
    },
    'delete': function (action) {
      let dg = kgraph.diagram, evt = this, dnode = evt.splice();
      
      dnode.connects.forEach((cp) => {
        cp.paths.forEach((idx) => {
          let path = dg.paths[idx];
          if (path) {
            path.start.disConnect();
            path.end.disConnect();
            delete dg.paths[idx];
          }
        })
      })

      dg.delDNodeEvt(dnode);
    },
    tofront: function () {
      let dg = kgraph.diagram, evt = this, dnode = evt.splice();
      dg.dnodes.push(dnode);
      dg.kevent.moveEvent(dnode, 'push');
      dnode.connects.forEach((cp) => {
        dg.kevent.moveEvent(cp, 'push');
      })
      dg.kevent.moveEvent(dnode.cmbutton, 'push');
    },
    toback: function () {
      let dg = kgraph.diagram, evt = this, dnode = evt.splice();
      dg.dnodes.unshift(dnode);
      dg.kevent.moveEvent(dnode, 'unshift');
      dnode.connects.forEach((cp) => {
        dg.kevent.moveEvent(cp, 'unshift');
      })
      dg.kevent.moveEvent(dnode.cmbutton, 'unshift');
    },
    undo: function () {
      let dg = kgraph.diagram;
      dg.restoreState(kgraph.graph.ghistory.prevState());
    },
    redo: function () {
      let dg = kgraph.diagram;
      dg.restoreState(kgraph.graph.ghistory.nextState());
    },
    zoomin: function () {
      let g = kgraph.graph, dg = kgraph.diagram;
      g.scale = g.scale < 2 ? sum(g.scale, 0.2) : 2;
      scalechanged();
      dg.saveState('scale changed');
    },
    zoomout: function () {
      let g = kgraph.graph, dg = kgraph.diagram;
      g.scale = g.scale > 0.6 ? minus(g.scale, 0.2) : 0.6;
      scalechanged();
      dg.saveState('scale changed');
    },
    fitpage: function () {
      let dg = kgraph.diagram;
      kgraph.graph.scale = 1;
      scalechanged();
      dg.saveState('scale changed');
    },
    fitpagewidth: function () {
      let dg = kgraph.diagram;
      kgraph.graph.scale = parseFloat((dg.caWidth / dg.diagramWidth).toFixed(2));
      scalechanged();
      dg.saveState('scale changed');
    },
    scalechanged: scalechanged,
    editText: function () {
      let dg= kgraph.diagram;
      dg.saveState('edit dnode text');
    },
    changeDir: function (dir) {
      let dg = kgraph.diagram;
      kgraph.graph.direction = dir;
      dg.dnodes.forEach((dnode) => {
        dg.delDNodeEvt(dnode);
        dg.initDNode(dnode);
      })
    }
  }

  kgraph.graph.$trigger = trigger;
}

var KEvent = function () {
  var le = this;
  le.offsetx = 0;
  le.offsety = 0;
  le.scale = 1;
  le.event = {};
}

KEvent.prototype = {
  init: function (ca) {
    var le = this;
    le.ca = ca;
    le.clientRect = ca.getBoundingClientRect();
    le.ca.addEventListener("mousedown", function (e) { if (le.event["mousedown"]) { le.handleEvent(e, "mousedown"); } });
    le.ca.addEventListener("mousemove", function (e) {
      if (le.event["mousemove"]) {
        le.handleEvent(e, "mousemove"); 
      }
      if (le.enterEvt && le.event["mouseleave"]) {
        le.handleLeaveEvent(e);
      }
      if (le.event["mouseenter"]) {
        le.handleEvent(e, "mouseenter");
      }
    });
    le.ca.addEventListener("mouseup", function (e) { if (le.event["mouseup"]) { le.handleEvent(e, "mouseup"); } });
  },
  setOffset: function (x, y) {
    var le = this;
    le.offsetx = x;
    le.offsety = y;
  },
  setScale: function (scale) {
    var le = this;
    le.scale = scale;
  },
  addEvent: function (obj, evt, fn, parent) {
    var le = this, l = obj, e = evt, f = fn;
    var newEvt = {
        self: obj,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        callback: fn,
        parent: parent
    };
    if (le.event[evt]) {
        le.event[evt].push(newEvt);
    } else {
        le.event[evt] = [newEvt];
    }
  },
  clearEvent: function () {
    var le = this;
    le.event = {};
  },
  updateEvent: function (obj, evt) {
    var le = this, l = obj, evts = le.event[evt];
    var i, len = evts.length;
    for (i = len - 1; i > -1; i--) {
        if (evts[i].self === obj) {
          Object.assign(evts[i], {
            self: obj,
            x: l.x,
            y: l.y,
            width: l.width,
            height: l.height
          })
        }
    };
  },
  moveEvent: function (obj, type) {
    let le = this, l = obj;
    for (let evt in le.event) {
      let evts = le.event[evt], i, len = evts.length;
      for (i = len - 1; i > -1; i--) {
          if (evts[i].self === obj) {
            if (type === 'unshift') {
              evts.unshift(evts.splice(i, 1)[0])
            } else {
              evts.push(evts.splice(i, 1)[0])
            }
          }
      };
    }
  },
  delEvent: function (obj, evt) {
    var le = this, evts = le.event[evt];
    var i, len = evts.length;
    for (i = len - 1; i > -1; i--) {
        if (evts[i].self === obj) {
            evts.splice(i, 1);
        }
    };
  },
  handleLeaveEvent: function (e) {
    // 找到并保留即将离开的event对象;
    var le = this, evts = le.event['mouseleave'], i = 0, len = evts.length;
    for (; i < len; i++) {
      if (evts[i]) {
        if (evts[i].self === le.enterEvt.self) {
          evts[i].e = e;
          le.leaveEvt = evts[i];
          break;
        }
      }
    }
  },
  triggerEvent: function (o, evt, e) {
    var le = this, evts = le.event[evt],
    i = 0, len = evts.length;
    for (; i < len; i++) {
      if (evts[i] && evts[i].self === o) {
        evts[i].callback.call(o, e);
      }
    }
  },
  handleEvent: function (e, evt) {
    var le = this, ev, point, evts = le.event[evt],
    i = 0, len = evts.length;
    if (e.changedTouches) {
        ev = e.changedTouches[0];
    } else {
        ev = e;
    }
    var lx, ly, lr, lb, ex = ev.clientX - le.clientRect.x - le.offsetx, ey = ev.clientY - le.clientRect.y - le.offsety;
    var topEvt = null;
    for (; i < len; i++) {
        if (evts[i]) {
            lx = evts[i].x * le.scale, ly = evts[i].y * le.scale;
            lr = lx + evts[i].width * le.scale, lb = ly + evts[i].height * le.scale;
            if (lx < ex && ly < ey && lr > ex && lb > ey) {
                topEvt = evts[i];
                topEvt.e = e;
            }
        }
    }
  
    if (topEvt) {
      if (evt === 'mouseenter') {
        if (le.leaveEvt && topEvt.self !== le.leaveEvt.self && topEvt.parent !== le.leaveEvt.self) {
          // enter对象发生变化;
          le.leaveEvt.callback.call(le.leaveEvt.self, le.leaveEvt.e);
          le.leaveEvt = null;
        }
        
        if (le.enterEvt && topEvt.self === le.enterEvt.self) {
          return false;
        }

        le.enterEvt = topEvt;
      }

      topEvt.callback.call(topEvt.self, topEvt.e);
      if (evt === 'mousedown') {
        le.triggerEvent(topEvt.parent, 'mousedown', topEvt.e);
      }
    } else if (le.leaveEvt) {
      le.leaveEvt.callback.call(le.leaveEvt.self, le.leaveEvt.e);
      le.enterEvt = null;
      le.leaveEvt = null;
    }
  }
}

const KGraphHistory = function (graph) {
  let gh = this;
  gh.graph = graph;
  gh.states = [];
  gh.stateId = -1;
}

KGraphHistory.prototype = {
  getStateId: function () {
    return this.stateId;
  },
  getLength: function () {
    return this.states.length;
  },
  saveState: function (state) {
    let gh = this;
    if (gh.stateId > -1) {
      gh.states = gh.states.slice(0, gh.stateId + 1);
    }
    gh.states.push(state);
    gh.stateId++;
  },
  nextState: function () {
    let gh = this;
    gh.stateId = gh.stateId + 1 < gh.states.length - 1 ? gh.stateId + 1 : gh.states.length - 1;
    return gh.states[gh.stateId];
  },
  prevState: function () {
    let gh = this;
    gh.stateId = gh.stateId - 1 > -1 ? gh.stateId - 1 : 0;
    return gh.states[gh.stateId];
  },
}

const KGraphConfig = {
  diagram: {
    class: {
      container: 'kgraph-diagram-container',
    }
  },
  toolbar: {
    class: {
      container: 'kgraph-toolbar-container',
    },
    tools: [{
      undo: {
        title: '撤销',
        enabled: true,
      },
      redo: {
        title: '重做',
        enabled: true,
      }
    }, {
      copy: {
        title: '复制',
        enabled: true,
        requireDNode: true,
      },
      paste: {
        title: '粘贴',
        enabled: true,
        requireDNode: true,
      },
      delete: {
        title: '删除',
        enabled: true,
        requireDNode: true,
      }
    }, {
      zoomin: {
        title: '放大',
        enabled: true,
      },
      zoomout: {
        title: '缩小',
        enabled: true,
      },
      fitpagewidth: {
        title: '适应画布',
        enabled: true,
      },
      fitpage: {
        title: '实际尺寸',
        enabled: true,
      }
    }, {
      tofront: {
        title: '前置',
        enabled: true,
        requireDNode: true,
      },
      toback: {
        title: '后置',
        enabled: true,
        requireDNode: true,
      }
    }]
  },
  sidebar: {
    class: {
      container: 'kgraph-sidebar-container',
    }
  },
  format: {
    class: {
      container: 'kgraph-format-container',
    }
  }
}