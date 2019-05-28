const inEdge = function (m) {
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
  if (x1 < x2 && y1 > y2) {
    return 1
  } else if (x1 > x2 && y1 > y2) {
    return 2
  } else if (x1 > x2 && y1 < y2) {
    return 3
  } else if (x1 < x2 && y1 < y2) {
    return 4
  }
}

const getArrowSpace = function (point, edge) {
  let x1 = point.x
  let y1 = point.y

  console.log(edge)
  if (edge === 'left') {
    x1 = x1 - 10
  } else if (edge === 'top') {
    y1 = y1 - 10
  } else if (edge === 'right') {
    x1 = x1 + 10
  } else if (edge === 'bottom') {
    y1 = y1 + 10
  }

  return { x: x1, y: y1 }
}

const extendOriginPoint = function (point, edge) {
  let x1 = point.x
  let y1 = point.y

  console.log(edge)
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
  x1 = extendStartPoint.x
  y1 = extendStartPoint.y

  let extendEndPoint = extendOriginPoint(endPoint, endEdge)
  x2 = extendEndPoint.x
  y2 = extendEndPoint.y
  
  const quadrant = inQuadrant(extendStartPoint, extendEndPoint) // 目标对象相对开始对象处于哪一个象限

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
  if (extendEndPoint) points.push(extendEndPoint)
  if (arrow) points.push(getArrowSpace(endPoint, endEdge))
  points.push(endPoint)
  return points
}