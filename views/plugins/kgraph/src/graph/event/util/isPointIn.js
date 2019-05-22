import Inside from './inside'

const rect = function (item, point) {
  const box = item.get('box')
  return Inside.rect(box.l, box.t, box.width, box.height, point.x, point.y)
}

const circle = function (item, point) {
  const box = item.get('box')
  return Inside.circle(box.x, box.y, box.width / 2, point.x, point.y)
}

const box = function (item, point) {
  const box = item.get('box')
  return Inside.box(box.l, box.r, box.t, box.b, point.x, point.y)
}

const polyline = function (item, point) {
  const shape = item.get('shape')
  return Inside.polyline(shape.points, shape.style.lineWidth + 6, point.x, point.y)
}

const shapes = {
  box,
  rect,
  circle,
  polyline
}

const isPointIn = function (item, point) {
  const type = item.get('shape').type
  if (!type) {
    return false
  }
  const shape = shapes[type] || shapes.box
  return shape.apply(this, [item, point])
}

export default isPointIn