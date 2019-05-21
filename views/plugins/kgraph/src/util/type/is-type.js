const type = function (o, type) {
  return {}.toString.call(o) === `[object ${type}]`
}

export default type