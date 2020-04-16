const vec2 = {}

const clamp = function (a, min, max) {
  if (a < min) {
    return min;
  } else if (a > max) {
    return max;
  }
  return a;
}

vec2.length = function (a) {
  var x = a[0],
    y = a[1];
  return Math.sqrt(x*x + y*y);
};

vec2.dot = function (a, b) {
  return a[0] * b[0] + a[1] * b[1];
};

vec2.angle = function (v1, v2) {
  const theta = vec2.dot(v1, v2) / (vec2.length(v1) * vec2.length(v2));
  return Math.acos(clamp(theta, -1, 1));
};

vec2.direction = function (v1, v2) {
  return v1[0] * v2[1] - v2[0] * v1[1];
};

vec2.angleTo = function (v1, v2, direct) {
  const angle = vec2.angle(v1, v2);
  const angleLargeThanPI = vec2.direction(v1, v2) >= 0;
  if (direct) {
    if (angleLargeThanPI) {
      return Math.PI * 2 - angle;
    }

    return angle;
  }

  if (angleLargeThanPI) {
    return angle;
  }
  return Math.PI * 2 - angle;
};

vec2.vertical = function (out, v, flag) {
  if (flag) {
    out[0] = v[1];
    out[1] = -1 * v[0];
  } else {
    out[0] = -1 * v[1];
    out[1] = v[0];
  }

  return out;
};

vec2.exactEquals = function (a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

vec2.normalize = function (out, a) {
  var x = a[0],
    y = a[1];
  var len = x*x + y*y;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
}

vec2.squaredDistance = function (a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return x*x + y*y;
}

vec2.subtract = function (out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

vec2.distance = function (a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return Math.sqrt(x*x + y*y);
}

module.exports = vec2;