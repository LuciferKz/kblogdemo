const drawArrow = function (ctx, points, style) {
  _drawArrow(ctx, points, style)
}

export const getArrowPoints = function (points, style) {
  let fromX = points[0].x;
  let fromY = points[0].y;
  let toX = points[1].x;
  let toY = points[1].y;
  let theta = style.theta || 30;
  let headlen = style.headlen || 10;
  // 计算各角度和对应的P2,P3坐标

  let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
  let angle1 = (angle + theta) * Math.PI / 180;
  let angle2 = (angle - theta) * Math.PI / 180;
  let topX = toX + headlen * Math.cos(angle1);
  let topY = toY + headlen * Math.sin(angle1);
  let botX = toX + headlen * Math.cos(angle2);
  let botY = toY + headlen * Math.sin(angle2);

  // 斜边
  const hypotenuselen = headlen * Math.cos(theta * Math.PI / 180)
  const midX = toX + hypotenuselen * Math.cos(angle * Math.PI / 180)
  const midY = toY + hypotenuselen * Math.sin(angle * Math.PI / 180)

  // console.log(midX, midY, toX)

  return {
    mid: { x: midX, y: midY },
    top: { x: topX, y: topY },
    bot: { x: botX, y: botY },
    to: { x: toX, y: toY }
  }
}

function _drawArrow(ctx, points, style) {
  let width = style.lineWidth || 1;
  let color = style.color || '#000';
  let fill = style.fill
  
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points.top.x, points.top.y);
  ctx.lineTo(points.to.x, points.to.y);
  ctx.lineTo(points.bot.x, points.bot.y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (fill) {
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.restore();
}

export default drawArrow