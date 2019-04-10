const DNode = function (dnode) {
  let dn = this;
  dn.id = kutil.guid();
  dn.state = 1;
  kutil.extend(dn, dnode);
  dn.isShowCMButton = true;
  dn.isShowMenu = false;
  dn.cmenu = [];
}
DNode.prototype = {
  borderColor: '#007fb1',
  bgColor: '#fff',
  textColor: '#333',
  iconColor: '#007fb1',
  top: true,
  left: true,
  bottom: true,
  right: true,
  init: function (dir) {
    let dn = this;
    dn.dir = dir;
    dn.reset();
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
    dn.cmbutton && dn.isShowCMButton && dn.cmbutton.draw();
    (dn.entering || dn.grabing || dn.focusing) && dn.drawOutline(dn.ctx);
    dn.grabing && dn.drawDragDNode(dn.ctx);
  },
  drawRect: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.fillStyle = dn.bgColor;
    ctx.fillRect(dn.x, dn.y, dn.width, dn.height);
    ctx.fillStyle = dn.isEdited === false ? '#999' : dn.borderColor;
    ctx.fillRect(dn.x, dn.y, 6, dn.height);
    ctx.restore();
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
    ctx.font = 'bold 12px 黑体';
    ctx.fillStyle = dn.isEdited === false ? '#999' : dn.textColor;
    let textY = dn.remark ? 12 : dn.height / 2
    ctx.fillText(dn.text, dn.x + 35, dn.y + textY);
    if (dn.remark) {
      let remarkY = 30;
      ctx.font = '10px 黑体';
      ctx.fillText(dn.remark, dn.x + 35, dn.y + remarkY);
    }
    ctx.restore();
  },
  drawIcon: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = '16px iconfont';
    ctx.fillStyle = dn.isEdited === false ? '#999' : dn.iconColor;
    let iconY = dn.remark ? 12 : dn.height / 2
    ctx.fillText(dn.icon, dn.x + 14, dn.y + iconY);
    ctx.restore();
  },
  drawOutline: function (ctx) {
    let dn = this;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = dn.isEdited === false ? '#999' : dn.borderColor;
    ctx.strokeRect(dn.x - 5, dn.y - 8, dn.width + 10, dn.height + 16);
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
  remove: function () {
    this.state = 0;
  },
  drop: function () {
    let dn = this;
    dn.grabing = false;
    dn.x = dn.dragDNode.x;
    dn.y = dn.dragDNode.y;
    dn.cmbutton && dn.cmbutton.follow(dn);
    dn.dragDNode = null;
    dn.cmenuOffsetX = 0;
    dn.cmenuOffsetY = 0;
    dn.cmenu.forEach((item) => {
      item.follow(dn, 'drop');
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
  },
  getPoint: function (x, y) {
    return { x: x, y: y };
  },
  showMenu: function () {
    this.isShowMenu = true;
  },
  showCMButton: function () {
    this.isShowCMButton = true;
  },
  hideCMButton: function () {
    this.isShowCMButton = false;
  }
}
const ConnectsMenuItem = function (key, idx) {
  let cm = this;
  cm.id = kutil.guid();
  cm.key = key;
  cm.idx = idx;
}
ConnectsMenuItem.prototype = {
  r: 15,
  width: 30,
  height: 30,
  init: function (dn) {
    // let cm = this;
    // cm.follow(dn, 'init');
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
  follow: function (dn, from) {
    let cm = this, 
    idx = cm.idx,
    cmlen = dn.cmenu.length,
    offsetx = dn.cmenuOffsetX || 0,
    offsety = dn.cmenuOffsetY || 0,
    x, y;

    if (dn.dir === 'vertical') {
      x = dn.x + dn.width / 2 + offsetx;
      y = dn.y + dn.height + 20 + offsety;
      if (cmlen % 2) {
        x += [-1, 1][idx % 2] * Math.ceil(idx / 2) * 45 - 15;
      } else {
        x += [-1, 1][idx % 2] * (Math.ceil((idx + 1) / 2) * 15 + ((1 ^ idx % 2) + Math.floor(idx / 2)) * 30) - [-1, 1][idx % 2] * 15 / 2;
      }
    } else if (dn.dir === 'horizontal') {
      x = dn.x + dn.width + 40 + offsetx;
      y = dn.y + dn.height / 2 + offsety;
      if (cmlen % 2) {
        y += [-1, 1][idx % 2] * Math.ceil(idx / 2) * 45 - 15;
      } else {
        y += [-1, 1][idx % 2] * (Math.ceil((idx + 1) / 2) * 15 + ((1 ^ idx % 2) + Math.floor(idx / 2)) * 30) - [-1, 1][idx % 2] * 15 / 2;
      }
    }
    
    // console.log(from, dn, cm.key, x, y);

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
}
ConnectsMenuButton.prototype = {
  width: 12,
  height: 12,
  r: 6,
  init: function (dnode) {
    let cmb = this;
    cmb.follow(dnode);
    cmb.status = dnode.nextSiblings.length > 0 ? 1 : 0;
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
    cmb.cx = dnode.x + 120;
    cmb.cy = dnode.y + dnode.height / 2;
    cmb.x = cmb.cx - cmb.r;
    cmb.y = cmb.cy - cmb.r;
  }
}
const ConnectPoint = function (props) {
  let cp = this;
  cp.id = kutil.guid();
  cp.parentNode = null;
  cp.state = 1;
  cp.connected = false;
  kutil.extend(cp, props);
  cp.type = cp.position === 'left' || cp.position === 'top' ? 'start' : 'end';
}
ConnectPoint.prototype = {
  width: 24,
  height: 24,
  r: 4,
  outlineR: 12,
  borderColor: '#007fb1',
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
  draw: function () {
    let cp = this, ctx = cp.ctx;
    ctx.save();
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = 1;

    ctx.beginPath();
    cp.connected ? ctx.fillStyle = this.borderColor : ctx.fillStyle = '#FFFFFF';
    ctx.arc(cp.cx, cp.cy, cp.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
  remove: function () {
    this.state = 0;
  },
  connect: function () {
    this.connected = true;
  },
  disConnect: function () {
    this.connected = false;
  },
  isConnectable: function () {
    return !this.connected || this.parentNode.connectRule === 'multiple'
  }
}
const Path = function (props) {
  let p = this;
  p.id = kutil.guid();
  p.dir = 'vertical';
  p.state = 1;
  kutil.extend(p, props)
  p.points = [];
  p.start = props.start;
  p.end = props.end;
}
Path.prototype = {
  closePath: function (cp) {
    let p = this;
    if (p.start) {
      p.end = cp;
    } else if (p.end) {
      p.start = cp;
    }
  },
  move: function (x, y) {
    let p = this;
    if (p.start) {
      p.createPoints({x: p.start.cx, y: p.start.cy}, {x: x, y: y});
    } else if (p.end) {
      p.createPoints({x: x, y: y}, {x: p.end.cx, y: p.end.cy});
    }
  },
  connectPoints: function () {
    let p = this, 
    start = {x: p.start.cx, y: p.start.cy}, 
    end = {x: p.end.cx, y: p.end.cy};
    p.createPoints(start, end);
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

export {
  DNode,
  Path,
  ConnectPoint,
  ConnectsMenuItem,
  ConnectsMenuButton,
}