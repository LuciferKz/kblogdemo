// 获取起始锚点处于节点的哪个位置
export const inDirection = function(m = []) {
  let m1 = +m[0].toFixed(1);
  let m2 = +m[1].toFixed(1);

  if (
    m1 < 0.5 &&
    (m2 === 0.5 || (m2 < 0.5 && m2 - m1 >= 0) || (m2 > 0.5 && m2 + m1 <= 1))
  ) {
    return "left";
  } else if (
    m1 > 0.5 &&
    (m2 === 0.5 || (m2 < 0.5 && m1 + m2 >= 1) || (m2 > 0.5 && m1 - m2 >= 0))
  ) {
    return "right";
  } else if (
    m2 < 0.5 &&
    (m1 === 0.5 || (m1 < 0.5 && m1 - m2 >= 0) || (m1 > 0.5 && m1 + m2 <= 1))
  ) {
    return "top";
  } else if (
    m2 > 0.5 &&
    (m1 === 0.5 || (m1 < 0.5 && m1 + m2 >= 1) || (m1 > 0.5 && m2 - m1 >= 0))
  ) {
    return "bottom";
  }

  return false;
};

// 获取第一个偏移点
const getOffsetPoint = function(p, dir, offset = 20) {
  let point = {};
  let px = p.x;
  let py = p.y;

  // 根据起始点所在的方位往外偏移
  if (dir === "top") {
    point = { x: px, y: py - offset };
  } else if (dir === "bottom") {
    point = { x: px, y: py + offset };
  } else if (dir === "left") {
    point = { x: px - offset, y: py };
  } else if (dir === "right") {
    point = { x: px + offset, y: py };
  }

  return point;
};

const inQuadrant = function(sp, ep) {
  let sx = sp.x;
  let sy = sp.y;
  let ex = ep.x;
  let ey = ep.y;
  let offset = 0;

  // sx < ex 则 sx - ex < 0 反之则 sx - ex > 0

  let diffX = sx - ex;
  let diffY = sy - ey;

  if (diffX < -offset) {
    if (diffY > offset) {
      return 1;
    } else if (diffY < -offset) {
      return 4;
    } else {
      return 5;
    }
  } else if (diffX > offset) {
    if (diffY > offset) {
      return 2;
    } else if (diffY < -offset) {
      return 3;
    } else {
      return 5;
    }
  } else {
    return 6;
  }
};

const setQuadrantPoints = function(points, sp, sdir, ep, edir) {
  const quadrant = inQuadrant(sp, ep);
  const sx = sp.x;
  const sy = sp.y;
  const ex = ep.x;
  const ey = ep.y;

  if (sdir === "left") {
    if (quadrant === 1) {
      if (edir === "left") {
        points.push({ x: sx, y: ey });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    } else if (quadrant === 2) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      } else if (edir === "bottom") {
        points.push({ x: ex, y: sy });
      }
    } else if (quadrant === 3) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: ex, y: sy });
      } else if (edir === "right") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    } else if (quadrant === 4) {
      if (edir === "left") {
        points.push({ x: sx, y: ey });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    }
  } else if (sdir === "top") {
    if (quadrant === 1) {
      if (edir === "left") {
        points.push({ x: sx, y: ey });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      }
    } else if (quadrant === 2) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: sx, y: ey });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      }
    } else if (quadrant === 3) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: ex, y: sy });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      }
    } else if (quadrant === 4) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: ex, y: sy });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      }
    }
  } else if (sdir === "right") {
    if (quadrant === 1) {
      if (edir === "left") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: ex, y: sy });
      }
    } else if (quadrant === 2) {
      if (edir === "left") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: sx, y: ey });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    } else if (quadrant === 3) {
      if (edir === "left") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey });
      } else if (edir === "right") {
        points.push({ x: sx, y: ey });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    } else if (quadrant === 4) {
      if (edir === "left") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      } else if (edir === "top") {
        points.push({ x: ex, y: sy });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    }
  } else if (sdir === "bottom") {
    if (quadrant === 1) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: ex, y: sy });
      }
    } else if (quadrant === 2) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: ex + (sx - ex) / 2, y: sy });
        points.push({ x: ex + (sx - ex) / 2, y: ey });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: ex, y: sy });
      }
    } else if (quadrant === 3) {
      if (edir === "left") {
        points.push({ x: ex, y: sy });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      } else if (edir === "right") {
        points.push({ x: sx, y: ey });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    } else if (quadrant === 4) {
      if (edir === "left") {
        points.push({ x: sx, y: ey });
      } else if (edir === "top") {
        points.push({ x: sx, y: ey + (sy - ey) / 2 });
        points.push({ x: ex, y: ey + (sy - ey) / 2 });
      } else if (edir === "right") {
        points.push({ x: ex, y: sy });
      } else if (edir === "bottom") {
        points.push({ x: sx, y: ey });
      }
    }
  }
};

// 获取节点与节点之间的连线
export const getPointsBetweenAA = function({ sa, sm, ea, em, sp, ep }, edge) {
  let sx = sp.x;
  let sy = sp.y;
  let ex = ep.x;
  let ey = ep.y;

  let points = [{ x: sx, y: sy }];
  const sdir = sa ? sa.get("dir") : inDirection(sm);
  const edir = ea ? ea.get("dir") : inDirection(em);

  const saOffset = (sa && sa.get("edgeOffset")) || edge.get("saOffset") || 30;
  const taOffset = (sa && sa.get("edgeOffset")) || edge.get("taOffset") || 30;
  const sop = getOffsetPoint(sp, sdir, saOffset);
  const eop = getOffsetPoint(ep, edir, taOffset);

  points.push(sop);
  setQuadrantPoints(points, sop, sdir, eop, edir);
  points.push(eop);

  // 结束点
  points.push({ x: ex, y: ey });

  return points;
};

// 获取节点与点之间的连线 必填项 sp 开始点 ep 结束点 sm 开始锚点 options一些可选配置
export const getPointsBetweenAP = function({ sa, sm, sp, ep }, edge) {
  let sx = sp.x;
  let sy = sp.y;
  let ex = ep.x;
  let ey = ep.y;

  let points = [{ x: sx, y: sy }];
  const sdir = sa ? sa.get("dir") : inDirection(sm);

  // 开始点的偏移点
  const sop = getOffsetPoint(sp, sdir, sa ? sa.get("edgeOffset") : 30);
  // 第一个偏移点
  // points.push(sop)

  const maxX = sop.x > ex ? sop.x : ex;
  const minX = sop.x < ex ? sop.x : ex;
  const maxY = sop.y > ey ? sop.y : ey;
  const minY = sop.y < ey ? sop.y : ey;

  if (sdir === "top") {
    if (Math.abs(ex - sop.x) < 15) {
      points.push({ x: sop.x, y: ey });
      return points;
    }

    points.push({ x: sop.x, y: minY });

    if (sop.y === minY) {
      points.push({ x: ex, y: minY });
    }
  } else if (sdir === "bottom") {
    if (Math.abs(ex - sop.x) < 15) {
      points.push({ x: sop.x, y: ey });
      return points;
    }

    points.push({ x: sop.x, y: maxY });

    if (sop.y === maxY) {
      points.push({ x: ex, y: maxY });
    }
  } else if (sdir === "left") {
    if (Math.abs(ey - sop.y) < 15) {
      points.push({ x: ex, y: sop.y });
      return points;
    }

    points.push({ x: minX, y: sop.y });

    if (sop.x === minX) {
      points.push({ x: minX, y: ey });
    }
  } else if (sdir === "right") {
    if (Math.abs(ey - sop.y) < 15) {
      points.push({ x: ex, y: sop.y });
      return points;
    }

    points.push({ x: maxX, y: sop.y });

    if (sop.x === maxX) {
      points.push({ x: maxX, y: ey });
    }
  }
  points.push({ x: ex, y: ey });

  return points;
};
