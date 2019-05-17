import Util from '../../util'

const shapes = {
  rect: function (item) {
    const size = item.get('size')

    let width = 0
    let height = 0
    let x = item.get('x')
    let y = item.get('y')

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
      t: y - halfHeight,
      l: x - halfWidth,
      b: y + halfHeight,
      r: x + halfWidth,
      width,
      height
    }
  }
}

const getBox = function (item) {
  console.log(item.get('type'))
  const shape = shapes[item.get('type')]
  if (!shape) return {}
  return shape(item)
}

export default getBox