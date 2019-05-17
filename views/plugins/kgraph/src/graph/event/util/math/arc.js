import vec2 from '../vec2'
import Util from '../../../../util'

const angleNearTo = function (angle, min, max, out) {
  let v1;
  let v2;
  if (out) {
    if (angle < min) {
      v1 = min - angle;
      v2 = Math.PI * 2 - max + angle;
    } else if (angle > max) {
      v1 = Math.PI * 2 - angle + min;
      v2 = angle - max;
    }
  } else {
    v1 = angle - min;
    v2 = max - angle;
  }

  return v1 > v2 ? max : min;
}

const nearAngle = function (angle, startAngle, endAngle, clockwise) {
  let plus = 0;
  if (endAngle - startAngle >= Math.PI * 2) {
    plus = Math.PI * 2;
  }
  startAngle = Util.mod(startAngle, Math.PI * 2);
  endAngle = Util.mod(endAngle, Math.PI * 2) + plus;
  angle = Util.mod(angle, Math.PI * 2);
  if (clockwise) {
    if (startAngle >= endAngle) {
      if (angle > endAngle && angle < startAngle) {
        return angle;
      }
      return angleNearTo(angle, endAngle, startAngle, true);
    }
    if (angle < startAngle || angle > endAngle) {
      return angle;
    }
    return angleNearTo(angle, startAngle, endAngle);
  }
  if (startAngle <= endAngle) {
    if (startAngle < angle && angle < endAngle) {
      return angle;
    }
    return angleNearTo(angle, startAngle, endAngle, true);
  }
  if (angle > startAngle || angle < endAngle) {
    return angle;
  }
  return angleNearTo(angle, endAngle, startAngle);
}

const arcProjectPoint = function (cx, cy, r, startAngle, endAngle, clockwise, x, y, out) {
  const v = [ x, y ];
  const v0 = [ cx, cy ];
  const v1 = [ 1, 0 ];
  const subv = vec2.subtract([], v, v0);
  let angle = vec2.angleTo(v1, subv);

  angle = nearAngle(angle, startAngle, endAngle, clockwise);
  const vpoint = [ r * Math.cos(angle) + cx, r * Math.sin(angle) + cy ];
  if (out) {
    out.x = vpoint[0];
    out.y = vpoint[1];
  }
  const d = vec2.distance(vpoint, v);
  return d;
}

export default {
  pointDistance: arcProjectPoint
}