import Rect from './rect'

const shapeMaps = {
  rect: Rect,
}

const Shape = function (shapeType) {
  return new shapeMaps[shapeType]
}

Shape.prototype.register = function (shape) {
  shapeMaps[shape.key] = shpae
}

export default Shape