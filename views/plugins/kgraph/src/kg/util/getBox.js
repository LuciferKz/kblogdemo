import Util from '../../util'

const shapes = {
  rect (shape, ratio) {
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
  },

  circle (shape) {
    const size = shape.size

    let width = size * 2
    let height = size * 2
    let x = shape.x
    let y = shape.y

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
  },

  diamond (shape) {
    return this.rect(shape)
  }
}

const getBox = function (shape) {
  if (!shape.type) console.error('shape.type属性不存在', shape)
  if (!shapes[shape.type]) {
    console.error('没有找到对应的图形')
    return {}
  }
  return shapes[shape.type](shape.outlineCfg || shape)
}

export default getBox