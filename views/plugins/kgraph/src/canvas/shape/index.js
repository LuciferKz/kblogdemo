import rect from './rect'
import line from './line'
import circle from './circle'
import text from './text'
import diamond from './diamond'

const shapeMaps = {
  rect,
  line,
  circle,
  text,
  diamond
}

const ShapeFactory = function (cfg) {
  // console.log('ShapeFactory', cfg)
  const _shape = shapeMaps[cfg.type]
  if (!_shape) throw new Error(`shape ${cfg.type} is not exsit`)
  return new _shape(cfg)
}

export default ShapeFactory