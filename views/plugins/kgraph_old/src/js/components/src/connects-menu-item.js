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

export default ConnectsMenuItem