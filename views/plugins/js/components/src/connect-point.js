const ConnectPoint = function (props) {
  let cp = this;
  cp.id = kutil.guid();
  cp.parentNode = null;
  cp.state = 1;
  cp.connected = false;
  kutil.extend(cp, props);
  cp.type = cp.position === 'left' || cp.position === 'top' ? 'start' : 'end';
}

ConnectPoint.prototype.width = 24
ConnectPoint.prototype.height = 24
ConnectPoint.prototype.r = 4
ConnectPoint.prototype.outlineR = 12
ConnectPoint.prototype.borderColor = '#007fb1'

ConnectPoint.prototype.init = function () {
  let cp = this;
  cp.follow();
}
ConnectPoint.prototype.follow = function () {
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
}
ConnectPoint.prototype.setPosition = function (pos) {
  let cp = this;
  cp.position = pos;
  cp.follow();
}
ConnectPoint.prototype.drawOutline = function () {
  let cp = this, ctx = cp.ctx;
  ctx.save();
  ctx.strokeStyle = '#c5e3ff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.fillStyle = '#c5e3ff';
  ctx.arc(cp.cx, cp.cy, cp.outlineR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
ConnectPoint.prototype.draw = function () {
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
}
ConnectPoint.prototype.remove = function () {
  this.state = 0;
}
ConnectPoint.prototype.connect = function () {
  this.connected = true;
}
ConnectPoint.prototype.disConnect = function () {
  this.connected = false;
}
ConnectPoint.prototype.isConnectable = function () {
  return !this.connected || this.parentNode.connectRule === 'multiple'
}

export default ConnectPoint