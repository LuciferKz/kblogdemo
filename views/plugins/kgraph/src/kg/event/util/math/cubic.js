import vec2 from '../vec2'

const cubicAt = function (p0, p1, p2, p3, t) {
  const onet = 1 - t;
  return onet * onet * (onet * p3 + 3 * t * p2) + t * t * (t * p0 + 3 * onet * p1);
}

const cubicProjectPoint = function (x1, y1, x2, y2, x3, y3, x4, y4, x, y, out) {
  let t;
  let interval = 0.005;
  let d = Infinity;
  let _t;
  let v1;
  let d1;
  let d2;
  let v2;
  let prev;
  let next;
  const EPSILON = 0.0001;
  const v0 = [ x, y ];

  for (_t = 0; _t < 1; _t += 0.05) {
    v1 = [
      cubicAt(x1, x2, x3, x4, _t),
      cubicAt(y1, y2, y3, y4, _t)
    ];

    d1 = vec2.squaredDistance(v0, v1);
    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }
  d = Infinity;

  for (let i = 0; i < 32; i++) {
    if (interval < EPSILON) {
      break;
    }

    prev = t - interval;
    next = t + interval;

    v1 = [
      cubicAt(x1, x2, x3, x4, prev),
      cubicAt(y1, y2, y3, y4, prev)
    ];

    d1 = vec2.squaredDistance(v0, v1);


    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      v2 = [
        cubicAt(x1, x2, x3, x4, next),
        cubicAt(y1, y2, y3, y4, next)
      ];

      d2 = vec2.squaredDistance(v0, v2);

      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  }

  if (out) {
    out.x = cubicAt(x1, x2, x3, x4, t);
    out.y = cubicAt(y1, y2, y3, y4, t);
  }

  return Math.sqrt(d);
}

export default {
  pointDistance: cubicProjectPoint
}