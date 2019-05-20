import Inside from './inside'

const rect = function (item, point) {
  const box = item.get('box')
  return Inside.rect(box.l, box.t, box.width, box.height, point.x, point.y)
}

const circle = function (item, point) {
  const box = item.get('box')
  return Inside.circle(box.x, box.y, box.width, point.x, point.y)
}

const box = function (item, point) {
  const box = item.get('box')
  return Inside.box(box.l, box.r, box.t, box.b, point.x, point.y)
}

const shapes = {
  box,
  rect,
  circle
}

const isPointIn = function (item, point) {
  const shape = shapes[item.get('type')] || shapes.box
  return shape.apply(this, [item, point])
}

export default isPointIn