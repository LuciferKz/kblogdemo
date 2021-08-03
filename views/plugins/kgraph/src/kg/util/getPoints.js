const inEdge = function (m = []) {
  let m1 = m[0]
  let m2 = m[1]

  if (m1 === m2 && m1 === 0) {
    return 'corner'
  } 
  if (m1 === 0) {
    return 'left'
  }
  if (m1 === 1) {
    return  'right'
  }
  if (m2 === 0) {
    return 'top'
  }
  if (m2 === 1) {
    return 'bottom'
  }
  return false
}

const inQuadrant = function (startPoint, endPoint) {
  let x1 = startPoint.x
  let y1 = startPoint.y
  let x2 = endPoint.x
  let y2 = endPoint.y
  let offset = 10

  // x1 < x2 则 x1 - x2 < 0 反之则 x1 - x2 > 0

  let diffX = x1 - x2
  let diffY = y1 - y2

  if (diffX < -offset) {
    if (diffY > offset) {
      return 1
    } else if (diffY < -offset) {
      return 4
    } else {
      // endPoint.y = y1
      return 5
    }
  } else if (diffX > offset) {
    if (diffY > offset) {
      return 2
    } else if (diffY < -offset) {
      return 3
    } else {
      return 5
    }
  } else {
    // endPoint.x = x1
    return 6
  }

  // if (diffX < 0 && diffY > 5) {
  //   endPoint.y = y1
  //   return 1
  // } else if (diffX > 0 && diffY > 0) {
  //   return 2
  // } else if (diffX > 0 && diffY < 0) {
  //   return 3
  // } else if (diffX < 0 && diffY < -5) {
  //   return 4
  // } else {
  //   return 5
  // }
}

const getArrowSpace = function (p1, p2) {
  let x1 = p2.x
  let y1 = p2.y

  if (p1.y === p2.y && p1.x < p2.x) {
    x1 = x1 - 10
  } else if (p1.x === p2.x && p1.y < p2.y) {
    y1 = y1 - 10
  } else if (p1.y === p2.y && p1.x > p2.x) {
    x1 = x1 + 10
  } else if (p1.x === p2.x && p1.y > p2.y) {
    y1 = y1 + 10
  }

  return { x: x1, y: y1 }
}

const extendOriginPoint = function (point, edge) {
  let x1 = point.x
  let y1 = point.y

  if (edge === 'left') {
    x1 = x1 - 30
  } else if (edge === 'top') {
    y1 = y1 - 30
  } else if (edge === 'right') {
    x1 = x1 + 30
  } else if (edge === 'bottom') {
    y1 = y1 + 30
  }

  return { x: x1, y: y1 }
}

export default function (startMatrix, endMatrix, startPoint, endPoint, arrow) {
  let x1 = startPoint.x
  let y1 = startPoint.y
  let x2 = endPoint.x
  let y2 = endPoint.y

  let points = [{ x: x1, y: y1 }]
  const startEdge = inEdge(startMatrix)
  const endEdge = inEdge(endMatrix)

  let extendStartPoint= extendOriginPoint(startPoint, startEdge)
  let extendEndPoint = extendOriginPoint(endPoint, endEdge)
  const quadrant = inQuadrant(extendStartPoint, extendEndPoint) // 目标对象相对开始对象处于哪一个象限

  x1 = extendStartPoint.x
  y1 = extendStartPoint.y

  x2 = extendEndPoint.x
  y2 = extendEndPoint.y

  if (quadrant === 5) {
    extendEndPoint.y = extendStartPoint.y
    endPoint.y = extendStartPoint.y
  } else if (quadrant === 6) {
    extendEndPoint.x = extendStartPoint.x
    endPoint.x = extendStartPoint.x
  }

  points.push(extendStartPoint)
  
  if (!endEdge) {
    let distanceX = Math.abs(x1 - x2)
    let distanceY = Math.abs(y1 - y2)
    if (startEdge === 'top' || startEdge === 'bottom') {
      if (quadrant === 1) {
        if (distanceX > distanceY) {
          points.push({ x: x1, y: y1 - distanceY / 2 })
          points.push({ x: x2, y: y1 - distanceY / 2 })
        } else {
          points.push({ x: x1, y: y2 })
        }
      } else if (quadrant === 2) {
        if (distanceX > distanceY) {
          points.push({ x: x1, y: y1 - distanceY / 2 })
          points.push({ x: x2, y: y1 - distanceY / 2 })
        } else {
          points.push({ x: x1, y: y2 })
        }
      } else if (quadrant === 3) {
        if (distanceX > distanceY) {
          points.push({ x: x1, y: y1 + distanceY / 2 })
          points.push({ x: x2, y: y1 + distanceY / 2 })
        } else {
          points.push({ x: x1, y: y2 })
        }
      } else if (quadrant === 4) {
        if (distanceX > distanceY) {
          points.push({ x: x1, y: y1 + distanceY / 2 })
          points.push({ x: x2, y: y1 + distanceY / 2 })
        } else {
          points.push({ x: x1, y: y2 })
        }
      }
    } else if (startEdge === 'left' || startEdge === 'right') {
      if (quadrant === 1) {
        if (distanceX < distanceY) {
          points.push({ x: x1 + distanceX / 2, y: y1 })
          points.push({ x: x1 + distanceX / 2, y: y2 })
        } else {
          points.push({ x: x2, y: y1 })
        }
      } else if (quadrant === 2) {
        if (distanceX < distanceY) {
          points.push({ x: x1 - distanceX / 2, y: y1 })
          points.push({ x: x1 - distanceX / 2, y: y2 })
        } else {
          points.push({ x: x2, y: y1 })
        }
      } else if (quadrant === 3) {
        if (distanceX < distanceY) {
          points.push({ x: x1 - distanceX / 2, y: y1 })
          points.push({ x: x1 - distanceX / 2, y: y2 })
        } else {
          points.push({ x: x2, y: y1 })
        }
      } else if (quadrant === 4) {
        if (distanceX < distanceY) {
          points.push({ x: x1 + distanceX / 2, y: y1 })
          points.push({ x: x1 + distanceX / 2, y: y2 })
        } else {
          points.push({ x: x2, y: y1 })
        }
      }
    }
  }

  if (startEdge === 'left') {
    if (quadrant === 1) {
      if (endEdge === 'left') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    } else if (quadrant === 2) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
      }
    } else if (quadrant === 3) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'right') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    } else if (quadrant === 4) {
      if (endEdge === 'left') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    }
  } else if (startEdge === 'top') {
    if (quadrant === 1) {
      if (endEdge === 'left') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      }
    } else if (quadrant === 2) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      }
    } else if (quadrant === 3) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      }
    } else if (quadrant === 4) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      }
    }
  } else if (startEdge === 'right') {
    if (quadrant === 1) {
      if (endEdge === 'left') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
      }
    } else if (quadrant === 2) {
      if (endEdge === 'left') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    } else if (quadrant === 3) {
      if (endEdge === 'left') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    } else if (quadrant === 4) {
      if (endEdge === 'left') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    }
  } else if (startEdge === 'bottom') {
    if (quadrant === 1) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
      }
    } else if (quadrant === 2) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x2 + (x1 - x2) / 2, y: y1 })
        points.push({ x: x2 + (x1 - x2) / 2, y: y2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x2, y: y1 })
      }
    } else if (quadrant === 3) {
      if (endEdge === 'left') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      } else if (endEdge === 'right') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    } else if (quadrant === 4) {
      if (endEdge === 'left') {
        points.push({ x: x1, y: y2 })
      } else if (endEdge === 'top') {
        points.push({ x: x1, y: y2 + (y1 - y2) / 2 })
        points.push({ x: x2, y: y2 + (y1 - y2) / 2 })
      } else if (endEdge === 'right') {
        points.push({ x: x2, y: y1 })
      } else if (endEdge === 'bottom') {
        points.push({ x: x1, y: y2 })
      }
    }
  }
  if (endMatrix && extendEndPoint) points.push(extendEndPoint)
  if (arrow) points.push(getArrowSpace(points.slice(-1)[0], endPoint))
  points.push(endPoint)
  return points
}