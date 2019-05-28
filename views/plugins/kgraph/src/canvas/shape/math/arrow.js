// function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
//   var theta = theta || 30,
//       headlen = headlen || 10,
//       width = width || 1,
//       color = color || '#000',
//       angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
//       angle1 = (angle + theta) * Math.PI / 180,
//       angle2 = (angle - theta) * Math.PI / 180,
//       topX = headlen * Math.cos(angle1),
//       topY = headlen * Math.sin(angle1),
//       botX = headlen * Math.cos(angle2),
//       botY = headlen * Math.sin(angle2);
  
//   ctx.save();
//   ctx.beginPath();
//   var arrowX, arrowY;
//   ctx.moveTo(fromX, fromY);
//   ctx.lineTo(toX, toY);
//   arrowX = toX + topX;
//   arrowY = toY + topY;
//   ctx.moveTo(arrowX, arrowY);
//   ctx.lineTo(toX, toY);
//   arrowX = toX + botX;
//   arrowY = toY + botY;
//   ctx.lineTo(arrowX, arrowY);
//   ctx.strokeStyle = color;
//   ctx.lineWidth = width;
//   ctx.stroke();
//   ctx.restore();
// }

const drawArrow = function (ctx, points, style) {
  // let from = points[0]
  // let to = points[1]
  // let x = to.x;
  // let y = to.y;
  // let theta = style.theta || 90;
  // let headlen = style.headlen || 10;
  // let angle = Math.atan2(from.y - x, from.x - y) * 180 / Math.PI;
  // let angle1 = (angle + theta) * Math.PI / 180;
  // let angle2 = (angle - theta) * Math.PI / 180;
  // let topX = headlen * Math.cos(angle1);
  // let topY = headlen * Math.sin(angle1);
  // let btmX = headlen * Math.cos(angle2);
  // let btmY = headlen * Math.sin(angle2);
  // let arrowX;
  // let arrowY;
  
  // // ctx.lineTo(x, y)
  // ctx.save()
  // ctx.beginPath()
  // ctx.lineWidth = 1
  // arrowX = x + topX;
  // arrowY = y + topY;
  // ctx.moveTo(arrowX, arrowY);
  // ctx.lineTo(x, y);
  // arrowX = x + btmX
  // arrowX = x + btmY
  // ctx.lineTo(arrowX, arrowY);
  // ctx.stroke()
  // ctx.restore()
  _drawArrow(ctx, points[0].x, points[0].y, points[1].x, points[1].y, 30, 20, style.lineWidth, style.color)
}

function _drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
 
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