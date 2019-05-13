const Rect = function () {

}

Rect.prototype.draw = function () {
  let dn = this;
  ctx.save();
  ctx.fillStyle = dn.bgColor;
  ctx.fillRect(dn.x, dn.y, dn.width, dn.height);
  ctx.fillStyle = dn.isEdited === false ? '#999' : dn.borderColor;
  ctx.fillRect(dn.x, dn.y, 6, dn.height);
  ctx.restore();
}

const proto = {
  cfg: {
    style: {
      width: 100,
      height: 50
    }
  }
}

// 'lt-tp', 'lt-btm', 'rt-tp', 'rt-btm'

Rect.prototype.proto = Rect

export default Rect