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

Path.prototype.draw = function () {
  let p = this, ctx = p.ctx;
  ctx.beginPath();
  ctx.strokeStyle = '#a0d1e1';
  p.points.forEach((pt, idx) => {
    idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
  })
  ctx.stroke();
}

Path.prototype.closePath = function (cp) {
  let p = this;
  if (p.start) {
    p.end = cp;
  } else if (p.end) {
    p.start = cp;
  }
}

Path.prototype.move = function (x, y) {
  let p = this;
  if (p.start) {
    p.createPoints({x: p.start.cx, y: p.start.cy}, {x: x, y: y});
  } else if (p.end) {
    p.createPoints({x: x, y: y}, {x: p.end.cx, y: p.end.cy});
  }
}

Path.prototype.connectPoints = function () {
  let p = this, 
  start = {x: p.start.cx, y: p.start.cy}, 
  end = {x: p.end.cx, y: p.end.cy};
  p.createPoints(start, end);
}

Path.prototype.createPoints = function (start, end) {
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
}

export default Path