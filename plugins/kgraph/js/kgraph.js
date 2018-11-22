const kutil = {
  guid: function () {
    let s = [], hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
  },
  newElement: function (elm, refs) {
    let dom = document.createElement(elm.tag);
    refs = refs || {};
    for (let name in elm.attr) {
      dom.setAttribte(name, elm.attr[name])
    }
    for (let name in elm.props) {
      dom[name] = elm.props[name];
    }
    for (let name in elm.style) {
      dom.style[name] = elm.style[name];
    }
    for (let evt in elm.evts) {
      this.bind(dom, evt, elm.evts[evt]);
    }
    elm.children && elm.children.forEach((child) => {
      dom.appendChild(this.newElement(child, refs))
    })
    elm.ref && (refs[elm.ref] = dom);
    return dom;
  },
  extend: function (target, source) {
    if (Object.assign) {
      Object.assign(target, source);
    } else {
      for (let name in source) {
        target[name] = source;
      }
    }
  },
  sum: function (n1, n2) {
    return (n1 * 10 + n2 * 10) / 10;
  },
  minus: function (n1, n2) {
    return (n1 * 10 - n2 * 10) / 10;
  },
  isFunction: function (o) {
    return Object.prototype.toString.call(o) === '[object Function]';
  },
  addClass: function (o, cls) {
    if (o.classList) {
      o.classList.add(cls);
    } else {
      let classes = o.className.split(' ');
      classes.push(cls);
      o.className = classes.join(' ');
    }
  },
  bind: function (o, evt, fn) {
    if (document.addEventListener) {
      o.addEventListener(evt, fn);
    } else if (document.attachEvent) {
      o.attachEvent('on' + evt, fn);
    } else {
      o['on' + evt] = fn;
    }
  },
  event: (function () {
    var prefix = '', _addEventListener;

    if (document.addEventListener) {
        _addEventListener = 'addEventListener';
    } else if (document.attachEvent) {
        _addEventListener = 'attachEvent';
        prefix = 'on';
    }

    var addEvent = function (el, evt, cb, config) {
        el[_addEventListener](prefix + evt, cb, config)
    }

    var addWheelEvent = function (el, cb, config) {
        var evt = 'wheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? "mousewheel" : 'DOMMouseScroll'
        addEvent.apply(this, [el, evt, function (e) {
            cb({
                originalEvent: e,
                target: e.target || e.srcElement,
                type: "wheel",
                deltaX: e.wheelDeltaX ? - 1/40 * e.wheelDeltaX : 0,
                deltaY: evt === 'DOMMouseScroll' ? - 1/40 * e.wheelDelta : e.deltaY || e.detail,
                preventDefault: function () {
                    e.preventDefault ? e.preventDefault : e.returnValue = false;
                }
            })
        }, config])
    }
    return {
      addEvent,
      addWheelEvent,
    }
  } ())
}

const DNode = function (dnode, ctx) {
  let dn = this;
  dn.id = kutil.guid();
  dn.borderColor = '#007fb1';
  dn.bgColor = '#fff';
  dn.textColor = '#333';
  dn.iconColor = '#007fb1';
  dn.top = true;
  dn.left = true;
  dn.bottom = true;
  dn.right = true;
  dn.isShowMenu = false;
  dn.state = 1;
  kutil.extend(dn, dnode);
  dn.ctx = ctx;
  dn.cmenu = [];
}
DNode.prototype = {
  init: function (dir) {
    let dn = this;
    dn.dir = dir;

    if (dn.children) {
      dn.cmbutton = new ConnectsMenuButton()
      dn.cmbutton.init(dn);
    }

    if (dn.cmenu.length) {
      dn.cmenu.forEach((cmitem) => {
        cmitem.follow(dn);
      })
    } else {
      dn.cmenu = dn.children ? dn.children.map((key, idx) => {
        let cmitem = new ConnectsMenuItem(key, idx);
        cmitem.init(dn);
        return cmitem;
      }) : [];
    }
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
    let ptA = this.getPoint(this.x + r, this.y);
    let ptB = this.getPoint(this.x + this.width, this.y);
    let ptC = this.getPoint(this.x + this.width, this.y + this.height);
    let ptD = this.getPoint(this.x, this.y + this.height);
    let ptE = this.getPoint(this.x, this.y);
    
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
  remove: function () {
    this.state = 0;
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
const ConnectsMenuItem = function (key, idx) {
  let cm = this;
  cm.id = kutil.guid();
  cm.r = 15;
  cm.key = key;
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
  getPoint: function (x, y) {
    return { x: x, y: y };
  },
  drawTitle: function () {
    let cm = this;
    let width = cm.text.length * 12 + 10, 
    height = 20,
    x = cm.cx - width / 2,
    y = cm.y + cm.height + 10;
    let r = 6;
    let ptA = cm.getPoint(x + r, y);
    let ptB = cm.getPoint(x + width, y);
    let ptC = cm.getPoint(x + width, y + height);
    let ptD = cm.getPoint(x, y + height);
    let ptE = cm.getPoint(x, y);
    let ctx = cm.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
    ctx.fillStyle = '#EEE';
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px 黑体'
    ctx.fillStyle = '#333';
    ctx.fillText(cm.text, x + width / 2, y + height / 2);
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
        x += [-1, 1][idx % 2] * Math.ceil(idx / 2) * 45 - 15;
      } else {
        x += [-1, 1][idx % 2] * (Math.ceil((idx + 1) / 2) * 15 + ((1 ^ idx % 2) + Math.floor(idx / 2)) * 30) - [-1, 1][idx % 2] * 15 / 2;
      }
    } else if (dn.dir === 'horizontal') {
      x = dn.x + dn.width + 40;
      y = dn.y + dn.height / 2;
      if (cmlen % 2) {
        y += [-1, 1][idx % 2] * Math.ceil(idx / 2) * 45 - 15;
      } else {
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
  },
  enter: function () {
    this.entering = true;
  },
  leave: function () {
    this.entering = false;
  }
}
const ConnectsMenuButton = function () {
  let cmb = this;
  cmb.id = kutil.guid();
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
    cmb.x = cmb.cx - cmb.r;
    cmb.y = cmb.cy - cmb.r;
  }
}
const ConnectPoint = function (props) {
  let cp = this;
  cp.id = kutil.guid();
  cp.width = 24;
  cp.height = 24;
  cp.r = 4;
  cp.outlineR = 12;
  cp.paths = [];
  cp.parentNode = null;
  cp.direction = 'vertical';
  cp.children = [];
  cp.ctx = {};
  cp.state = 1;
  kutil.extend(cp, props);
  cp.type = cp.position === 'left' || cp.position === 'top' ? 'start' : 'end';
}
ConnectPoint.prototype = {
  init: function () {
    let cp = this;
    cp.follow();
  },
  follow: function () {
    let cp = this, dn = cp.parentNode;
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
    let cp = this;
    cp.position = pos;
    cp.follow();
  },
  drawOutline: function () {
    let cp = this, ctx = cp.ctx;
    ctx.save();
    ctx.strokeStyle = '#c5e3ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.fillStyle = '#c5e3ff';
    ctx.arc(cp.cx, cp.cy, cp.outlineR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
  draw: function (solid) {
    let cp = this, ctx = cp.ctx;
    ctx.save();
    ctx.strokeStyle = '#007fb1';
    ctx.lineWidth = 1;

    ctx.beginPath();
    solid ? ctx.fillStyle = '#007fb1' : ctx.fillStyle = '#FFFFFF';
    ctx.arc(cp.cx, cp.cy, cp.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
  remove: function () {
    this.state = 0;
  }
}
const Path = function (props) {
  let p = this;
  // p.id = kutil.guid();
  p.id = 'flow' + +new Date();
  p.ctx = null;
  p.dir = 'vertical';
  p.state = 1;
  kutil.extend(p, props)
  p.points = [];
  p.start = props.start;
  p.end = props.end;
  console.log(p.id);
}
Path.prototype = {
  closePath: function (end) {
    let p = this;
    p.end = end;
  },
  move: function (x, y) {
    let p = this, start = {x: p.start.cx, y: p.start.cy}, end = {x: x, y: y};
    p.start.type === 'end' ? p.createPoints(start, end) : p.createPoints(end, start);
  },
  connectPoints: function () {
    let p = this, 
    start = {x: p.start.cx, y: p.start.cy}, 
    end = {x: p.end.cx, y: p.end.cy};
    p.start.type === 'end' ? p.createPoints(start, end) : p.createPoints(end, start);
  },
  createPoints: function (start, end) {
    let p = this;
    p.points = [{x: start.x, y: start.y}];

    if (p.dir === 'vertical') {
      if (end.y < start.y) {
        p.points.push({ x: (end.x - start.x) / 2 + start.x, y: start.y });
        p.points.push({ x: (end.x - start.x) / 2 + start.x, y: end.y });
      } else if (Math.abs(end.x - start.x) > 0) {
        p.points.push({ x: end.x, y: start.y});
      }
    } else if (p.dir === 'horizontal') {
      if (start.x < end.x) {
        p.points.push({ x: (end.x - start.x) / 2 + start.x, y: start.y });
        p.points.push({ x: (end.x - start.x) / 2 + start.x, y: end.y });
      } else if (start.x > end.x) {
        p.points.push({ x: start.x, y: start.y - (start.y - end.y) / 2 });
        p.points.push({ x: end.x, y: start.y - (start.y - end.y) / 2 });
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
  },
  remove: function () {
    this.state = 0;
  }
}
const KGraphHistory = function () {
  let states = [],
  stateId = -1;
  return {
    getStateId: function () {
      return stateId;
    },
    getLength: function () {
      return states.length;
    },
    saveState: function (state) {
      if (stateId > -1) {
        states = states.slice(0, stateId + 1);
      }
      states.push(state);
      stateId++;
    },
    nextState: function () {
      stateId = stateId + 1 < states.length - 1 ? stateId + 1 : states.length - 1;
      return states[stateId];
    },
    prevState: function () {
      stateId = stateId - 1 > -1 ? stateId - 1 : 0;
      return states[stateId];
    }
  }
}
const KEvent = function () {
  let o, 
  offsetx = 0,
  offsety = 0,
  scale = 1,
  event = {
    'wtf': '????'
  },
  clientRect = null;
  let eventObjs = {};
  let init = function (layer) {
    o = layer;
    o.addEventListener("mousedown", (e) => { 
      if (event["mousedown"]) { 
        handleEvent(e, "mousedown"); 
      } 
    });
    o.addEventListener("mousemove", (e) => {
      if (event["mousemove"]) {
        handleEvent(e, "mousemove"); 
      }
      if (event["mouseleave"]) {
        handleEvent(e, "mouseleave");
      }
      if (event["mouseenter"]) {
        handleEvent(e, "mouseenter");
      }
    });
    o.addEventListener("dblclick", (e) => {
      if (event["dblclick"]) handleEvent(e, "dblclick");
    })
    o.addEventListener("mouseup", (e) => { 
      if (event["mouseup"]) { 
        handleEvent(e, "mouseup"); 
      }
    });
  }
  let setClientRect = function (cr) {
    clientRect = cr;
  }
  let setOffset = function (x, y) {
    offsetx = x;
    offsety = y;
  }
  let setScale = function (value) {
    scale = value;
  }
  let addEvent = function (obj, evt, fn, opt) {
    let l = obj, id = obj.id;
    if (!eventObjs[id]) {
      eventObjs[id] = {
        self: obj,
        x: l.x,
        y: l.y,
        r: l.x + l.width,
        b: l.y + l.height,
        width: l.width,
        height: l.height,
        enter: false,
        evts: {}
      }
    }
    eventObjs[id].evts[evt] = { fn: fn, opt: opt || {} };
    if (event[evt]) {
        !~event[evt].indexOf(id) && event[evt].push(id);
    } else {
        event[evt] = [id];
    }
  }
  let updateEvent = function (obj, evt) {
    let l = obj;
    if (eventObjs[obj.id]) {
      kutil.extend(eventObjs[obj.id], {
        x: l.x,
        y: l.y,
        r: l.x + l.width,
        b: l.y + l.height,
        width: l.width,
        height: l.height
      })
    }
  }
  let moveEvent = function (obj, type) {
    for (let evt in event) {
      let evts = event[evt], idx = evts.indexOf(obj.id);
      if (type === 'unshift') {
        evts.unshift(evts.splice(idx, 1)[0])
      } else {
        evts.push(evts.splice(idx, 1)[0])
      }
    }
  }
  let delEvent = function (obj, evt) {
    if (eventObjs[obj.id]) {
      delete eventObjs[obj.id].evts[evt]
    }
  }
  let clearEvent = function () {
    event = {};
    eventObjs = {};
  }
  let handleEvent = function (e, evt) {
    let ev = e.changedTouches ? e.changedTouches[0] : e;
    let evts = event[evt],
    i = evts.length - 1,
    ex = (ev.clientX - offsetx - clientRect.left) / scale, 
    ey = (ev.clientY  - offsety - clientRect.top) / scale,
    stopPropagation = false;
    for (; i > -1; i--) {
      let id = evts[i];
      let evtObj = eventObjs[id];

      if (evtObj) {
        let _evt = evtObj.evts[evt];
        if (_evt) {
          let lx = evtObj.x, ly = evtObj.y, lr = evtObj.r, lb = evtObj.b;
          if (lx < ex && ly < ey && lr > ex && lb > ey) {
            if (evt === 'mouseleave') {
              continue;
            } else if (evt === 'mouseenter') {
              if (evtObj.enter) {
                if (stopPropagation) {
                  evtObj.enter = false;
                  evtObj.evts['mouseleave'].fn.call(evtObj.self, e);
                  continue;
                } else {
                  break;
                }
              };
              evtObj.enter = true;
            } else if (stopPropagation) {
              break;
            }
            _evt.fn.call(evtObj.self, e);
            if (_evt.opt.cancelBubble) stopPropagation = true;
          } else if (evt === 'mouseleave' && evtObj.enter) {
            evtObj.enter = false;
            _evt.fn.call(evtObj.self, e);
          }
        }
      }
    }
  }
  return {
    init: init,
    setClientRect: setClientRect,
    setOffset: setOffset,
    setScale: setScale,
    addEvent: addEvent,
    clearEvent: clearEvent,
    updateEvent: updateEvent,
    moveEvent: moveEvent,
    delEvent: delEvent,
    handleEvent: handleEvent
  }
}
const Diagram = function (graph, config) {
  let dg = this, ctx,
  container = kutil.newElement({ tag: 'div', props: { className: 'kgraph-diagram-container' } });
  dg.graph = graph;
  config = config || {};

  let caWidth, caHeight, diagramWidth, diagramHeight;
  let scrollSpeed = 20, scrollTop = 0, scrollLeft = 0, scrollVerBarHeight, scrollHorBarWidth, scrollVerEnabled, scrollHorEnabled;
  let dragable, connecting = false, contextmenu = null;
  let scale = 1, offsetx = 0, offsety = 0, startX, startY, direction, gridWidth, gridLineWidth, gridAlign;
  let dnodes, dnodesMaps, paths, pathsMaps, connects, connectsMaps;
  let clientRect, tmpPath, selectedDNode = null, cloneDNode = null;
  let kevent = new KEvent(), ghistory = new KGraphHistory();
  let refs = {};

  let scrollEvents = {
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
      triggerScroll();
      scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
    },
    mouseup: function (e) {
      document.removeEventListener('mousemove', scrollEvents.mousemove);
      document.removeEventListener('mouseup', scrollEvents.mouseup);
    },
  };

  let canvasEvents = {
    downPoint: {},
    mousedown: function (e) {
      canvasEvents.downPoint.x = e.clientX - offsetx;
      canvasEvents.downPoint.y = e.clientY - offsety;
      if (!dragable) return false;
      config.dragable && document.addEventListener('mousemove', canvasEvents.dragCanvas)
      document.addEventListener('mouseup', canvasEvents.dropCanvas)
    },
    mousemove: function (e) {
      offsetx = e.clientX - canvasEvents.downPoint.x; 
      offsety = e.clientY - canvasEvents.downPoint.y;
      kevent.setOffset(offsetx, offsety);
      draw();
    },
    mouseup: function (e) {
      selectDNode(null);
      config.dragable &&  document.removeEventListener('mousemove', canvasEvents.dragCanvas)
      document.removeEventListener('mouseup', canvasEvents.dropCanvas)
    }
  }

  let init = function () {
    createCanvas();
  };
  let reset = function () {
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

    kevent.clearEvent();
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
    if (config.header) {
      container.appendChild(config.header);
    }
    if (config.scroll) {
      createScrollContainer();
    }
    
    container.appendChild(refs.main);
  };
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

        menuItem.addEventListener('mousedown', (e) => {
          trigger('delete');
        })
        refs.contextMenu.appendChild(menuItem)
      })

      document.addEventListener('mousedown', () => {
        contextmenu && hideContextMenu();
      })

      refs.diagramDragLayer.appendChild(refs.contextMenu);
    }
    showContextMenu(e);
  };
  let createScrollContainer = function () {
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

    kutil.event.addWheelEvent(refs.diagramDragLayer, (e) => {
      if (scrollVerEnabled || scrollHorEnabled) {
        scrollVerEnabled && (scrollTop += e.deltaY / 100 * scrollSpeed);
        triggerScroll();
      }
    })

    refs.scrollVerBar.addEventListener('mousedown', (e) => { scrollEvents.mousedown(e, 'vertical') })
    refs.scrollHorBar.addEventListener('mousedown', (e) => { scrollEvents.mousedown(e, 'horizontal') })
    refs.main.insertBefore(refs.scrollContainer, refs.diagramDragLayer);
  }
  let showContextMenu = function (e) {
    contextmenu = refs.contextMenu;
    refs.contextMenu.style.display = 'block';
    refs.contextMenu.style.left = e.clientX - clientRect.left + 'px';
    refs.contextMenu.style.top = e.clientY - clientRect.top + 'px';
  };
  let hideContextMenu = function () {
    dragable = true;
    contextmenu = null;
    refs.contextMenu.style.display = 'none';
  };
  let initCanvas = function () {
    dg.ctx = ctx = refs.canvas.getContext('2d');
    kevent.init(refs.diagramDragLayer);
    resizeCanvas();
    reset();
    kevent.setOffset(offsetx, offsety);
    direction !== 'vertical' && graph.directionChanged(config.direction);
    refs.diagramDragLayer.addEventListener('mousedown', canvasEvents.mousedown)
    draw();
    saveState('init diagram');
  };
  let updateOffset = function (x, y) {
    offsetx = x;
    offsety = y;
    kevent.setOffset(offsetx, offsety);
  }
  let resizeScroll = function () {
    if (diagramHeight > caHeight) {
      scrollVerBarHeight = caHeight * caHeight / diagramHeight;
      refs.scrollVerBar.style.height = scrollVerBarHeight + 'px';
      scrollVerEnabled = true;
      refs.scrollVerBar.style.display = 'block';
    } else {
      scrollVerEnabled = false;
      refs.scrollVerBar.style.display = 'none';
    }

    if (diagramWidth > caWidth) {
      scrollHorBarWidth = caWidth * caWidth / diagramWidth;
      refs.scrollHorBar.style.width = scrollHorBarWidth + 'px';
      scrollHorEnabled = true;
      refs.scrollHorBar.style.display = 'block';
    } else {
      scrollHorEnabled = false;
      refs.scrollHorBar.style.display = 'none';
    }
  }
  let triggerScroll = function () {
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

    refs.scrollVerBar.style.transform = 'translate(0px, '+ scrollTop +'px)';
    refs.scrollHorBar.style.transform = 'translate('+ scrollLeft +'px, 0px)';

    offsetx = -scrollLeft / caWidth * diagramWidth;
    offsety = -scrollTop / caHeight * diagramHeight;
    updateOffset(offsetx, offsety);
    draw();
  }
  let resizeCanvas = function () {
    canvas.width = 0;
    canvas.height = 0;
    clientRect = refs.diagramDragLayer.getBoundingClientRect();
    graph.clientRect = clientRect;
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;
    dg.caWidth = caWidth = clientRect.width;
    caHeight = clientRect.height;
    resizeScroll();
    kevent.setClientRect(clientRect);
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
    kevent[handler](o, 'mouseenter');
    kevent[handler](o, 'mousedown');
    kevent[handler](o, 'mouseleave');
  };
  let createDNode = function (dnode, type, opt) {
    if (type === 'click') checkInsertAvailable(dnode);
    if (type === 'drag') {
      if (gridAlign) {
        let dnodex = dnode.x - offsetx,
        dnodey =  dnode.y - offsety;
        dnode.x = dnodex < 0 ? 0 : dnodex - dnodex % gridWidth;
        dnode.y = dnodey < 0 ? 0 : dnodey - dnodey % gridWidth;
      }
    }
    let newDNode = new DNode(dnode, ctx);
    if (type === 'copy') {
      newDNode.reset();
      cloneDNode = newDNode;
      newDNode.id = kutil.guid();
      newDNode.move(cloneDNode.x + gridWidth, cloneDNode.y + gridWidth);
    }
    if (type === 'cmitem') {
      newDNode.x = opt.x;
      newDNode.y = opt.y;
    }
    initDNode(newDNode);
    dnodes ? dnodes.push(newDNode) : dnodes = [newDNode];
    dnodesMaps[newDNode.id] = newDNode;
    checkDiagramSize(newDNode);
    return newDNode;
  }
  let createConnect = function (props, position) {
    if (position) props.position = position;
    let cp = new ConnectPoint(props);
    cp.init();
    initConnect(cp);
    connects.push(cp);
    let parent = cp.parentNode;
    connectsMaps[parent.id] ? connectsMaps[parent.id].push(cp) : connectsMaps[parent.id] = [cp];
  };
  let createConnects = function (dnode) {
    let dn = dnode, 
    props = {
      ctx: ctx,
      parentNode: dnode,
      children: dnode.children,
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
    return connectsMaps[dnode.id] || [];
  };
  let createPath = function (props) {
    let path = new Path(props);
    paths.push(path);
    let start = path.start,
    end = path.end;
    pathsMaps[start.id] ? pathsMaps[start.id].push(path) : pathsMaps[start.id] = [path];
    pathsMaps[end.id] ? pathsMaps[end.id].push(path) : pathsMaps[end.id] = [path];
  }
  let getPaths = function (cp) {
    return pathsMaps[cp.id] || [];
  };
  let initDNode = function (dnode) {
    let downPoint = {},
    prevCoord = {},
    draging = false;
    dnode.init(direction)
    
    dnode.cmenu.forEach((item) => {
      let sbdnode = graph.sbdnodes.maps[item.key];
      if (sbdnode) {
        item.setText(sbdnode.text);
        item.setIcon(sbdnode.icon);
      } else {
        console.error('找不到对应dnode', item.key);
      }
    })

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
        getConnects(dnode).forEach((cp) => {
          cp.follow();
        })
        checkDiagramSize(dnode);
        updateDNodeEvt(dnode);
        draw();
        saveState('drop dnode');
      }
    }
    kevent.addEvent(dnode, 'mouseenter', () => {
      refs.diagramDragLayer.classList.add('move');
      dnode.enter();
      draw();
    }, { cancelBubble: true })
    kevent.addEvent(dnode, 'mousedown', (e) => {
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
    kevent.addEvent(dnode, 'mouseleave', () => {
      refs.diagramDragLayer.classList.remove('move');
      dnode.leave();
      draw();
    })
    dnode.dblclick && kevent.addEvent(dnode, 'dblclick', (e) => {
      dnode.dblclick(e, dnode);
    })
    dnode.cmbutton && initCMButton(dnode);
  };
  let initConnect = function (cp) {
    let downPoint = {};

    let begin = function (e) {
      tmpPath = new Path({
        ctx: ctx,
        start: cp, 
        dir: direction
      });
      connecting = true;
      downPoint.x = e.pageX;
      downPoint.y = e.pageY;
      clearCanvasEvent();
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', close);
    }

    let move = function (e) {
      tmpPath.move(calcScale(e.pageX - clientRect.left - offsetx), calcScale(e.pageY - clientRect.top - offsety));
      draw();
    }

    let close = function (e) {
      dragable = true;
      connecting = false;
      let connectPoint = checkConnect({ x: calcScale(e.pageX - clientRect.left - offsetx), y: calcScale(e.pageY - clientRect.top - offsety) });
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
          saveState('add path');
        }
      }
      tmpPath = null;
      draw();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', close);
    }
    
    kevent.addEvent(cp, 'mouseenter', () => {
      refs.diagramDragLayer.classList.add('auto');
    })
    kevent.addEvent(cp, 'mousedown', begin, { cancelBubble: true })
    kevent.addEvent(cp, 'mouseleave', () => {
      refs.diagramDragLayer.classList.remove('auto');
    })
  };
  let initCMButton = function (dnode) {
    kevent.addEvent(dnode.cmbutton, 'mouseenter', () => {
      refs.diagramDragLayer.classList.add('pointer');
    })
    kevent.addEvent(dnode.cmbutton, 'mousedown', () => {
      dnode.showMenu();
      dnode.cmenu.forEach((item) => {
        initConnectsMenuItem(dnode, item);
      })
      draw();
    })
    kevent.addEvent(dnode.cmbutton, 'mouseleave', () => {
      refs.diagramDragLayer.classList.remove('pointer');
    })
  }
  let initConnectsMenuItem = function (dnode, cmitem) {
    kevent.addEvent(cmitem, 'mouseenter', () => {
      cmitem.enter();
      refs.diagramDragLayer.classList.add('pointer');
      draw();
    })
    kevent.addEvent(cmitem, 'mousedown', () => {
      cmitem.leave();
      graph.$trigger('insert', graph.sbdnodes.maps[cmitem.key], 'cmitem', (newDNode) => {
        createPath({
          ctx: ctx,
          start: getConnects(dnode).slice(-1)[0],
          end: getConnects(newDNode)[0],
          dir: direction,
        })
        saveState('add path and dnode');
      }, direction === 'vertical' ? { x: dnode.x, y: dnode.y + dnode.height + 60 } : { x: dnode.x + dnode.width + 60, y: dnode.y });
    })
    kevent.addEvent(cmitem, 'mouseleave', () => {
      refs.diagramDragLayer.classList.remove('pointer');
      cmitem.leave();
      draw();
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
  let checkDNodeInherit = function (dnode) {
    // if (dnode)

  }
  let verifyConnection = function (point1, point2) {
    let startPoint, endPoint;
    if (point1.type === 'end') {
      startPoint = point1;
      endPoint = point2;
    } else {
      startPoint = point2;
      endPoint = point1;
    }
    let startDNode = startPoint.parentNode,
    endDNode = endPoint.parentNode;

    if (startDNode.connectRule === 'inherit') {
      let paths = getPaths(getConnects(startDNode)[0]);
      if (paths.length > 0) {
        startDNode = paths[0].start.parentNode;
      }
    } else if (endDNode.connectRule === 'inherit') {
      let paths = getPaths(getConnects(endDNode)[1]);
      if (paths.length > 0) {
        endDNode = paths[0].end.parentNode;
      }
    }

    if (startPoint.position === endPoint.position) {
      return (startPoint.position === 'top' || startPoint.position === 'left') ? '需要连接节点开始位置' : '需要连接节点结束位置';
    } else if (startDNode.nochildren && ~startDNode.nochildren.indexOf(endDNode.key)) {
      return startDNode.text + '节点不能连接' + startDNode.nochildren.map((key) => graph.sbdnodes.maps[key].text).join(',') + '节点';
    } else if (startDNode.children && !~startDNode.children.indexOf(endDNode.key)) {
      return startDNode.text + '节点只能连接' + startDNode.children.map((key) => graph.sbdnodes.maps[key].text).join(',') + '节点';
    } else {
      return startDNode.verifyConnection && startDNode.verifyConnection(startPoint, endPoint);
    }
  };
  let checkDiagramSize = function (dnode) {
    if (dnode.x > diagramWidth - dnode.width - 100) {
      dg.diagramWidth = diagramWidth = dnode.x + dnode.width + 100;
    }
    if (dnode.y > diagramHeight - 100) {
      diagramHeight = dnode.y + dnode.height + 100;
    }
    resizeScroll();
  };
  let checkInsertAvailable = function (dnode) {
    dnode.x = startX;
    dnode.y = startY;
    if (config.dragable || config.scroll) {
      let lastDNode = findLastDNode();
      if (lastDNode.y > 0) {
        dnode.y = lastDNode.y + dnode.height + 20;
      } else if (lastDNode.x > 0) {
        dnode.x = lastDNode.x + dnode.width + 20;
      }
    }
  };
  let mapDNodes = function (cb) {
    let i = 0, len = dnodes.length;
    for (; i < len; i++) {
      cb(dnodes[i], i, dnodes);
    }
  };
  let restoreState = function (s) {
    reset();

    let state = JSON.parse(s);

    scale = state.scale;
    graph.scaleChanged(scale);

    direction = state.direction;
    graph.directionChanged(direction);

    state.dnodes.map((dn) => createDNode(dn));

    state.connects.map((cp) => {
      cp.ctx = ctx;
      cp.parentNode = dnodesMaps[cp.parentNode.id];
      return createConnect(cp);
    });

    state.paths.map((p) => {
      p.ctx = ctx;
      p.start.parentNode = connectsMaps[p.start.parentNode.id];
      p.end.parentNode = connectsMaps[p.end.parentNode.id];
      return createPath(p);
    });

    diagramWidth = state.diagramWidth;
    diagramHeight = state.diagramHeight;
    offsetx = state.offsetx;
    offsety = state.offsety;
    gridWidth = state.gridWidth;
    gridLineWidth = state.gridLineWidth;
    gridAlign = state.gridAlign;

    selectDNode(null);
  };
  let saveState = function (from) {
    let state = JSON.stringify({
      dnodes: dnodes,
      connects: connects,
      paths: paths,
      diagramWidth: diagramWidth,
      diagramHeight: diagramHeight,
      offsetx: offsetx,
      offsety: offsety,
      gridWidth: gridWidth,
      gridAlign: gridAlign,
      scale: scale,
      direction: direction
    });
    ghistory.saveState(state);
    graph.updateToolbar();
  };
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
      cp.draw(getPaths(cp).length);
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

    kevent.setOffset(offsetx, offsety);
    kevent.setScale(scale);
  };
  let directionChanged = function (dir) {
    changeConnectsDir();
    dnodes.forEach((dnode) => {
      dnode.dir = dir;
      dnode.cmenu.forEach((cmitem) => {
        cmitem.follow(dnode);
      });
      updateDNodeEvt(dnode);
    });
    paths.forEach((p) => {
      p.dir = dir
    })
  }
  let trigger = function (evt) {
    let args = Array.from(arguments).slice(1);
    events[evt].apply(events, args);
    evt === 'undo' || evt === 'redo' ? draw('restore') : draw();
  };
  let events = {
    insert: function (dnode, type, cb, opt) {
      let newDNode = createDNode(dnode, type, opt);
      createConnects(newDNode);
      saveState('insert');
      cb && cb(newDNode);
    },
    copy: function () {
      cloneDNode = selectedDNode;
    },
    paste: function () {
      let evt = this;
      if (!cloneDNode) return false;
      evt.insert(cloneDNode, 'copy');
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
      delDNodeEvt(dnode);

      dnodes.splice(dnodes.indexOf(dnode), 1);
      delete dnodesMaps[dnode.id];

      getConnects(dnode).forEach((cp) => {
        connects.splice(connects.indexOf(cp), 1);
        delete connectsMaps[cp.id];

        getPaths(cp).forEach((p) => {
          paths.splice(paths.indexOf(p), 1);
          delete pathsMaps[p.id];
        })
      })
    },
    tofront: function () {
      let evt = this, dnode = evt.splice();
      dnodes.push(dnode);
      kevent.moveEvent(dnode, 'push');
      getConnects(dnode).forEach((cp) => {
        kevent.moveEvent(cp, 'push');
      })
      dnode.cmbutton && kevent.moveEvent(dnode.cmbutton, 'push');
    },
    toback: function () {
      let evt = this, dnode = evt.splice();
      dnodes.unshift(dnode);
      kevent.moveEvent(dnode, 'unshift');
      getConnects(dnode).forEach((cp) => {
        dg.kevent.moveEvent(cp, 'unshift');
      })
      dnode.cmbutton && kevent.moveEvent(dnode.cmbutton, 'unshift');
    },
    undo: function () {
      restoreState(ghistory.prevState());
    },
    redo: function () {
      restoreState(ghistory.nextState());
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
    }
  };
  let exportJson = function () {
    let data = {
      nodes: [],
      relations: [],
    }

    data.nodes = dnodes.map((dn) => {
      return {
        id: dn.id,
        name: dn.key,
      }
    })

    data.relations = paths.map((p) => {
      return {
        flowId: p.id,
        sourceId: p.start.parentNode.id,
        sourceName: p.start.parentNode.key,
        targetId: p.end.parentNode.id,
        targetName: p.end.parentNode.key
      }
    })

    return data;
  };

  kutil.extend(graph, {
    $trigger: trigger,
    ghistory,
    getSelectedDNode () {
      return selectedDNode;
    }
  })
  
  kutil.extend(dg, {
    refs,
    draw,
    container,
    initCanvas,
    resizeCanvas,
    scaleChanged,
    directionChanged,
    ghistory,
    exportJson
  })

  init();

  return dg;
}
const Toolbar = function (graph) {
  let tb = this,
  config = {
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
  container = document.createElement('div');
  container.className = 'kgraph-toolbar-container';
  tb.graph = graph;
  let tools = { list: [], maps: {} };
  
  let init = function () {
    createTools();
  }
  let updateTools = function () {
    updateHistoryTools();
    updateDNodeTools();
    update();
  }
  let updateHistoryTools = function () {
    let stateId = graph.ghistory.getStateId(), stateCount = graph.ghistory.getLength();
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
        tool.dom.classList.remove('disabled');
      } else {
        tool.dom.classList.add('disabled');
      }
    })
  }
  let createTools = function () {
    let toolbar = document.createElement('div');
    toolbar.className = 'kgraph-toolbar';
    config.tools.forEach((ts, idx) => {
      if (idx !== 0) {
        let cutOff = document.createElement('div');
        cutOff.className = 'cut-off';
        toolbar.appendChild(cutOff);
      }
      for (let toolname in ts) {
        let config = ts[toolname];
        if (config.enabled) {
          let tool = document.createElement('div');
          tool.title = config.title;
          tool.className = 'iconfont icon-' + toolname + ' disabled';
          tool.addEventListener('click', () => {
            if (!config.enabled) return false;
            graph.$trigger(toolname);
          })
          let tl = {
            name: toolname,
            config: config,
            dom: tool
          }
          tools.maps[tl.name] = tl;
          tools.list.push(tl);
          toolbar.appendChild(tool);
        }
      }
    })
    container.appendChild(toolbar);
  }
  init();
  return {
    container: container,
    updateTools: updateTools
  }
}
const FormatContainer = function (ft, title, style) {
  let container = document.createElement('div');
  container.className = style;
  let containerTitle = document.createElement('div');
  containerTitle.className = 'format-title';
  let icon = document.createElement('i');
  icon.className = 'iconfont icon-fenlei1';
  let span = document.createElement('span');
  span.innerText = title;
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
  ft.container.className = 'kgraph-format-container';
  let refs = {};
  return {
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
      kutil.newElement({
        tag: 'div',
        ref: 'fieldbar',
        props: { className: 'text-input-panel' },
        children: [{
          tag: 'div',
          props: { className: 'field-name' },
        },{
          tag: 'div',
          props: { className: 'field-value', innerHTML: '节点名称' },
          children: [{
            tag: 'input',
            ref: 'fieldInput',
            props: { type: 'text', value: ft.graph.selectedDNode.text },
          }]
        }]
      }, refs)

      refs.fieldInput.addEventListener('input', () => {
        ft.graph.selectedDNode.text = input.value;
        ft.graph.updateDiagram();
      })

      refs.fieldInput.addEventListener('blur', () => {
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
}
const Sidebar = function (graph) {
  let container = kutil.newElement({ tag: 'div', props: { className: 'kgraph-sidebar-container' } });
  let dnodes = { list: [], maps: {} }
  graph.sbdnodes = dnodes;
  let refs = {}
  let createSection = function (title, items) {
    let section = kutil.newElement({
      tag: 'div',
      props: { className: 'sidebar-section' },
      children: [{
        tag: 'div',
        props: { className: 'sidebar-section-title' },
        children: [{
          tag: 'i',
          props: { className: 'iconfont icon-fenlei1' }
        }, {
          tag: 'span',
          props: { innerText: title }
        }]
      }, {
        tag: 'div',
        ref: 'seciontItems',
        props: { className: 'sidebar-section-items' }
      }]
    }, refs)
    items.forEach((item) => {
      createItem(refs.seciontItems, item)
      addDNodeEvt(item);
    })
    container.appendChild(section);
    console.log(dnodes);
  };
  let createItem = function (container, item) {
    let sectionItem = kutil.newElement({
      tag: 'div',
      props: { className: 'sidebar-section-item item-'+ item.value },
      children: [{
        tag: 'i',
        ref: 'icontext',
        props: { className: 'iconfont', innerHTML: item.iconText }
      }, {
        tag: 'span',
        props: { innerText: item.text }
      }]
    }, refs)
    item.dom = sectionItem;
    container.appendChild(sectionItem);
    item.width = 140;
    item.height = 40;
    item.icon = refs.icontext.textContent;
    item.text = item.text;
    dnodes.list.push(item);
    dnodes.maps[item.key] = item;
  };
  let addDNodeEvt = function (item) {
    let downPoint = {}, grabing = false, enter = false, dragDNode;

    let drag = function (e) {
      if (!grabing) {
        if (Math.abs(downPoint.x - e.clientX) > 10  || Math.abs(downPoint.y - e.clientY) > 10) {
          grabing = true;
          dragDNode = createDRagDNode(item, downPoint.x, downPoint.y);
        } else {
          return false;
        }
      }
      if (e.clientX > graph.clientRect.left && e.clientX < graph.clientRect.right
        && e.clientY > graph.clientRect.top && e.clientY < graph.clientRect.bottom) {
        if (!enter) {
          enter = true;
          dragDNode.style.width = item.width * graph.scale + 'px';
          dragDNode.style.height = item.height * graph.scale + 'px';
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
        graph.$trigger('insert', item, 'click');
      } else {
        if (dragDNode) {
          document.getElementsByTagName('body')[0].removeChild(dragDNode);
          item.x = e.clientX - graph.clientRect.left;
          item.y = e.clientY - graph.clientRect.top;
          graph.$trigger('insert', item, 'drag');
        }
      }

      grabing = false;
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
    }

    item.dom.addEventListener('mousedown', (e) => {
      if (e.which === 1) {
        downPoint.x = e.clientX;
        downPoint.y = e.clientY;
        
        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', drop)
      }
    });
  };
  let createDRagDNode = function (item, x, y) {
    let dragDNode = kutil.newElement({
      tag: 'div',
      style: {
        width: item.width + 'px',
        height: item.height + 'px',
        border: '1px dashed #333',
        position: 'absolute',
        top: y + 'px',
        left: x + 'px',
        zIndex: 999,
        transform: 'translate(0, 0)'
      }
    })
    document.getElementsByTagName('body')[0].appendChild(dragDNode);
    return dragDNode;
  }
  return {
    container: container,
    createSection: createSection,
  }
}
const Footer = function (graph) {
  let container = document.createElement('div');
  container.className = 'kgraph-footer-container';
  let refs = {};
  let init = function () {
    createDiagramScale();
    createGraphMode();
  }
  let createDiagramScale = function () {
    kutil.newElement({
      tag: 'div',
      ref: 'diagramScale',
      props: { className: 'diagram-scale' },
      children: [{
        tag: 'div',
        props: { className: 'scale' },
        evts: {
          click: function () {
            console.log('click');
          }
        },
        children: [{
          tag: 'div',
          ref: 'scaleBar',
          props: { className: 'scale-bar' },
          style: { width: '50%' },
          children: [{
            tag: 'div',
            props: { className: 'scale-drag' }
          }]
        }]
      }, {
        tag: 'div',
        props: { className: 'zoom' },
        children: [{
          tag: 'div',
          ref: 'zoomOut',
          props: { className: 'scale-zoom-out iconfont icon-jian' }
        }, {
          tag: 'div',
          ref: 'scaleValue',
          props: { className: 'scale-value', innerHTML: '100%' }
        }, {
          tag: 'div',
          ref: 'zoomIn',
          props: { className: 'scale-zoom-in iconfont icon-jia' }
        }]
      }]
    }, refs)

    refs.zoomOut.addEventListener('click', () => {
      graph.$trigger('zoomout');
    });

    refs.zoomIn.addEventListener('click', () => {
      graph.$trigger('zoomin');
    });

    container.appendChild(refs.diagramScale);
  }
  let createGraphMode = function () {
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
    refs.option1.addEventListener('click', () => {
      graph.$trigger('changeDir', 'horizontal');
    })
    refs.option2.addEventListener('click', () => {
      graph.$trigger('changeDir', 'vertical');
    })
    container.appendChild(refs.fieldbar);
  }
  let scaleChanged = function (scale) {
    refs.scaleValue.innerHTML = Math.ceil(scale * 100) + '%';
    refs.scaleBar.style.width = scale / 2 * 100 + '%';
  }
  let directionChanged = function (dir) {
    refs.fieldbar.className = 'graph-mode ' + dir;
  }
  init();
  return {
    container,
    scaleChanged,
    directionChanged
  }
}
const KGraph = function (config) {
  let kg = this, 
  fragment = document.createDocumentFragment(), 
  container = config.container || document.getElementsByTagName('body')[0],
  diagram, toolbar, sidebar, format, footer;
  let graph = {};
  let init = function () {
    resizeContainer();
    configGraph();
    createToolBar();
    createSideBar();
    createDiagram();
    createFooter();
    // createFormat();
    container.appendChild(fragment);

    container.addEventListener('mousedown', (e) => {
      e.preventDefault();
    })
    container.addEventListener('mousemove', (e) => {
      e.preventDefault();
    })
    window.addEventListener('resize', () => {
      resize();
    })
    container.oncontextmenu = function() {
      return false;
    }
    diagram.initCanvas();
    toolbar.updateTools();
  }
  let resizeContainer = function () {
    if (kutil.isFunction(config.containerWidth)) {
      container.style.width = config.containerWidth() + 'px';
    }
    if (kutil.isFunction(config.containerHeight)) {
      container.style.height = config.containerHeight() + 'px';
    }
  }
  let resize = function () {
    resizeContainer();
    diagram.resizeCanvas();
    diagram.draw();
  }
  let configGraph = function () {
    graph = {
      updateToolbar: function () {
        toolbar.updateTools();
      },
      updateFormat: function () {
      },
      updateDiagram: function () {
        diagram.draw();
      },
      scaleChanged: function (scale) {
        diagram.scaleChanged(scale);
        footer.scaleChanged(scale);
      },
      directionChanged: function (dir) {
        diagram.directionChanged(dir);
        footer.directionChanged(dir);
      },
      message: function (options) {
        alert(options.message);
      }
    }

    kg.graph = graph;
  }
  let createDiagram = function () {
    diagram = new Diagram(graph, config.diagram);
    kg.diagram = diagram;
    fragment.appendChild(diagram.container);
  }
  let createToolBar = function () {
    toolbar = new Toolbar(graph);
    kg.toolbar = toolbar;
    fragment.appendChild(toolbar.container);
  }
  let createSideBar = function () {
    sidebar = new Sidebar(graph);
    kg.sidebar = sidebar;
    fragment.appendChild(sidebar.container);
  }
  let createFormat = function () {
    format = new Format();
    format.init();
    format.graph = graph;
    fragment.appendChild(format.container);
  }
  let createFooter = function () {
    footer = new Footer(graph);
    kg.footer = footer;
    diagram.container.appendChild(footer.container);
  }
  let set = function (name, value) {
    graph[name] = value;
  }
  init();
  kg.resize = resize;
  kg.set = set;
  return kg;
}
