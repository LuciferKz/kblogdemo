import Inside from './inside'

const rect = function (item, point) {
  const box = item.get('box')
  return Inside.rect(box.l, box.t, box.width, box.height, point.x, point.y)
}

const circle = function (item, point) {
  const box = item.get('box')
  return Inside.circle(box.x, box.y, box.width, point.x, point.y)
}

const shapes = {
  rect,
  circle
}

const isPointIn = function (item, point) {
  return shapes[item.get('type')].apply(this, [item, point])
}

export default isPointIn