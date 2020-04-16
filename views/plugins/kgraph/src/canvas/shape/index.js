import rect from './rect'
import line from './line'
import polyline from './polyline'
import circle from './circle'
import text from './text'
import diamond from './diamond'

export const shapeMap = {
  rect,
  line,
  polyline,
  circle,
  text,
  diamond,
}

const ShapeFactory = function (cfg) {
  const _shape = shapeMap[cfg.type]
  if (!_shape) throw new Error(`shape ${cfg.type} is not exsit`)
  return new _shape(cfg)
}

export default ShapeFactory