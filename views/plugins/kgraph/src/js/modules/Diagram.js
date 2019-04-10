import kCanvasEvent from '../kcanvasevent';
import { DNode, Path, ConnectPoint, ConnectsMenuButton, ConnectsMenuItem } from '../components';

const Diagram = function (graph, config) {
  let dg = this, ctx,
  container = kutil.newElement({ tag: 'div', props: { className: 'kgraph-diagram-container' } });
  dg.graph = graph;
  config = config || {};

  let caWidth, caHeight, diagramWidth, diagramHeight;
  let scrollSpeed = 20, scrollTop = 0, scrollLeft = 0, scrollVerBarHeight, scrollHorBarWidth, scrollVerEnabled, scrollHorEnabled;
  let dragable, connecting = false, contextmenu = null;
  let currentId = 1, scale = 1, offsetx = 0, offsety = 0, startX, startY, direction, gridWidth, gridLineWidth, gridAlign;
  let dnodes, dnodesMaps, paths, pathsMaps, connects, connectsMaps;
  let tmpPath, selectedDNode = null, cloneDNode = null;
  let kcevent = new kCanvasEvent();
  let refs = graph.refs;

  let scrollEvents = {
    createScrollContainer: function () {
      kutil.newElement({
        tag: 'div',
        ref: 'scrollContainer',
        props: { className: 'scroll-container' },
        children: [{
          tag: 'div',
          props: { className: 'scroll-vertical-container' },
          children: [{
            tag: 'div',
            ref: 'scrollVerBar',
            props: { className: 'scroll-bar' }
          }]
        }, {
          tag: 'div',
          props: { className: 'scroll-horizontal-container' },
          children: [{
            tag: 'div',
            ref: 'scrollHorBar',
            props: { className: 'scroll-bar' }
          }]
        }]
      }, refs)
  
      refs.diagramDragLayer.onWheel((e) => {
        e.preventDefault();
        if (scrollVerEnabled || scrollHorEnabled) {
          scrollVerEnabled && (scrollTop += e.deltaY * scrollSpeed);
          scrollHorEnabled && (scrollLeft += e.deltaX * scrollSpeed);
          scrollEvents.triggerScroll();
        }
      })
  
      refs.scrollVerBar.on('mousedown', (e) => { scrollEvents.mousedown(e, 'vertical') })
      refs.scrollHorBar.on('mousedown', (e) => { scrollEvents.mousedown(e, 'horizontal') })
      refs.scrollContainer.insertBefore(refs.diagramDragLayer)
    },
    triggerScroll: function () {
      if (scrollTop > caHeight - scrollVerBarHeight) {
        scrollTop = caHeight - scrollVerBarHeight;
      } else if (scrollTop < 0) {
        scrollTop = 0;
      }
  
      if (scrollLeft > caWidth - scrollHorBarWidth) {
        scrollLeft = caWidth - scrollHorBarWidth;
      } else if (scrollLeft < 0) {
        scrollLeft = 0;
      }
      refs.scrollVerBar.css({ transform: 'translate(0px, '+ scrollTop +'px)' });
      refs.scrollHorBar.css({ transform: 'translate('+ scrollLeft +'px, 0px)' });
      offsetx = -scrollLeft / caWidth * (diagramWidth * scale);
      offsety = -scrollTop / caHeight * (diagramHeight * scale);
      setOffset(offsetx, offsety);
      draw();
    },
    triggerScrollByOffset: function () {
      scrollTop = -offsety / (diagramHeight * scale) * caHeight;
      scrollLeft = -offsetx / (diagramWidth * scale) * caWidth;
      refs.scrollVerBar.css({ transform: 'translate(0px, '+ scrollTop +'px)' });
      refs.scrollHorBar.css({ transform: 'translate('+ scrollLeft +'px, 0px)' });
      // console.log(scrollTop, scrollLeft);
      setOffset(offsetx, offsety);
    },
    resizeScrollBar: function () {
      if (diagramHeight * scale > caHeight) {
        scrollVerBarHeight = caHeight * caHeight / (diagramHeight * scale);
        refs.scrollVerBar.css({ height: scrollVerBarHeight + 'px' })
        scrollVerEnabled = true;
        refs.scrollVerBar.show();
      } else {
        scrollVerEnabled = false;
        refs.scrollVerBar.hide();
      }

      if (diagramWidth * scale > caWidth) {
        scrollHorBarWidth = caWidth * caWidth / (diagramWidth * scale);
        refs.scrollHorBar.css({ width: scrollHorBarWidth + 'px' })
        scrollHorEnabled = true;
        refs.scrollHorBar.show();
      } else {
        scrollHorEnabled = false;
        refs.scrollHorBar.hide();
      }
    }
  };

  for (let event in scrollEvents) {
    let fn = scrollEvents[event];
    scrollEvents[event] = function () {
      config.scroll && fn();
    }
  }

  kutil.extend(scrollEvents, {
    downPoint: null,
    prevPoint: null,
    direction: 'vertical',
    mousedown: function (e, dir) {
      scrollEvents.direction = dir;
      scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
      document.addEventListener('mousemove', scrollEvents.mousemove);
      document.addEventListener('mouseup', scrollEvents.mouseup);
    },
    mousemove: function (e) {
      if (scrollEvents.direction === 'vertical') {
        scrollTop += e.clientY - scrollEvents.prevPoint.y;
      } else if (scrollEvents.direction === 'horizontal') {
        scrollLeft += e.clientX - scrollEvents.prevPoint.x;
      }
      scrollEvents.triggerScroll();
      scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
    },
    mouseup: function (e) {
      document.removeEventListener('mousemove', scrollEvents.mousemove);
      document.removeEventListener('mouseup', scrollEvents.mouseup);
    },
  })

  let canvasEvents = {
    downPoint: {},
    mousedown: function (e) {
      canvasEvents.downPoint.x = e.clientX - offsetx;
      canvasEvents.downPoint.y = e.clientY - offsety;
      if (!dragable) return false;
      config.dragable && document.addEventListener('mousemove', canvasEvents.mousemove)
      document.addEventListener('mouseup', canvasEvents.mouseup)
    },
    mousemove: function (e) {
      offsetx = e.clientX - canvasEvents.downPoint.x; 
      offsety = e.clientY - canvasEvents.downPoint.y;
      kcevent.setOffset(offsetx, offsety);
      draw();
    },
    mouseup: function (e) {
      selectDNode(null);
      config.dragable &&  document.removeEventListener('mousemove', canvasEvents.mousemove)
      document.removeEventListener('mouseup', canvasEvents.mouseup)
    }
  }

  let init = function () {
    createCanvas();
  };
  let reboot = function () {
    setCtxToComponents();
  }
  let reset = function () {
    // console.log('reset');
    dnodes = [];
    dnodesMaps = {};
    paths = [];
    pathsMaps = {};
    connects = [];
    connectsMaps = {};

    startX = config.startX || 60;
    startY = config.startY || 60;

    direction = config.direction || 'vertical';

    if (config.diagramSize === 'full') {
      diagramWidth = caWidth;
      diagramHeight = caHeight;
    } else {
      diagramWidth = config.diagramWidth || 602;
      diagramHeight = config.diagramHeight || 802;
      offsetx = config.horizontalAlign === 'left' ? 0 : (caWidth - diagramWidth) / 2 < 0 ? 0 : (caWidth - diagramWidth) / 2;
      offsety = config.verticalAlign === 'top' ? 0 : (caHeight - diagramHeight) / 2 < 0 ? 0 : (caHeight - diagramHeight) / 2;
    }
    
    gridWidth = config.gridWidth || 10;
    gridLineWidth = config.gridLineWidth || 2;
    gridAlign = typeof config.gridAlign === 'undefined' ? true: config.gridAlign;
    dragable = true;

    dg.diagramWidth = diagramWidth;

    kcevent.clearEvent();
  };
  let createCanvas = function () {
    kutil.newElement({
      tag: 'div',
      ref: 'main',
      props: { className: 'kgraph-diagram' },
      children: [{
        tag: 'canvas',
        ref: 'canvas',
        props: { id: 'canvas' },
        style: { backgroundColor: '#f8fbfb' }
      }, {
        tag: 'div',
        ref: 'diagramDragLayer',
        props: { className: 'diagram-drag-layer' }
      }]
    }, refs)

    config.header && container.append(config.header);
    scrollEvents.createScrollContainer();
    dg.ctx = ctx = refs.canvas.dom.getContext('2d');
    setCtxToComponents();
    container.append(refs.main);
  };
  let setCtxToComponents = function () {
    Path.prototype.ctx = dg.ctx;
    ConnectPoint.prototype.ctx = dg.ctx;
    ConnectsMenuButton.prototype.ctx = dg.ctx;
    ConnectsMenuItem.prototype.ctx = dg.ctx;
  }
  let createContextMenu = function (e) {
    if (!refs.contextMenu) {
      kutil.newElement({
        tag: 'div',
        ref: 'contextMenu',
        props: { className: 'diagram-context-menu' },
      }, refs)
      
      let menuItems = [{
        action: 'delete',
        text: '删除',
      }]

      menuItems.forEach((item) => {
        let menuItem = kutil.newElement({
          tag: 'div',
          props: { className: 'context-menu-item', textContent: item.text }
        })

        menuItem.on('mousedown', (e) => {
          trigger('delete');
        })
        refs.contextMenu.append(menuItem)
      })

      document.addEventListener('mousedown', () => {
        contextmenu && hideContextMenu();
      })

      refs.diagramDragLayer.append(refs.contextMenu);
    }
    showContextMenu(e);
  };
  let showContextMenu = function (e) {
    contextmenu = refs.contextMenu;
    refs.contextMenu.css({ display: 'block', left: e.pageX - graph.cr.left + 'px', top: e.pageY - graph.cr.top + 'px' })
  };
  let hideContextMenu = function () {
    dragable = true;
    contextmenu = null;
    refs.contextMenu.hide();
  };
  let initCanvas = function () {
    kcevent.init(refs.diagramDragLayer);
    resizeCanvas();
    reset();
    setOffset(offsetx, offsety);
    graph.directionChanged(config.direction);
    refs.diagramDragLayer.on('mousedown', canvasEvents.mousedown)
    draw();
    saveState('init diagram');
  };
  let setOffset = function (x, y) {
    offsetx = x;
    offsety = y;
    kcevent.setOffset(offsetx, offsety);
  }
  let resizeCanvas = function () {
    canvas.width = 0;
    canvas.height = 0;
    
    let cr = refs.diagramDragLayer.dom.getBoundingClientRect();
    diagramWidth = diagramWidth < caWidth ? caWidth : diagramWidth;
    diagramHeight = diagramHeight < caHeight ? caHeight : diagramHeight;
    graph.cr = {
      top: cr.top + kutil.getScrollTop(),
      left: cr.left + kutil.getScrollLeft(),
      width: cr.width,
      height: cr.height
    };
    canvas.width = cr.width;
    canvas.height = cr.height;
    dg.caWidth = caWidth = cr.width;
    caHeight = cr.height;
    scrollEvents.resizeScrollBar();
    kcevent.setClientRect(graph.cr);

    refs.diagramDragLayer.onload = function () {
    }
  };
  let selectDNode = function (dnode) {
    if (selectedDNode && selectedDNode !== dnode) {
      selectedDNode.blur();
      setCMEvt(selectedDNode, 'del');
    }
    selectedDNode = dnode;
    graph.updateFormat();
    graph.updateToolbar();
    draw();
  };
  let findLastDNode = function () {
    let bottomDNode = { x: 0, y: 0 };
    mapDNodes((dnode) => {
      if (direction === 'horizontal') {
        bottomDNode.x = Math.max(bottomDNode.x, dnode.x);
      } else if (direction === 'vertical') {
        bottomDNode.y = Math.max(bottomDNode.y, dnode.y);
      }
    })
    return bottomDNode;
  };
  let updateDNodeEvt = function (dnode) {
    setDNodeEvt(dnode, 'update');
    setConnectsEvt(dnode,'update');
    setCMButtonEvt(dnode, 'update');
    setCMEvt(dnode, 'update');
  };
  let clearCanvasEvent = function () {
    dragable = false;
    document.removeEventListener('mousemove', canvasEvents.mousemove);
    document.removeEventListener('mouseup', canvasEvents.mouseup);
  };
  let delDNodeEvt = function (dnode) {
    setDNodeEvt(dnode, 'del');
    setConnectsEvt(dnode,'del');
    setCMButtonEvt(dnode, 'del');
    setCMEvt(dnode, 'del');
  };
  let setDNodeEvt = function (dnode, type) {
    setEvt(dnode, type);
  };
  let setConnectsEvt = function (dnode, type) {
    getConnects(dnode).forEach((cp) => {
      setEvt(cp, type);
    })
  };
  let setCMButtonEvt = function (dnode, type) {
    if (!dnode.cmbutton) { return false };
    setEvt(dnode.cmbutton, type);
  };
  let setCMEvt = function (dnode, type) {
    dnode.cmenu.forEach((cmitem) => {
      setEvt(cmitem, type);
    })
  };
  let setEvt = function (o, type) {
    let handler = type + 'Event';
    kcevent[handler](o, 'mouseenter');
    kcevent[handler](o, 'mousedown');
    kcevent[handler](o, 'mouseleave');
  };
  let insertDNode = function (key, type, dnode, opt) {
    let d = graph.sbdnodes.maps[key]
    if (!d) {
      console.error('未找到key: ' + key + '对应的节点')
      return null;
    }
    d.prototype.ctx = ctx;
    let newDNode = new d(dnode || {});
    newDNode.key = key;

    switch (type) {
      case 'click':
        let coord = checkInsertAvailable(newDNode);
        newDNode.move(coord.x, coord.y);
        break;
      case 'copy':
        newDNode.reset();
        cloneDNode = newDNode;
        newDNode.id = kutil.guid();
        newDNode.move(cloneDNode.x + gridWidth, cloneDNode.y + gridWidth);
        break;
      case 'drag':
        // console.log(offsetx, offsety)
        let dnodex = opt.x - offsetx,
        dnodey =  opt.y - offsety;
        if (gridAlign) {
          opt.x = dnodex < 0 ? 0 : dnodex - dnodex % gridWidth;
          opt.y = dnodey < 0 ? 0 : dnodey - dnodey % gridWidth;
        }
      case 'cmitem':
        newDNode.move(opt.x, opt.y);
        break;
    }
    // console.log(newDNode.x, newDNode.y)

    dnodes ? dnodes.push(newDNode) : dnodes = [newDNode];
    dnodesMaps[newDNode.id] = newDNode;
    checkDiagramSize(newDNode);
    if (type !== 'restore' && !checkInView({ t: newDNode.y, l: newDNode.x, b: newDNode.y + newDNode.height, r: newDNode.x + newDNode.width  })) {
      offsety = caHeight - newDNode.y - newDNode.height - 10 > 0 ? 0 : caHeight - newDNode.y - newDNode.height - 10;
      offsetx = caWidth - newDNode.x - newDNode.width - 10 > 0 ? 0 : caWidth - newDNode.x - newDNode.width - 10;
      scrollEvents.triggerScrollByOffset();
    }
    initDNode(newDNode);
    config.afterInsertDNode && config.afterInsertDNode(newDNode, currentId, type);
    currentId++;
    return newDNode;
  }
  let createConnect = function (props, position) {
    if (position) props.position = position;
    let cp = new ConnectPoint(props);
    cp.init();
    initConnect(cp);
    connects.push(cp);
    connectsMaps[cp.id] = cp;
  };
  let createConnects = function (dnode) {
    let dn = dnode, 
    props = {
      parentNode: dnode
    };
    if (direction === 'vertical') {
      dn.top && createConnect(props, 'top');
      dn.bottom && createConnect(props, 'bottom');
    } else if (direction === 'horizontal') {
      dn.left && createConnect(props, 'left');
      dn.right && createConnect(props, 'right');
    }
  };
  let changeConnectsDir = function () {
    connects.forEach((cp) => {
      if (direction === 'vertical') {
        if (cp.position === 'left') {
          cp.setPosition('top');
        } else if (cp.position === 'right') {
          cp.setPosition('bottom');
        }
      } else if (direction === 'horizontal') {
        if (cp.position === 'top') {
          cp.setPosition('left');
        } else if (cp.position === 'bottom') {
          cp.setPosition('right');
        }
      }
    })
  };
  let getConnects = function (dnode) {
    return connects.filter(cp => cp.parentNode === dnode);
  };
  let createPath = function (props) {
    let path = new Path(props);
    paths.push(path);
    pathsMaps[path.id] = path;
    if (path.start.parentNode.connectRule !== 'multiple') {
      path.start.parentNode.hideCMButton();
      setCMButtonEvt(path.start.parentNode, 'del');
    }
    config.afterCreatePath && config.afterCreatePath(path);
  }
  let getPaths = function (dnode) {
    return paths.filter(p => p.start.parentNode === dnode || p.end.parentNode === dnode);
  };
  let getPathsByCP = function (cp) {
    return paths.filter(p => p.start === cp || p.end === cp);
  }
  let initDNode = function (dnode) {
    let downPoint = {},
    prevCoord = {},
    draging = false;
    dnode.init(direction)
    
    if (dnode.nextSiblings) {
      dnode.cmbutton = new ConnectsMenuButton()
      dnode.cmbutton.init(dnode);
    }

    // console.log(graph.sbdnodes);
    
    if (dnode.cmenu.length) {
      dnode.cmenu.forEach((cmitem) => {
        cmitem.follow(dnode, 'dnode init');
      })
    } else {
      if (dnode.nextSiblings && dnode.nextSiblings.length) {
        dnode.nextSiblings.forEach((key) => {
          let sbdnode = graph.sbdnodes.maps[key];
          if (sbdnode) {
            let cmitem = new ConnectsMenuItem(key, dnode.cmenu.length);
            cmitem.setText(sbdnode.prototype.text);
            cmitem.setIcon(sbdnode.prototype.icon);
            dnode.cmenu.push(cmitem);
          } else {
            // console.error('找不到对应dnode', key);
          }
        });
        dnode.cmenu.forEach(cmitem => {
          cmitem.follow(dnode, 'dnode init');
        })
      }
    }

    // console.log('initDNode', dnode)
    setCMenuOffset(dnode);
    
    let select = function (e) {
      downPoint.x = e.clientX;
      downPoint.y = e.clientY;
      prevCoord.x = dnode.x;
      prevCoord.y = dnode.y;

      document.addEventListener('mousemove', drag)
      document.addEventListener('mouseup', drop)
    }
    let drag = function (e) {
      if (Math.abs(downPoint.x - e.clientX) < 5  && Math.abs(downPoint.y - e.clientY) < 5) {
        return false;
      }
      draging = true;
      dnode.drag();

      let movex = e.clientX - downPoint.x;
      let movey = e.clientY - downPoint.y;
      
      if (gridAlign) {
        movex = movex - movex % gridWidth;
        movey = movey - movey % gridWidth;
      }
      dnode.moveDragDNode(prevCoord.x + calcScale(movex), prevCoord.y + calcScale(movey));
      draw();
    }
    let drop = function (e) {
      dragable = true;
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
      if (!draging) {
        selectDNode(dnode);
        dnode.focus();
      } else {
        draging = false;
        dnode.drop();
        setCMenuOffset(dnode);
        getConnects(dnode).forEach((cp) => {
          cp.follow();
        })
        checkDiagramSize(dnode);
        updateDNodeEvt(dnode);
        draw();
        saveState('drop dnode');
      }
    }
    kcevent.addEvent(dnode, 'mouseenter', () => {
      refs.diagramDragLayer.addClass('move');
      dnode.enter();
      draw();
    }, { cancelBubble: true })
    kcevent.addEvent(dnode, 'mousedown', (e) => {
      clearCanvasEvent();
      if (e.which === 1) {
        select(e)
      } else if (e.which === 3 && config.contextMenu) {
        selectDNode(dnode);
        dnode.focus();
        createContextMenu(e);
        e.stopPropagation();
        e.cancelBubble = true;
      }
    }, { cancelBubble: true })
    kcevent.addEvent(dnode, 'mouseleave', () => {
      refs.diagramDragLayer.removeClass('move');
      dnode.leave();
      draw();
    })

    for (let evtName in dnode.evts) {
      let evt = dnode.evts[evtName];
      kutil.extend(evt.options || {}, { cancelBubble: true });
      kcevent.addEvent(dnode, evtName, (e) => {
        evt.cb(e, dnode);
      }, evt.options)
    }
    dnode.cmbutton && initCMButton(dnode);
  };
  let initConnect = function (cp) {
    let downPoint = {};

    let begin = function (e) {
      let path = {
        dir: direction
      }
      cp.type === 'start' ? path.end = cp : path.start = cp;
      tmpPath = new Path(path);
      connecting = true;
      downPoint.x = e.pageX;
      downPoint.y = e.pageY;
      clearCanvasEvent();
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', close);
    }

    let move = function (e) {
      tmpPath.move(calcScale(e.pageX - graph.cr.left - offsetx), calcScale(e.pageY - graph.cr.top - offsety));
      draw();
    }

    let close = function (e) {
      if (Math.abs(downPoint.x - e.pageX) > 5  || Math.abs(downPoint.y - e.pageY) > 5) {
        let connectPoint = checkConnect({ x: calcScale(e.pageX - graph.cr.left - offsetx), y: calcScale(e.pageY - graph.cr.top - offsety) });
        if (connectPoint) {
          let message = verifyConnection(cp, connectPoint);
          if (message) {
            graph.message({
              type: 'error',
              message: message,
            })
          } else {
            tmpPath.closePath(connectPoint);
            createPath(tmpPath);
            cp.connect();
            connectPoint.connect();
            saveState('add path');
          }
        }
      }
      dragable = true;
      connecting = false;
      tmpPath = null;
      draw();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', close);
    }
    
    kcevent.addEvent(cp, 'mouseenter', () => {
      refs.diagramDragLayer.addClass('auto');
    })
    kcevent.addEvent(cp, 'mousedown', begin, { cancelBubble: true })
    kcevent.addEvent(cp, 'mouseleave', () => {
      refs.diagramDragLayer.removeClass('auto');
    })
  };
  let initCMButton = function (dnode) {
    kcevent.addEvent(dnode.cmbutton, 'mouseenter', () => {
      refs.diagramDragLayer.addClass('pointer');
    })
    kcevent.addEvent(dnode.cmbutton, 'mousedown', () => {
      dnode.showMenu();
      dnode.cmenu.forEach((item) => {
        initConnectsMenuItem(dnode, item);
      })
      draw();
    })
    kcevent.addEvent(dnode.cmbutton, 'mouseleave', () => {
      refs.diagramDragLayer.removeClass('pointer');
    })
  }
  let initConnectsMenuItem = function (dnode, cmitem) {

    kcevent.addEvent(cmitem, 'mouseenter', () => {
      cmitem.enter();
      refs.diagramDragLayer.addClass('pointer');
      draw();
    })
    kcevent.addEvent(cmitem, 'mousedown', () => {
      cmitem.leave();
      graph.$trigger('insert', cmitem.key, 'cmitem', {}, direction === 'vertical' ? { x: dnode.x, y: dnode.y + dnode.height + 60 } : { x: dnode.x + dnode.width + 60, y: dnode.y }, (newDNode) => {
        let startPoint = getConnects(dnode).slice(-1)[0],
        endPoint = getConnects(newDNode)[0];
        let message = verifyConnection(startPoint, endPoint);
        if (message) {
          graph.message({
            type: 'error',
            message: message,
          })
          graph.$trigger('delete', newDNode);
        } else {
          createPath({
            start: startPoint,
            end: endPoint,
            dir: direction,
          })
          startPoint.connect();
          endPoint.connect();
          saveState('add path and dnode');
        }
      });
      refs.diagramDragLayer.removeClass('pointer');
    }, { cancelBubble: true })
    kcevent.addEvent(cmitem, 'mouseleave', () => {
      refs.diagramDragLayer.removeClass('pointer');
      cmitem.leave();
      draw();
    })
  };
  let setCMenuOffset = function (dnode) {
    let cmenuRect = getCMenuRect(dnode);
    if (!checkInView(cmenuRect)) {
      moveCMenuItems(dnode, cmenuRect);
    };
  }
  let getCMenuRect = function (dnode) {
    let lastItem = dnode.cmenu.slice(-1)[0] || {};
    let secondLastItem = dnode.cmenu.slice(-2, -1)[0] || lastItem;
    let count = dnode.cmenu.length;
    if (direction === 'horizontal') {
      if (count % 2) {
        return { t: lastItem.y, l: lastItem.x, b: secondLastItem.y + secondLastItem.height, r: lastItem.x + lastItem.width}
      } else {
        return { t: secondLastItem.y, l: lastItem.x, b: lastItem.y + lastItem.height, r: lastItem.x + lastItem.width}
      }
    } else if (direction === 'vertical') {
      if (count % 2) {
        return { t: lastItem.y, l: lastItem.x, b: lastItem.y + lastItem.height, r: secondLastItem.x + secondLastItem.width }
      } else {
        return { t: lastItem.y, l: secondLastItem.x, b: lastItem.y + lastItem.height, r: lastItem.x + lastItem.width }
      }
    }
  };
  let moveCMenuItems = function (dnode, rect) {
    // console.log(rect, offsetx, offsety, caWidth, diagramHeight);
    if (rect.l < -offsetx) {
      dnode.cmenuOffsetX = offsetx - rect.l
    } else if (rect.r > -offsetx + caWidth) {
      dnode.cmenuOffsetX = -offsetx + caWidth - rect.r
    }

    if (diagramHeight < rect.b) {
      diagramHeight = rect.b + 90;
    } else if (rect.t < -offsety) {
      dnode.cmenuOffsetY = -offsety - rect.t;
    } else if (rect.b > -offsety + caHeight) {
      dnode.cmenuOffsetY = -offsety + caHeight - rect.b;
    }

    dnode.cmenu.forEach((cmitem) => {
      cmitem.follow(dnode, 'moveCMenuItems');
    })
  };
  let checkConnect = function (point) {
    let connectPoint = null;
    connects.forEach((cp) => {
      if (cp.x - cp.outlineR < point.x && cp.x + cp.outlineR * 2 > point.x && cp.y - cp.outlineR < point.y && cp.y + cp.outlineR * 2 > point.y) {
        connectPoint = cp;
      }
    })
    return connectPoint;
  };
  let getInherit = function (dnode, type) {
    if (dnode.connectRule === 'inherit') {
      let paths = getPaths(dnode);
      if (paths && paths.length > 0) {
        dnode = paths[0][type === 'start' ? 'end' : 'start'].parentNode;
      }
    }
    return dnode;
  };
  let getPrevSiblingByKey = function (dn, key) {
    let prevSibling = getPrevSibling(dn);
    while (prevSibling && prevSibling.key !== key) {
      prevSibling = getPrevSibling(prevSibling);
    }
    return prevSibling;
  };
  let getPrevSibling = function (dn) {
    let prevSibling = null;
    getConnects(dn).find(cp => {
      if (cp.type === 'start') {
        let paths = getPathsByCP(cp);
        if (paths.length > 0) {
          prevSibling = paths[0].start.parentNode;
        }
      }
    })
    return prevSibling;
  }
  let getNextSibling = function (dn) {
    let nextSibling = null;
    getConnects(dn).forEach(cp => {
      if (cp.type === 'end') {
        let paths = getPathsByCP(cp);
        if (paths.length > 0) {
          nextSibling = paths[0].end.parentNode;
        }
      }
    })
    return nextSibling;
  }
  let verifyConnection = function (cp1, cp2) {
    if (cp1.position === cp2.position) {
      return cp1.type === 'start' ? '需要连接节点开始位置' : '需要连接节点结束位置';
    }
    
    let startPoint, endPoint;
    if (cp1.type === 'end') {
      startPoint = cp1;
      endPoint = cp2;
    } else if (cp1.type === 'start') {
      startPoint = cp2;
      endPoint = cp1;
    }

    let startDNode = getInherit(startPoint.parentNode, startPoint.type),
    endDNode = getInherit(endPoint.parentNode, endPoint.type);
    
    let msg = config.verifyConnection && config.verifyConnection(startPoint, endPoint);
    if (msg) return msg;

    let siblings = startDNode.nextSiblings;
    if (siblings && !~siblings.indexOf(endDNode.key)) {
      return startDNode.text + '节点只能连接' + siblings.map((key) => {
        return graph.sbdnodes.maps[key] && graph.sbdnodes.maps[key].prototype.text;
      }).join(',') + '节点';
    } else {
      return (startDNode.verifyConnection && startDNode.verifyConnection(startDNode, startDNode, endDNode)) || (endDNode.verifyConnection && endDNode.verifyConnection(endDNode, startDNode, endDNode));
    }
  };
  let checkDiagramSize = function (dnode) {
    if (dnode.x > diagramWidth - dnode.width - 100) {
      dg.diagramWidth = diagramWidth = dnode.x + dnode.width + 100;
    }
    if (dnode.y > diagramHeight - 100) {
      diagramHeight = dnode.y + dnode.height + 100;
    }
    scrollEvents.resizeScrollBar();
  };
  let checkInView = function (rect) {
    return !(rect.t < -offsety || rect.l < -offsetx || rect.b + offsety > caHeight || rect.r + offsetx > caWidth)
  };
  let checkInsertAvailable = function (dnode) {
    let x = startX, y = startY;
    if (config.dragable || config.scroll) {
      let lastDNode = findLastDNode();
      if (lastDNode.y > 0) {
        y = lastDNode.y + dnode.height + 20;
      } else if (lastDNode.x > 0) {
        x = lastDNode.x + dnode.width + 20;
      }
    }
    if (dnodes.length === 0) {
      if (direction === 'horizontal') {
        y = caHeight / 2 - 20;
      } else if (direction === 'vertical') {
        x = caWidth / 2 - 80;
      }
    }
    return {x, y};
  };
  let mapDNodes = function (cb) {
    let i = 0, len = dnodes.length;
    for (; i < len; i++) {
      cb(dnodes[i], i, dnodes);
    }
  };
  let restoreState = function (s, from) {
    if (!s) return false;
    reset();

    let state = JSON.parse(s);
    // console.log(state);

    scale = state.scale;
    graph.scaleChanged(scale);

    direction = state.direction;
    graph.directionChanged(direction);
    
    // console.log(direction);

    state.dnodes.map((dn) => insertDNode(dn.key, 'restore', dn));
    
    state.connects.map((cp) => {
      cp.parentNode = dnodesMaps[cp.parentNode] || {};
      return createConnect(cp);
    });

    state.paths.map((p) => {
      p.start = connectsMaps[p.start] || {};
      p.end = connectsMaps[p.end] || {};
      return createPath(p);
    });

    diagramWidth = state.diagramWidth;
    diagramHeight = state.diagramHeight;
    // offsetx = state.offsetx;
    // offsety = state.offsety;

    if (state.diagramWidth < caWidth) {
      if (config.diagramSize === 'full') diagramWidth = caWidth;
      // offsetx = 0;
    } else if (-offsetx + caWidth > diagramWidth) {
      // offsetx = caWidth - diagramWidth;
    }
    
    if (state.diagramHeight < caHeight) {
      if (config.diagramSize === 'full')  diagramHeight = caHeight;
      // offsety = 0;
    } else if (-offsety + caHeight > diagramHeight) {
      // offsety= caHeight - diagramHeight;
    }

    gridWidth = state.gridWidth;
    gridLineWidth = state.gridLineWidth;
    gridAlign = state.gridAlign;
    currentId = state.currentId;
    scrollEvents.triggerScrollByOffset();
    selectDNode(null);
  };
  let saveState = function (from) {
    let state = JSON.stringify({
      dnodes: dnodes.map((dn) => {
        let _dn = kutil.clone(dn);
        delete _dn.cmbutton;
        delete _dn.cmenu;
        return _dn
      }),
      connects: connects.map((cp) => {
        let _cp = kutil.clone(cp);
        _cp.parentNode = _cp.parentNode.id;
        return _cp;
      }),
      paths: paths.map((p) => {
        let _p = kutil.clone(p);
        _p.start = _p.start.id;
        _p.end = _p.end.id;
        delete _p.points;
        return _p;
      }),
      diagramWidth: diagramWidth,
      diagramHeight: diagramHeight,
      // offsetx: 0,
      // offsety: 0,
      gridWidth: gridWidth,
      gridAlign: gridAlign,
      scale: scale,
      direction: direction,
      currentId: currentId,
    });
    graph.$ghistory.saveState(state);
    graph.updateToolbar();
  };
  let clearState = function () {
    reset();
    scrollEvents.resizeScrollBar();
    draw();
  }
  let clear = function () {
    ctx.clearRect(0, 0, caWidth, caHeight);
  };
  let draw = function (type) {
    requestAnimationFrame(() => {
      clear();
      ctx.save();
      ctx.translate(offsetx, offsety);
      ctx.scale(scale, scale);
      drawBackground();
      drawDNodes();
      drawPaths();
      drawConnectsMenu();
      ctx.restore();
    })
  };
  let drawBackground = function () {
    let gridX = 0, gridY = 0;
    ctx.beginPath();
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth = gridLineWidth;
    while (gridY < diagramHeight) {
      ctx.moveTo(0, gridY);
      ctx.lineTo(diagramWidth, gridY);
      gridY += gridWidth;
    }
    while (gridX < diagramWidth) {
      ctx.moveTo(gridX, 0);
      ctx.lineTo(gridX, diagramHeight);
      gridX += gridWidth;
    }
    ctx.stroke();
  };
  let drawDNodes = function () {
    mapDNodes((dnode) => {
      dnode.draw();
      drawConnects(dnode);
    })
  };
  let drawConnects = function (dnode) {
    getConnects(dnode).forEach((cp) => {
      connecting && cp.drawOutline();
      cp.draw();
    })
  };
  let drawConnectsMenu = function () {
    mapDNodes((dn) => {
      if (dn.isShowMenu) {
        dn.cmenu.forEach((cm) => {
          cm.draw();
        })
        dn.cmenu.forEach((cm) => {
          cm.entering && cm.drawTitle();
        })
      }
    })
  };
  let drawPaths = function () {
    tmpPath && tmpPath.draw();
    paths.forEach((p) => {
      p.connectPoints();
      p.draw();
    })
  };
  let calcScale = function (n) {
    return n / scale;
  };
  let scaleChanged = function () {
    let newOffsetx = caWidth - diagramWidth * scale,
    newOffsety = caHeight - diagramHeight * scale;

    offsetx = newOffsetx > 0 ? newOffsetx / 2 : 0;
    offsety = newOffsety > 0 ? newOffsety / 2 : 0;

    kcevent.setOffset(offsetx, offsety);
    kcevent.setScale(scale);

    scrollEvents.resizeScrollBar();
  };
  let directionChanged = function (dir) {
    changeConnectsDir();
    dnodes.forEach((dnode) => {
      dnode.dir = dir;
      dnode.cmenuOffsetX = 0;
      dnode.cmenuOffsetY = 0;
      dnode.cmenu.forEach((cmitem) => {
        cmitem.follow(dnode, 'directionChanged');
      });
      setCMenuOffset(dnode);
      updateDNodeEvt(dnode);
    });
    paths.forEach((p) => {
      p.dir = dir
    })
  };
  let trigger = function (evt) {
    let args = Array.from(arguments).slice(1);
    events[evt].apply(events, args);
    evt === 'undo' || evt === 'redo' ? draw('restore') : draw();
  };
  let events = {
    insert: function (key, type, dnode, opt, cb) {
      let valid = config.beforeInsertDNode ? config.beforeInsertDNode(key, type, dnode) : true;
      if (valid) {
        let newDNode = insertDNode(key, type, dnode, opt);
        createConnects(newDNode);
        saveState('insert');
        cb && kutil.isFunction(cb) && cb(newDNode);
      }
    },
    copy: function () {
      cloneDNode = selectedDNode;
    },
    paste: function () {
      let evt = this;
      if (!cloneDNode) return false;
      evt.insert(cloneDNode.key, 'copy', cloneDNode);
      saveState('paste');
    },
    splice: function () {
      let index = null, arrs = null;
      mapDNodes((dnode, idx, dnodes) => {
        if (dnode === selectedDNode) {
          arrs = dnodes;
          index = idx;
        }
      })
      selectDNode(null);
      
      return arrs.splice(index, 1)[0];
    },
    'delete': function (dn) {
      let dnode = dn || selectedDNode;
      selectDNode(null);
      delDNodeEvt(dnode);

      dnodes.splice(dnodes.indexOf(dnode), 1);
      delete dnodesMaps[dnode.id];

      getPaths(dnode).forEach((p) => {
        p.start.parentNode.showCMButton();
        p.start.parentNode.cmbutton && initCMButton(p.start.parentNode);
        paths.splice(paths.indexOf(p), 1);
        if (getPathsByCP(p.start).length === 0) {
          p.start.disConnect();
        }
        if (getPathsByCP(p.end).length === 0) {
          p.end.disConnect();
        }
      })

      getConnects(dnode).forEach((cp) => {
        connects.splice(connects.indexOf(cp), 1);
        delete connectsMaps[cp.id];
      })
      saveState('delete dnode');
    },
    tofront: function () {
      let evt = this, dnode = evt.splice();
      dnodes.push(dnode);
      kcevent.moveEvent(dnode, 'push');
      getConnects(dnode).forEach((cp) => {
        kcevent.moveEvent(cp, 'push');
      })
      dnode.cmbutton && kcevent.moveEvent(dnode.cmbutton, 'push');
      saveState('dnode to front');
    },
    toback: function () {
      let evt = this, dnode = evt.splice();
      dnodes.unshift(dnode);
      kcevent.moveEvent(dnode, 'unshift');
      getConnects(dnode).forEach((cp) => {
        kcevent.moveEvent(cp, 'unshift');
      })
      dnode.cmbutton && kcevent.moveEvent(dnode.cmbutton, 'unshift');
      saveState('dnode to back');
    },
    undo: function () {
      restoreState(graph.$ghistory.prevState());
    },
    redo: function () {
      restoreState(graph.$ghistory.nextState());
    },
    zoomin: function () {
      scale = scale < 2 ? kutil.sum(scale, 0.2) : 2;
      graph.scaleChanged(scale);
      saveState('scale changed');
    },
    zoomout: function () {
      scale = scale > 0.6 ? kutil.minus(scale, 0.2) : 0.6;
      graph.scaleChanged(scale);
      saveState('scale changed');
    },
    fitpage: function () {
      scale = 1;
      graph.scaleChanged(scale);
      saveState('scale changed');
    },
    fitpagewidth: function () {
      scale = parseFloat((caWidth / diagramWidth).toFixed(2));
      graph.scaleChanged(scale);
      saveState('scale changed');
    },
    editText: function () {
      saveState('edit dnode text');
    },
    changeDir: function (dir) {
      direction = dir;
      graph.directionChanged(dir);
      saveState('direction changed');
    }
  };
  let getPathsMaps = function () {
    return pathsMaps;
  };
  let getAllDNodes = function () {
    return dnodes;
  };
  let getAllConnects = function () {
    return connects;
  };
  let getAllPaths = function () {
    return paths;
  };
  kutil.extend(graph, {
    $trigger: trigger,
    getSelectedDNode () {
      return selectedDNode;
    }
  })
  kutil.extend(dg, {
    reset,
    reboot,
    refs,
    draw,
    container,
    initCanvas,
    resizeCanvas,
    scaleChanged,
    directionChanged,
    saveState,
    restoreState,
    clearState,
    getPathsMaps,
    getAllDNodes,
    getConnects,
    getAllConnects,
    getAllPaths,
    getPrevSibling,
    getPrevSiblingByKey,
    getNextSibling
  })
  init();
  return dg;
}

export default Diagram;