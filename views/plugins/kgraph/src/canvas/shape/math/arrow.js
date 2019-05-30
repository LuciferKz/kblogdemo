const drawArrow = function (ctx, points, style) {
  _drawArrow(ctx, points[0].x, points[0].y, points[1].x, points[1].y, 30, 20, style.lineWidth, style.color)
}

function _drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {
 
  theta = typeof(theta) != 'undefined' ? theta : 30;
  headlen = typeof(theta) != 'undefined' ? headlen : 10;
  width = typeof(width) != 'undefined' ? width : 1;
  color = typeof(color) != 'color' ? color : '#000';

  // 计算各角度和对应的P2,P3坐标
  var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
      angle1 = (angle + theta) * Math.PI / 180,
      angle2 = (angle - theta) * Math.PI / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2);

  ctx.save();
  ctx.beginPath();

  var arrowX = fromX - topX,
      arrowY = fromY - topY;

  ctx.moveTo(arrowX, arrowY);
  // ctx.moveTo(fromX, fromY);
  // ctx.lineTo(toX, toY);
  arrowX = toX + topX;
  arrowY = toY + topY;
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(toX, toY);
  arrowX = toX + botX;
  arrowY = toY + botY;
  ctx.lineTo(arrowX, arrowY);
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default drawArrow