import vec2 from '../vec2'

const line = {
  box(x1, y1, x2, y2, lineWidth) {
    const halfWidth = lineWidth / 2;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return {
      minX: minX - halfWidth,
      minY: minY - halfWidth,
      maxX: maxX + halfWidth,
      maxY: maxY + halfWidth
    };
  },
  pointDistance(x1, y1, x2, y2, x, y) {
    const d = [ x2 - x1, y2 - y1 ];
    if (vec2.exactEquals(d, [ 0, 0 ])) {
      return NaN;
    }

    const u = [ -d[1], d[0] ];
    vec2.normalize(u, u);
    const a = [ x - x1, y - y1 ];
    return Math.abs(vec2.dot(a, u));
  }
}

export default line