// 获取起始锚点处于节点的哪个位置
export const inDirection = function (m = []) {
  let m1 = +m[0].toFixed(1)
  let m2 = +m[1].toFixed(1)

  if (m1 < 0.5 && (m2 === 0.5 || (m2 < 0.5 && m2 - m1 >= 0) || (m2 > 0.5 && m2 + m1 <= 1))) {
    return 'left'
  } else if (m1 > 0.5 && (m2 === 0.5 || (m2 < 0.5 && m1 + m2 >= 1) || (m2 > 0.5 && m1 - m2 >= 0))) {
    return 'right'
  } else if (m2 < 0.5 && (m1 === 0.5 || (m1 < 0.5 && m1 - m2 >= 0) || (m1 > 0.5 && m1 + m2 <= 1))) {
    return 'top'
  } else if (m2 > 0.5 && (m1 === 0.5 || (m1 < 0.5 && m1 + m2 >= 1) || (m1 > 0.5 && m2 - m1 >= 0))) {
    return 'bottom'
  }
  
  return false
}

// 获取第一个偏移点
const getFirstOffsetPoint = function (sp, ep, dir) {
  let firstPoint = {};
  let sx = sp.x;
  let sy = sp.y;
  let ex = ep.x;
  let ey = ep.y;
  // 根据起始点所在的方位往外偏移
  if (dir === 'top') {
    firstPoint = { x: sx, y: sy - 20 }
  } else if (dir === 'bottom') {
    firstPoint = { x: sx, y: sy + 20 }
  } else if (dir === 'left') {
    firstPoint = { x: sx - 20, y: sy }
  } else if (dir === 'right') {
    firstPoint = { x: sx + 20, y: sy }
  }

  return firstPoint
}

// 获取节点与节点之间的连线
export const getPointsBetweenAA = function (sm, em, sp, ep, options) {
  // let x1 = startPoint.x
  // let y1 = startPoint.y
  // let x2 = endPoint.x
  // let y2 = endPoint.y

  // let points = [{ x: x1, y: y1 }]
  // const startDir = inDirection(startMatrix)
  // const endDir = inDirection(endMatrix)
  
  // points.push(getFirstOffsetPoint(startPoint, ))
}

// 获取节点与点之间的连线 必填项 sp 开始点 ep 结束点 sm 开始锚点 options一些可选配置
export const getPointsBetweenAP = function (sm, sp, ep, options) {
  let sx = sp.x
  let sy = sp.y
  let ex = ep.x
  let ey = ep.y

  let points = [{ x: sx, y: sy }]
  const dir = inDirection(sm)

  const offsetPoint = getFirstOffsetPoint(sp, ep, dir)
  // 第一个偏移点
  points.push(offsetPoint)

  if (dir === 'top' || dir === 'bottom') {
    points.push({ x: ex, y: offsetPoint.y })
  } else if (dir === 'left' || dir === 'right') {
    points.push({ x: offsetPoint.x, y: ey })
  }

  if (Math.abs(ey - offsetPoint.y) > 10) {
    // 结束点
    points.push({ x: ex, y: ey })
  }
  return points
}