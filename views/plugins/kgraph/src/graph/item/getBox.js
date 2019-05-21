import Util from '../../util'

const getBox = function (shape) {
  const size = shape.size

  let width = 0
  let height = 0
  let x = shape.x
  let y = shape.y

  if (Util.isArray(size)) {
    width = size[0]
    height = size[1]
  } else {
    width = size
    height = size
  }

  const halfWidth = width / 2
  const halfHeight = height / 2
  
  return {
    x: x,
    y: y,
    t: y - halfHeight,
    l: x - halfWidth,
    b: y + halfHeight,
    r: x + halfWidth,
    width,
    height
  }
}

export default getBox