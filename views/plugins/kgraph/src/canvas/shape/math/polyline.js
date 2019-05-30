const drawPolyline = function (ctx, points) {
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1, len = points.length; i < len; i++) {
    // if (i === len - 1) break;
    ctx.lineTo(points[i].x, points[i].y)
  }
}

export default drawPolyline;