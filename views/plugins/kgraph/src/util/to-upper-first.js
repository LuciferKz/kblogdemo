const toUpperFirst = function (val) {
  let first = val.charAt(0).toUpperCase()
  return first + val.slice(1)
}

export default toUpperFirst