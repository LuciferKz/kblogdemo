const DNode = function (dnode) {
  let dn = this;
  dn.id = kutil.guid();
  dn.state = 1;
  kutil.extend(dn, dnode);
  dn.isShowCMButton = true;
  dn.isShowMenu = false;
  dn.cmenu = [];
}

DNode.prototype.borderColor = '#007fb1'
DNode.prototype.bgColor = '#fff'
DNode.prototype.textColor = '#333'
DNode.prototype.iconColor = '#007fb1'

DNode.prototype.top = true
DNode.prototype.left = true
DNode.prototype.bottom = true
DNode.prototype.right = true

DNode.prototype.init = function (dir) {
  let dn = this;
  dn.dir = dir;
  dn.reset();
  dn.textY = dn.height / 2
  dn.iconY = dn.height / 2
}

DNode.prototype.reset = function () {
  let dn = this;
  dn.focusing = false;
  dn.entering = false;
  dn.grabing = false;
}

DNode.prototype.draw = function () {
  let dn = this;
  dn.drawRect(dn.ctx);
  dn.drawText(dn.ctx);
  dn.drawIcon(dn.ctx);
  dn.cmbutton && dn.isShowCMButton && dn.cmbutton.draw();
  (dn.entering || dn.grabing || dn.focusing) && dn.drawOutline(dn.ctx);
  dn.grabing && dn.drawDragDNode(dn.ctx);
}

DNode.prototype.drawRect = function (ctx) {
  let dn = this;
  ctx.save();
  ctx.fillStyle = dn.bgColor;
  ctx.fillRect(dn.x, dn.y, dn.width, dn.height);
  ctx.fillStyle = dn.isEdited === false ? '#999' : dn.borderColor;
  ctx.fillRect(dn.x, dn.y, 6, dn.height);
  ctx.restore();
}
DNode.prototype.drawRoundedRect = function (r){
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
}
DNode.prototype.drawText = function (ctx) {
  let dn = this;
  ctx.save();
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 12px 黑体';
  ctx.fillStyle = dn.isEdited === false ? '#999' : dn.textColor;
  ctx.fillText(dn.text, dn.x + 35, dn.y + dn.textY);
  ctx.restore();
}
DNode.prototype.drawIcon = function (ctx) {
  let dn = this;
  ctx.save();
  ctx.textBaseline = 'middle';
  ctx.font = '16px iconfont';
  ctx.fillStyle = dn.isEdited === false ? '#999' : dn.iconColor;
  ctx.fillText(dn.icon, dn.x + 14, dn.y + dn.iconY);
  ctx.restore();
}
DNode.prototype.drawOutline = function (ctx) {
  let dn = this;
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = dn.isEdited === false ? '#999' : dn.borderColor;
  ctx.strokeRect(dn.x - 5, dn.y - 8, dn.width + 10, dn.height + 16);
  ctx.restore();
}
DNode.prototype.focus = function () {
  this.focusing = true;
}
DNode.prototype.blur = function () {
  this.focusing = false;
  this.isShowMenu = false;
}
DNode.prototype.enter = function () {
  this.entering = true;
}
DNode.prototype.leave = function () {
  this.entering = false;
}
DNode.prototype.remove = function () {
  this.state = 0;
}
DNode.prototype.drop = function () {
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
}
DNode.prototype.move = function (x, y) {
  let dn = this;
  dn.x = x;
  dn.y = y;
}
DNode.prototype.drag = function () {
  let dn = this;
  dn.grabing = dn;
  dn.dragDNode = { x: dn.x, y: dn.y }
}
DNode.prototype.moveDragDNode = function (x, y) {
  let dn = this;

  if (x < 0) { x = 0; }
  if (y < 0) { y = 0; }

  dn.dragDNode.x = x;
  dn.dragDNode.y = y;
}
DNode.prototype.drawDragDNode = function (ctx) {
  let dn = this;
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#333';
  ctx.strokeRect(dn.dragDNode.x, dn.dragDNode.y, dn.width, dn.height);
  ctx.restore();
}
DNode.prototype.getPoint = function (x, y) {
  return { x: x, y: y };
}
DNode.prototype.showMenu = function () {
  this.isShowMenu = true;
}
DNode.prototype.showCMButton = function () {
  this.isShowCMButton = true;
}

DNode.prototype.hideCMButton = function () {
  this.isShowCMButton = false;
}

export default DNode