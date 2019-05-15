const type = function (type) {
  return function (o) {
    return typeof o === 'object' && Object.prototype.toString.call(o) === `[object ${type}]`
  }
}

export default type