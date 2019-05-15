import rect from './rect'
import line from './line'
import circle from './circle'
import text from './text'

const shapeMaps = {
  rect,
  line,
  circle,
  text
}

const ShapeFactory = function (cfg) {
  return new shapeMaps[cfg.type](cfg)
}

export default ShapeFactory