const _drawRound = function (ctx, points, r = 5) {
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1, len = points.length; i < len; i++) {
    let p1 = points[i];
    let p2 = points[i + 1];
    if (!p2) p2 = points[0];
    ctx.arcTo(p1.x, p1.y, p2.x, p2.y, r);
  }
}

const drawRound = function (ctx, points, r) {
  _drawRound(ctx, points, r)
}

export default drawRound