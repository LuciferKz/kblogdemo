const type = function (o, type) {
  return typeof o === 'object' && Object.prototype.toString.call(o) === `[object ${type}]`
}

export default type