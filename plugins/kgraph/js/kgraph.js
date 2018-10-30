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
    kg.createFormat();
    kg.container.appendChild(kg.fragment);

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
        kg.format.switchFormat();
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
    kg.fragment.appendChild(kg.sidebar.container);
  },
  createFormat: function () {
    let kg = this;
    kg.format = new Format();
    kg.format.init();
    kg.format.graph = kg.graph;
    kg.fragment.appendChild(kg.format.container);
  }
}

const Diagram = function (container) {
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
  
    g.dnodes = []; // 节点集合
    g.paths = []; // 连接路线
  
    g.diagramWidth = 600; // diagram的宽度
    g.diagramHeight = 800; // diagram的高度
  
    g.coordx = 0; // 坐标系原点横坐标
    g.coordy = 0; // 坐标系原点纵坐标
  
    g.gridWidth = 10; // 栅格的间距
    g.gridLineWidth = 2; // 栅格线粗细
  
    g.gridAlign = true; // 网格对齐;

    g.dragable = true;
  },
  createCanvas: function () {
    let main = document.createElement('div');
    main.style.position = 'relative';
    main.className = 'kgraph-diagram';
    main.style.width = '100%';
    main.style.height = '100%';

    let canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.style.backgroundColor = '#f8fbfb';
    this.canvas = canvas;

    let diagramDragLayer = document.createElement('div');
    diagramDragLayer.className = 'diagram-drag-layer'
    this.diagramDragLayer = diagramDragLayer;

    main.appendChild(canvas);
    main.appendChild(diagramDragLayer);
    this.container.appendChild(main);
  },
  initCanvas: function () {
    let g = this;
    g.ctx = g.canvas.getContext('2d');
    let clientRect = g.container.getBoundingClientRect()
    g.graph.clientRect = clientRect;
    g.clientRect = clientRect;
    g.canvas.width = clientRect.width;
    g.canvas.height = clientRect.height;
    g.caWidth = clientRect.width;
    g.caHeight = clientRect.height;

    g.kevent = new KEvent();
    g.kevent.init(g.diagramDragLayer);

    let downPoint = {};

    let downCanvas = function (e) {
      downPoint.x = e.clientX - g.coordx;
      downPoint.y = e.clientY - g.coordy;
      if (!g.dragable) return false;
      document.addEventListener('mousemove', g.dragCanvas)
      document.addEventListener('mouseup', g.dropCanvas)
    }

    g.dragCanvas = function (e) {
      window.requestAnimationFrame(() => {
        g.coordx = e.clientX - downPoint.x; 
        g.coordy = e.clientY - downPoint.y;
        g.kevent.setOffset(g.coordx, g.coordy)
        g.draw();
      })
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
    if (g.graph.selectedDNode) {
      g.graph.selectedDNode.blur();
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
        bottomDNode.x = Math.max(bottomDNode.x, dnodes[idx].x);
        bottomDNode.y = g.graph.startY;
      } else if (g.graph.direction === 'vertical') {
        bottomDNode.y = Math.max(bottomDNode.y, dnodes[idx].y);
        bottomDNode.x = g.graph.startX;
      }
    })
    return bottomDNode;
  },
  checkInsertAvailable: function (dnode) {
    let g = this, lastDNode = g.findLastDNode();
    if (lastDNode.y > 0) {
      dnode.y = lastDNode.y + dnode.height + 20;
      dnode.x = lastDNode.x;
    } else if (lastDNode.x > 0) {
      dnode.x = lastDNode.x + dnode.width + 20;
      dnode.y = lastDNode.y;
    } else {
      dnode.x = g.graph.startX;
      dnode.y = g.graph.startY;
    }
  },
  clearCanvasEvent: function () {
    this.dragable = false;
    document.removeEventListener('mousemove', this.dragCanvas);
    document.removeEventListener('mouseup', this.dropCanvas);
  },
  updateDNodeEvt: function (dnode) {
    let g = this;
    g.kevent.updateEvent(dnode, 'mouseenter');
    g.kevent.updateEvent(dnode, 'mousedown');
    g.kevent.updateEvent(dnode, 'mouseleave');
    
    dnode.connects.forEach((cp) => {
      g.kevent.updateEvent(cp, 'mouseenter');
      g.kevent.updateEvent(cp, 'mousedown');
      g.kevent.updateEvent(cp, 'mouseleave');
    })
  },
  delDNodeEvt: function (dnode) {
    let g = this;
    g.kevent.delEvent(dnode, 'mouseenter');
    g.kevent.delEvent(dnode, 'mousedown');
    g.kevent.delEvent(dnode, 'mouseleave');

    dnode.connects.forEach((cp) => {
      g.kevent.delEvent(cp, 'mouseenter');
      g.kevent.delEvent(cp, 'mousedown');
      g.kevent.delEvent(cp, 'mouseleave');
    })
  },
  initDNode: function (dnode) {
    // 初始化dnode, 包括给dnode绑定操作事件;
    let g = this,
    downPoint = {}, // 鼠标落点
    prevCoord = {}; // 开始移动前的坐标
    dnode.init(g.graph.direction);
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
      g.draw();
    })
    g.kevent.addEvent(dnode, 'mousedown', select)
    g.kevent.addEvent(dnode, 'mouseleave', () => {
      g.diagramDragLayer.style.cursor = '-webkit-grab';
      dnode.leave();
      g.draw();
    })

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
        g.tmpPath.move(e.pageX - g.clientRect.x - g.coordx, e.pageY - g.clientRect.y - g.coordy);
        g.draw();
      }

      let close = function (e) {
        g.dragable = true;
        g.connecting = false;
        let connectPoint = g.checkConnect({ x: e.pageX - g.clientRect.x - g.coordx, y: e.pageY - g.clientRect.y - g.coordy });
        if (connectPoint) {
          g.tmpPath.setEnd(connectPoint);
          g.paths.push(g.tmpPath);
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
  checkOverlay: function (dnode) {
    let result = false;
    this.mapDNodes(function (thisDNode) {
      if ((dnode.x < thisDNode.x && dnode.r > thisDNode.x) || (dnode.x < thisDNode.r && dnode.r > thisDNode.r)) {
        if ((dnode.y < thisDNode.y && dnode.b > thisDNode.y) || (dnode.y < thisDNode.b && dnode.b > thisDNode.b)) {
          result = thisDNode;
        }
      }
    })
    return result;
  },
  restoreState: function (state) {
    let g = this;
    g.kevent.clearEvent();
    Object.assign(g, JSON.parse(state));
    g.dnodes = g.dnodes.map((dnode) => {
      let newDNode = new DNode(dnode, g.ctx);
      g.initDNode(newDNode);
      return newDNode;
    });
    g.selectDNode(null);
  },
  saveState: function (from) {
    let g = this;
    let state = JSON.stringify({
      dnodes: g.dnodes,
      diagramWidth: g.diagramWidth,
      diagramHeight: g.diagramHeight,
      coordx: g.coordx,
      coordy: g.coordy,
      gridWidth: g.gridWidth,
      gridAlign: g.gridAlign
    });
    g.graph.ghistory.saveState(state);
    
    g.graph.updateToolbar();
  },
  draw: function (type) {
    let g = this;
    g.kevent.setScale(g.graph.scale);
    g.clear();
    g.ctx.save();
    g.ctx.translate(g.coordx, g.coordy);
    g.ctx.scale(g.graph.scale, g.graph.scale);
    g.drawBackground();
    g.drawDNodes();
    g.drawPaths();
    g.ctx.restore();
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
      dnode.draw(g.connecting);
    })
  },
  drawPaths: function () {
    let g = this;
    g.tmpPath && g.tmpPath.draw();
    g.paths.forEach((p) => {
      p.connectPoints();
      p.points.forEach((point, idx) => {
        g.kevent.addEvent({}, 'mousedown', () => {

        })
        g.kevent.addEvent(point, 'mouseenter', () => {

        })
      })
      p.draw();
    })
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

    for (let toolname in tb.config.tools) {
      let config = tb.config.tools[toolname];
      if (config.enabled) {
        let tool = document.createElement('div');
        tool.title = toolname;
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
      }
    }

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
      ft.graph.$trigger('changeDir', 'horizontal');
      fieldbar.className = 'graph-mode horizontal';
    })
    option2.addEventListener('click', function () {
      ft.graph.$trigger('changeDir', 'vertical');
      fieldbar.className = 'graph-mode vertical';
    })
    ft.canvasFormat.append(fieldbar);
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
  sb.container.addEventListener('mousedown', function (e) {
    e.preventDefault();
  })
  sb.container.addEventListener('mousemove', function (e) {
    e.preventDefault();
  })
  sb.dnodes = [] // 可选项集合
}

Sidebar.prototype = {
  init: function () {
  },
  createSection: function (title, items) {
    let sb = this;
    this.dnodes.push({
      title: title,
      items: items
    })
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
    // sectionItem.innerHTML = item.html;

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
    item.icontext = icontext.textContent;
    item.text = item.text;
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

// digrame node 线图节点
const DNode = function (dnode, ctx) {
  let dn = this;
  dn.borderColor = '#007fb1';
  dn.bgColor = '#fff';
  dn.textColor = '#333';
  dn.iconColor = '#007fb1';
  Object.assign(this, dnode);
  dn.ctx = ctx;
  dn.connects = [];
}

DNode.prototype = {
  init: function (dir) {
    let dn = this, cp1, cp2;
    dn.dir = dir;

    dn.connects.length > 0 ? dn.updateConnects() : dn.createConnects();
  },
  createConnects: function () {
    let dn = this, cp1, cp2, dir = dn.dir;
    if (dir === 'vertical') {
      cp1 = new ConnectPoint(dn.ctx, dn.x + dn.width / 2, dn.y, 'start'),
      cp2 = new ConnectPoint(dn.ctx, dn.x + dn.width / 2, dn.y + dn.height, 'end');
    } else if (dir === 'horizontal') {
      cp1 = new ConnectPoint(dn.ctx, dn.x, dn.y + dn.height / 2, 'start'),
      cp2 = new ConnectPoint(dn.ctx, dn.x + dn.width, dn.y + dn.height / 2, 'end');
    }
    dn.connects = [cp1, cp2];
  },
  updateConnects: function () {
    let dn = this;
    dn.moveConnects();
  },
  moveConnects: function () {
    let dn = this;
    if (dn.dir === 'horizontal') {
      dn.connects[0].move(dn.x, dn.y + dn.height / 2);
      dn.connects[1].move(dn.x + dn.width, dn.y + dn.height / 2);
    } else if (dn.dir === 'vertical') {
      dn.connects[0].move(dn.x + dn.width / 2, dn.y);
      dn.connects[1].move(dn.x + dn.width / 2, dn.y + dn.height);
    }
  },
  reset: function () {
    let dn = this;
    dn.focusing = false;
    dn.entering = false;
    dn.grabing = false;
  },
  draw: function (connecting) {
    let dn = this;
    dn.drawRect(dn.ctx);
    dn.drawText(dn.ctx);
    dn.drawIcon(dn.ctx);
    dn.drawConnectPoint(connecting);
    dn.entering && dn.drawOutline(dn.ctx);
    dn.focusing && dn.drawOutline(dn.ctx);
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
    ctx.fillText(dn.icontext, dn.x + 14, dn.y + dn.height / 2);
    ctx.restore();
  },
  focus: function () {
    this.focusing = true;
  },
  blur: function () {
    this.focusing = false;
  },
  enter: function () {
    this.entering = true;
  },
  leave: function () {
    this.entering = false;
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
    dn.dragDNode = null;
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
  },

  drawConnectPoint: function (connecting) {
    let dn = this;
    dn.connects.forEach((cp) => {
      connecting && cp.drawOutline();
      cp.draw();
    })
  }
}

const ConnectPoint = function (ctx, x, y, type) {
  let cp = this;
  cp.ctx = ctx;
  cp.x = x - 4;
  cp.y = y - 4;
  cp.width = 8;
  cp.height = 8;
  cp.r = 4;
  cp.type = type;
  cp.outlineR = 12;
}

ConnectPoint.prototype = {
  move: function (x, y) {
    let cp = this;
    cp.x = x - 4;
    cp.y = y - 4;
  },
  drawOutline: function () {
    let cp = this, ctx = cp.ctx;
    ctx.save();
    ctx.strokeStyle = '#c5e3ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.fillStyle = '#c5e3ff';
    ctx.arc(cp.x + 4, cp.y + 4, cp.outlineR, 0, Math.PI * 2);
    ctx.closePath();
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
    ctx.arc(cp.x + 4, cp.y + 4, cp.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

const Path = function (start, dir) {
  let p = this;
  p.start = start;
  p.ctx = start.ctx;
  p.dir = dir;
}

Path.prototype = {
  setEnd: function (end) {
    let p = this;
    p.end = end;
  },
  move: function (x, y) {
    let p = this;
    p.createPoints({x: p.start.x + 4, y: p.start.y + 4}, {x: x, y: y});
  },
  connectPoints: function () {
    let p = this, 
    start = {x: p.start.x + 4, y: p.start.y + 4}, 
    end = {x: p.end.x + 4, y: p.end.y + 4};

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

  let events = {
    insert: function (dnode, type) {
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
        console.log(dnode.x, dnode.y);
      }
      let newDNode = new DNode(dnode, dg.ctx);

      if (type === 'copy') {
        newDNode.reset();
        kgraph.graph.cloneDNode = newDNode;
        newDNode.move(kgraph.graph.cloneDNode.x + dg.gridWidth, kgraph.graph.cloneDNode.y + dg.gridWidth);
      }
      
      dg.initDNode(newDNode);
      dg.dnodes ? dg.dnodes.push(newDNode) : dg.dnodes = [newDNode];
      dg.checkDiagramSize(dnode);
      dg.saveState('insert');
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
      dg.delDNodeEvt(dnode);
    },
    tofront: function () {
      let dg = kgraph.diagram, evt = this;
      dg.dnodes.push(evt.splice());
      dg.delDNodeEvt();
      dg.dnodes.forEach(function (dnode) {
        dg.initDNode(dnode);
      })
    },
    toback: function () {
      let dg = kgraph.diagram, evt = this;
      dg.dnodes.unshift(evt.splice());
      dg.delDNodeEvt();
      dg.dnodes.forEach(function (dnode) {
        dg.initDNode(dnode);
      })
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
      let g = kgraph.graph;
      g.scale = g.scale < 2 ? sum(g.scale, 0.2) : 2;
    },
    zoomout: function () {
      let g = kgraph.graph;
      g.scale = g.scale > 0.6 ? minus(g.scale, 0.2) : 0.6;
    },
    fitpage: function () {
      kgraph.graph.scale = 1;
    },
    fitpagewidth: function () {
      let dg = kgraph.diagram;
      kgraph.graph.scale = dg.caWidth / dg.diagramWidth;
      dg.coordx = 0;
      dg.coordy = 0;
    },
    editText: function () {
      let dg= kgraph.diagram;
      dg.saveState('edit dnode text')
    },
    changeDir: function (dir) {
      let dg = kgraph.diagram;
      kgraph.graph.direction = dir;
      dg.dnodes.forEach((dnode) => {
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
  addEvent: function (obj, evt, fn) {
    var le = this, l = obj, e = evt, f = fn;
    var newEvt = {
        self: obj,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        callback: fn
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
        if (le.leaveEvt && topEvt.self !== le.leaveEvt.self) {
          // enter对象发生变化;
          le.leaveEvt.callback.call(le.leaveEvt.self, le.leaveEvt.e);
          le.leaveEvt = null;
        }
        le.enterEvt = topEvt;
      }
      topEvt.callback.call(topEvt.self, topEvt.e);
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
    tools: {
      undo: {
        enabled: true,
      },
      redo: {
        enabled: true,
      },
      copy: {
        enabled: true,
        requireDNode: true,
      },
      paste: {
        enabled: true,
        requireDNode: true,
      },
      delete: {
        enabled: true,
        requireDNode: true,
      },
      zoomin: {
        enabled: true,
      },
      zoomout: {
        enabled: true,
      },
      fitpagewidth: {
        enabled: true,
      },
      fitpage: {
        enabled: true,
      },
      tofront: {
        enabled: true,
        requireDNode: true,
      },
      toback: {
        enabled: true,
        requireDNode: true,
      },
    }
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