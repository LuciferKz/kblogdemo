const Util = require('./')
const each = function (o, fn) {
  if (Util.isArray(o)) {
    for (let i = 0, len = o.length; i < len; i++) {
      fn(o[i], i, o)
    }
  } else if (Util.isObjectLike()) {
    for (let key in o) {
      fn(o[key], key, o)
    }
  }
}

export default each