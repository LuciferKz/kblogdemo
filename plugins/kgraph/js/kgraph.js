let Guid = function () {
  let s = [], hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
};
let newElement = function (elm, refs) {
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
  elm.children && elm.children.forEach((child) => {
    dom.appendChild(newElement(child, refs))
  })
  elm.ref && (refs[elm.ref] = dom);
  return dom;
}
const DNode = function (dnode, ctx) {
  let dn = this;
  dn.key = Guid();
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
  Object.assign(dn, dnode);
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
      dn.cmenu = dn.children ? dn.children.map((id, idx) => {
        let cmitem = new ConnectsMenuItem(id, idx);
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
const ConnectsMenuItem = function (id, idx) {
  let cm = this;
  cm.key = Guid();
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
    cm.entering && cm.drawTitle();
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
  cmb.key = Guid();
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
  cp.key = Guid();
  cp.width = 24;
  cp.height = 24;
  cp.r = 4;
  cp.outlineR = 12;
  cp.paths = [];
  cp.parentNode = null;
  cp.position = 'vertical';
  cp.children = [];
  cp.ctx = {};
  cp.state = 1;
  Object.assign(cp, props);
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
  p.key = Guid();
  p.ctx = null;
  p.dir = 'vertical';
  p.state = 1;
  Object.assign(p, props)
  p.points = [];
  p.start = props.start;
  p.end = props.end;
}
Path.prototype = {
  closePath: function (end) {
    let p = this;
    p.end = end;
  },
  move: function (x, y) {
    let p = this, start = {x: p.start.cx, y: p.start.cy}, end = {x: x, y: y};
    (p.start.position === 'bottom' || p.start.position === 'right') ? p.createPoints(start, end) : p.createPoints(end, start);
  },
  connectPoints: function () {
    let p = this, 
    start = {x: p.start.cx, y: p.start.cy}, 
    end = {x: p.end.cx, y: p.end.cy};
    (p.start.position === 'bottom' || p.start.position === 'right') ? p.createPoints(start, end) : p.createPoints(end, start);
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
  event = {},
  clientRect = null;
  let eventObjs = {};
  let init = function (layer) {
    o = layer;
    o.addEventListener("mousedown", (e) => { if (event["mousedown"]) { handleEvent(e, "mousedown"); } });
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
    o.addEventListener("mouseup", (e) => { if (event["mouseup"]) { handleEvent(e, "mouseup"); } });
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
    let l = obj, key = obj.key;
    if (!eventObjs[key]) {
      eventObjs[key] = {
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
    eventObjs[key].evts[evt] = { fn: fn, opt: opt || {} };
    if (event[evt]) {
        !~event[evt].indexOf(key) && event[evt].push(key);
    } else {
        event[evt] = [key];
    }
  }
  let updateEvent = function (obj, evt) {
    let l = obj;
    if (eventObjs[obj.key]) {
      Object.assign(eventObjs[obj.key], {
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
      let evts = event[evt], idx = evts.indexOf(obj.key);
      if (type === 'unshift') {
        evts.unshift(evts.splice(idx, 1)[0])
      } else {
        evts.push(evts.splice(idx, 1)[0])
      }
    }
  }
  let delEvent = function (obj, evt) {
    if (eventObjs[obj.key]) {
      delete eventObjs[obj.key].evts[evt]
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
    ex = (ev.clientX - offsetx - clientRect.x) / scale, 
    ey = (ev.clientY  - offsety - clientRect.y) / scale,
    stopPropagation = false;

    for (; i > -1; i--) {
      let key = evts[i];

      let evtObj = eventObjs[key];

      if (evtObj) {
        let _evt = evtObj.evts[evt];
        if (_evt) {
          let lx = evtObj.x,
          ly = evtObj.y,
          lr = evtObj.r,
          lb = evtObj.b;

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
      let dg = kgraph.diagram,
      newDNode = dg.createDNode(dnode, type, opt);
      dg.createConnects(newDNode);
      dg.saveState('insert');
      cb && cb(newDNode);
    },
    copy: function () {
      kgraph.graph.cloneDNode = kgraph.graph.selectedDNode;
    },
    paste: function () {
      let evt = this;
      if (!kgraph.graph.cloneDNode) return false;
      evt.insert(kgraph.graph.cloneDNode, 'copy');
    },
    splice: function () {
      let dg = kgraph.diagram, index = null, arrs = null;
      dg.mapDNodes((dnode, idx, dnodes) => {
        if (dnode === kgraph.graph.selectedDNode) {
          arrs = dnodes;
          index = idx;
        }
      })
      dg.selectDNode(null);
      
      return arrs.splice(index, 1)[0];
    },
    'delete': function (action) {
      let dg = kgraph.diagram, g = kgraph.graph, dnode = g.selectedDNode;
      dnode.remove();
      dg.getConnects(dnode).forEach((cp) => {
        cp.remove();
        dg.getPaths(cp).forEach((p) => {
          p.remove();
        })
      })
      dg.delDNodeEvt(dnode);
    },
    tofront: function () {
      let dg = kgraph.diagram, evt = this, dnode = evt.splice();
      dg.dnodes.push(dnode);
      dg.kevent.moveEvent(dnode, 'push');
      dg.getConnects(dnode).forEach((cp) => {
        dg.kevent.moveEvent(cp, 'push');
      })
      dnode.cmbutton && dg.kevent.moveEvent(dnode.cmbutton, 'push');
    },
    toback: function () {
      let dg = kgraph.diagram, evt = this, dnode = evt.splice();
      dg.dnodes.unshift(dnode);
      dg.kevent.moveEvent(dnode, 'unshift');
      dg.getConnects(dnode).forEach((cp) => {
        dg.kevent.moveEvent(cp, 'unshift');
      })
      dnode.cmbutton && dg.kevent.moveEvent(dnode.cmbutton, 'unshift');
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
      dg.changeConnectsDir();
      dg.dnodes.forEach((dnode) => {
        dnode.dir = dir;
        dnode.cmenu.forEach((cmitem) => {
          cmitem.follow(dnode);
        });
        dg.updateDNodeEvt(dnode);
      });
      dg.paths.forEach((p) => {
        p.dir = dir
      })
    }
  }
  kgraph.graph.$trigger = trigger;
}
const Diagram = function (graph) {
  let dg = this, ctx,
  kevent = new KEvent(),
  container = document.createElement('div');
  container.className = 'kgraph-diagram-container';
  let caWidth = 0,
  caHeight = 0,
  dnodes = [],
  dnodesMaps = {},
  paths = [],
  pathsMaps = {},
  diagramWidth = 602,
  diagramHeight = 802,
  coordx = 0,
  coordy = 0,
  gridWidth = 10,
  gridLineWidth = 2,
  gridAlign = true,
  dragable = true,
  clientRect,
  tmpPath,
  diagramDragLayer,
  dragCanvas,
  dropCanvas,
  connects = [],
  connectsMaps = {},
  connecting = false;
  dg.graph = graph;
  let init = function () {
    reset();
    createCanvas();
  };
  let reset = function () {
    dnodes = [];
    dnodesMaps = {};
    paths = [];
    pathsMaps = {};
    connects = [];
    connectsMaps = {};
    diagramWidth = 602;
    diagramHeight = 802;
    coordx = 0;
    coordy = 0;
    gridWidth = 10;
    gridLineWidth = 2;
    gridAlign = true;
    dragable = true;
    kevent.clearEvent();
  };
  let createCanvas = function () {
    let main = document.createElement('div');
    main.className = 'kgraph-diagram';
    let mainHead = document.createElement('div');
    mainHead.className = 'kgraph-diagram-head';
    let mainTitle = document.createElement('div');
    mainTitle.className = 'kgraph-diagram-title';
    let icon = document.createElement('i');
    icon.className = 'iconfont icon-liwu'
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
    canvas = canvas;
    diagramDragLayer = document.createElement('div');
    diagramDragLayer.className = 'diagram-drag-layer';
    main.appendChild(canvas);
    main.appendChild(diagramDragLayer);
    container.appendChild(mainHead);
    container.appendChild(main);
  };
  let initCanvas = function () {
    ctx = canvas.getContext('2d');
    dg.ctx = ctx;
    clientRect = diagramDragLayer.getBoundingClientRect();
    graph.clientRect = clientRect;
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;
    dg.caWidth = caWidth = clientRect.width;
    caHeight = clientRect.height;
    coordx = caWidth - diagramWidth > 0 ? (caWidth - diagramWidth) / 2 : 0;
    coordy = caHeight - diagramHeight > 0 ? (caHeight - diagramHeight) / 2 : 0;
    kevent.init(diagramDragLayer);
    kevent.setClientRect(clientRect);
    kevent.setOffset(coordx, coordy);
    let downPoint = {};
    let downCanvas = function (e) {
      downPoint.x = e.clientX - coordx;
      downPoint.y = e.clientY - coordy;
      if (!dragable) return false;
      document.addEventListener('mousemove', dragCanvas)
      document.addEventListener('mouseup', dropCanvas)
    }
    dragCanvas = function (e) {
      coordx = e.clientX - downPoint.x; 
      coordy = e.clientY - downPoint.y;
      kevent.setOffset(coordx, coordy);
      draw();
    }
    dropCanvas = function (e) {
      selectDNode(null);
      document.removeEventListener('mousemove', dragCanvas)
      document.removeEventListener('mouseup', dropCanvas)
    }
    diagramDragLayer.addEventListener('mousedown', downCanvas)
    draw();
    saveState('init diagram');
  };
  let resizeCanvas = function () {
    canvas.width = 0;
    canvas.height = 0;
    clientRect = diagramDragLayer.getBoundingClientRect();
    graph.clientRect = clientRect;
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;
    dg.caWidth = caWidth = clientRect.width;
    caHeight = clientRect.height;
    kevent.setClientRect(clientRect); 
    draw();
  };
  let selectDNode = function (dnode) {
    if (graph.selectedDNode && graph.selectedDNode !== dnode) {
      graph.selectedDNode.blur();
      setCMEvt(graph.selectedDNode, 'del');
    }
    graph.selectedDNode = dnode;
    graph.updateFormat();
    graph.updateToolbar();
    draw();
  };
  let findLastDNode = function () {
    let bottomDNode = { x: 0, y: 0 };
    mapDNodes((dnode) => {
      if (graph.direction === 'horizontal') {
        bottomDNode.x = Math.max(bottomDNode.x, dnode.x);
      } else if (graph.direction === 'vertical') {
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
    document.removeEventListener('mousemove', dragCanvas);
    document.removeEventListener('mouseup', dropCanvas);
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
        let dnodex = dnode.x - coordx,
        dnodey =  dnode.y - coordy;
        dnode.x = dnodex < 0 ? 0 : dnodex - dnodex % gridWidth;
        dnode.y = dnodey < 0 ? 0 : dnodey - dnodey % gridWidth;
      }
    }
    let newDNode = new DNode(dnode, ctx);
    if (type === 'copy') {
      newDNode.reset();
      graph.cloneDNode = newDNode;
      newDNode.key = Guid();
      newDNode.move(graph.cloneDNode.x + gridWidth, graph.cloneDNode.y + gridWidth);
    }
    if (type === 'cmitem') {
      newDNode.x = opt.x;
      newDNode.y = opt.y;
    }
    initDNode(newDNode);
    dnodes ? dnodes.push(newDNode) : dnodes = [newDNode];
    dnodesMaps[newDNode.key] = newDNode;
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
    connectsMaps[parent.key] ? connectsMaps[parent.key].push(cp) : connectsMaps[parent.key] = [cp];
  };
  let createConnects = function (dnode) {
    let dn = dnode, 
    props = {
      ctx: ctx,
      parentNode: dnode,
      children: dnode.children,
    };
    if (graph.direction === 'vertical') {
      dn.top && createConnect(props, 'top');
      dn.bottom && createConnect(props, 'bottom');
    } else if (graph.direction === 'horizontal') {
      dn.left && createConnect(props, 'left');
      dn.right && createConnect(props, 'right');
    }
  };
  let changeConnectsDir = function () {
    connects.forEach((cp) => {
      if (graph.direction === 'vertical') {
        if (cp.position === 'left') {
          cp.setPosition('top');
        } else if (cp.position === 'right') {
          cp.setPosition('bottom');
        }
      } else if (graph.direction === 'horizontal') {
        if (cp.position === 'top') {
          cp.setPosition('left');
        } else if (cp.position === 'bottom') {
          cp.setPosition('right');
        }
      }
    })
  };
  let getConnects = function (dnode) {
    return (connectsMaps[dnode.key] || []).filter((cp) => cp.state);
  };
  let createPath = function (props) {
    let path = new Path(props);
    paths.push(path);
    let start = path.start,
    end = path.end;
    pathsMaps[start.key] ? pathsMaps[start.key].push(path) : pathsMaps[start.key] = [path];
    pathsMaps[end.key] ? pathsMaps[end.key].push(path) : pathsMaps[end.key] = [path];
  }
  let getPaths = function (cp) {
    return (pathsMaps[cp.key] || []).filter((p) => p.state);
  };
  let initDNode = function (dnode) {
    let downPoint = {},
    prevCoord = {},
    draging = false;
    dnode.init(graph.direction)
    
    dnode.cmenu.forEach((item) => {
      let sbdnode = graph.sbdnodes.maps[item.id];
      item.setText(sbdnode.text);
      item.setIcon(sbdnode.icon);
    })

    let select = function (e) {
      downPoint.x = e.clientX;
      downPoint.y = e.clientY;
      prevCoord.x = dnode.x;
      prevCoord.y = dnode.y;

      clearCanvasEvent();

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
      diagramDragLayer.style.cursor = 'move';
      dnode.enter();
      draw();
    }, { cancelBubble: true })
    kevent.addEvent(dnode, 'mousedown', select, { cancelBubble: true })
    kevent.addEvent(dnode, 'mouseleave', () => {
      diagramDragLayer.style.cursor = '-webkit-grab';
      dnode.leave();
      draw();
    })
    dnode.dblclick && kevent.addEvent(dnode, 'dblclick', (e) => {
      dnode.dblclick(e, dnode);
    })
    if (dnode.cmbutton) {
      kevent.addEvent(dnode.cmbutton, 'mouseenter', () => {
        diagramDragLayer.style.cursor = 'pointer';
      }, dnode)
      kevent.addEvent(dnode.cmbutton, 'mousedown', () => {
        dnode.showMenu();
        dnode.cmenu.forEach((item) => {
          initConnectsMenuItem(dnode, item);
        })
        draw();
      }, dnode)
      kevent.addEvent(dnode.cmbutton, 'mouseleave', () => {
        diagramDragLayer.style.cursor = '-webkit-grab';
      }, dnode)
    }
  };
  let initConnect = function (cp) {
    let downPoint = {};

    let begin = function (e) {
      tmpPath = new Path({
        ctx: ctx,
        start: cp, 
        dir: graph.direction
      });
      connecting = true;
      downPoint.x = e.pageX;
      downPoint.y = e.pageY;
      clearCanvasEvent();
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', close);
    }

    let move = function (e) {
      tmpPath.move(calcScale(e.pageX - clientRect.x - coordx), calcScale(e.pageY - clientRect.y - coordy));
      draw();
    }

    let close = function (e) {
      dragable = true;
      connecting = false;
      let connectPoint = checkConnect({ x: calcScale(e.pageX - clientRect.x - coordx), y: calcScale(e.pageY - clientRect.y - coordy) });
      if (connectPoint) {
        let parentNode = cp.parentNode, message = null;
        if (connectPoint.position === cp.position) {
          message = (cp.position === 'top' || cp.position === 'left') ? '需要连接节点开始位置' : '需要连接节点结束位置';
        } else if (parentNode.nochildren && ~parentNode.nochildren.indexOf(connectPoint.parentNode.id)) {
          message = parentNode.text + '节点不能连接' + parentNode.nochildren.map((id) => graph.sbdnodes.maps[id].text).join(',');
        } else if (cp.children && !~cp.children.indexOf(connectPoint.parentNode.id)) {
          message = parentNode.text + '节点只能连接' + parentNode.children.map((id) => graph.sbdnodes.maps[id].text).join(',');
        } else {
          tmpPath.closePath(connectPoint);
          createPath(tmpPath);
          saveState('add path');
        }
        message && graph.message({
          type: 'error',
          message: message,
        })
      }
      tmpPath = null;
      draw();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', close);
    }
    
    kevent.addEvent(cp, 'mouseenter', () => {
      diagramDragLayer.style.cursor = 'auto';
    })
    kevent.addEvent(cp, 'mousedown', begin, { cancelBubble: true })
    kevent.addEvent(cp, 'mouseleave', () => {
      diagramDragLayer.style.cursor = '-webkit-grab';
    })
  };
  let initConnectsMenuItem = function (dnode, cmitem) {
    kevent.addEvent(cmitem, 'mouseenter', () => {
      cmitem.enter();
      diagramDragLayer.style.cursor = 'pointer';
      draw();
    })
    kevent.addEvent(cmitem, 'mousedown', () => {
      cmitem.leave();
      graph.$trigger('insert', graph.sbdnodes.maps[cmitem.id], 'cmitem', (newDNode) => {
        createPath({
          ctx: ctx,
          start: getConnects(dnode).slice(-1)[0],
          end: getConnects(newDNode)[0],
          dir: graph.direction,
        })
        saveState('add path and dnode');
      }, graph.direction === 'vertical' ? { x: dnode.x, y: dnode.y + dnode.height + 60 } : { x: dnode.x + dnode.width + 60, y: dnode.y });
    })
    kevent.addEvent(cmitem, 'mouseleave', () => {
      cmitem.leave();
      diagramDragLayer.style.cursor = '-webkit-grab';
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
  let checkDiagramSize = function (dnode) {
    if (dnode.x > diagramWidth - dnode.width - 100) {
      dg.diagramWidth = diagramWidth = dnode.x + dnode.width + 100;
    }
    if (dnode.y > diagramHeight - 100) {
      diagramHeight = dnode.y + dnode.height + 100;
    }
  };
  let checkInsertAvailable = function (dnode) {
    let lastDNode = findLastDNode();
    dnode.x = graph.startX;
    dnode.y = graph.startY;
    if (lastDNode.y > 0) {
      dnode.y = lastDNode.y + dnode.height + 20;
    } else if (lastDNode.x > 0) {
      dnode.x = lastDNode.x + dnode.width + 20;
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

    graph.scale = state.scale;
    graph.$trigger('scalechanged');

    state.dnodes.map((dn) => createDNode(dn));

    state.connects.map((cp) => {
      cp.ctx = ctx;
      cp.parentNode = dnodesMaps[cp.parentNode.key];
      return createConnect(cp);
    });

    state.paths.map((p) => {
      p.ctx = ctx;
      p.start.parentNode = connectsMaps[p.start.parentNode.key];
      p.end.parentNode = connectsMaps[p.end.parentNode.key];
      return createPath(p);
    });

    diagramWidth = state.diagramWidth;
    diagramHeight = state.diagramHeight;
    coordx = state.coordx;
    coordy = state.coordy;
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
      coordx: coordx,
      coordy: coordy,
      gridWidth: gridWidth,
      gridAlign: gridAlign,
      scale: graph.scale
    });
    graph.ghistory.saveState(state);
    graph.updateToolbar();
  };
  let clear = function () {
    ctx.clearRect(0, 0, caWidth, caHeight);
  };
  let draw = function (type) {
    requestAnimationFrame(() => {
      clear();
      ctx.save();
      ctx.translate(coordx, coordy);
      ctx.scale(graph.scale, graph.scale);
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
      if (dnode.state) {
        dnode.draw();
        drawConnects(dnode);
      }
    })
  };
  let drawConnects = function (dnode) {
    getConnects(dnode).forEach((cp) => {
      if (cp.state) {
        connecting && cp.drawOutline();
        cp.draw(getPaths(cp).some((p) => p.state));
      }
    })
  };
  let drawConnectsMenu = function () {
    mapDNodes((dn) => {
      dn.isShowMenu && dn.cmenu.forEach((cm) => {
        cm.draw();
      })
    })
  };
  let drawPaths = function () {
    tmpPath && tmpPath.draw();
    paths.forEach((p) => {
      if (p && p.state) {
        p.connectPoints();
        p.draw();
      }
    })
  };
  let calcScale = function (n) {
    return n / graph.scale;
  };
  let scalechanged = function () {
    let newCoordx = caWidth - diagramWidth * graph.scale,
    newCoordy = caHeight - diagramHeight * graph.scale;

    coordx = newCoordx > 0 ? newCoordx / 2 : 0;
    coordy = newCoordy > 0 ? newCoordy / 2 : 0;

    kevent.setOffset(coordx, coordy);
    kevent.setScale(graph.scale);
  };
  init();
  Object.assign(dg, {
    diagramWidth,
    gridWidth,
    dnodes,
    paths,
    container,
    kevent,
    mapDNodes,
    selectDNode,
    initCanvas,
    resizeCanvas,
    createDNode,
    initDNode,
    updateDNodeEvt,
    createConnects,
    getConnects,
    changeConnectsDir,
    getPaths,
    delDNodeEvt,
    checkInsertAvailable,
    checkDiagramSize,
    scalechanged,
    saveState,
    restoreState,
    draw,
  })
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
    let isSelected = !!graph.selectedDNode;
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
      newElement({
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
  let container = document.createElement('div');
  container.className = 'kgraph-sidebar-container';
  let dnodes = { list: [], maps: {} }
  graph.sbdnodes = dnodes;
  let refs = {}
  let createSection = function (title, items) {
    let section = newElement({
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
  };
  let createItem = function (container, item) {
    let sectionItem = newElement({
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
    dnodes.maps[item.id] = item;
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
          item.x = e.clientX - graph.clientRect.x;
          item.y = e.clientY - graph.clientRect.y;
          graph.$trigger('insert', item, 'drag');
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
  };
  let createDRagDNode = function (item, x, y) {
    let dragDNode = newElement({
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
    newElement({
      tag: 'div',
      ref: 'diagramScale',
      props: { className: 'diagram-scale' },
      children: [{
        tag: 'div',
        props: { className: 'scale' },
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
    newElement({
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
      refs.fieldbar.className = 'graph-mode horizontal';
    })
    refs.option2.addEventListener('click', () => {
      graph.$trigger('changeDir', 'vertical');
      refs.fieldbar.className = 'graph-mode vertical';
    })
    container.append(refs.fieldbar);
  }
  let scalechanged = function (scale) {
    refs.scaleValue.innerHTML = scale * 100 + '%';
    refs.scaleBar.style.width = scale / 2 * 100 + '%';
  }
  init();
  return {
    container: container,
    scalechanged: scalechanged
  }
}
const KGraph = function (id) {
  let kg = this, 
  fragment = document.createDocumentFragment(), 
  container = document.getElementById(id),
  diagram, toolbar, sidebar, format, footer;
  let graph = {};
  let init = function () {
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
    diagram.initCanvas();
    toolbar.updateTools();
  }
  let resize = function () {
    diagram.resizeCanvas();
  }
  let configGraph = function () {
    graph = {
      selectedDNode: null, // 当前选中的DNode
      cloneDNode: null, // 已复制的DNode
      startX: 60, // 开始横坐标
      startY: 60, // 开始纵坐标
      scale: 1, // 缩放比例
      direction: 'vertical', // 流程走向;
      updateToolbar: function () {
        // 更新工具栏
        toolbar.updateTools();
      },
      updateFormat: function () {
        // 更新格式栏
        // format.switchFormat();
      },
      updateDiagram: function () {
        // 更新图表
        diagram.draw();
      },
      message: function (options) {
        alert(options.message);
      },
      ghistory: new KGraphHistory()
    }

    kg.graph = graph;

    KGEvent.call(kg);
  }
  let createDiagram = function () {
    diagram = new Diagram(graph);
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