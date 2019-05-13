let prefix = '', _addEventListener;

if (document.addEventListener) {
    _addEventListener = 'addEventListener';
} else if (document.attachEvent) {
    _addEventListener = 'attachEvent';
    prefix = 'on';
}

const addEvent = function (el, evt, cb, config) {
    el[_addEventListener](prefix + evt, cb, config)
}
const addWheelEvent = function (el, cb, config) {
    var evt = 'wheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? "mousewheel" : 'DOMMouseScroll'
    addEvent.apply(this, [el, evt, function (e) {
        cb({
            originalEvent: e,
            target: e.target || e.srcElement,
            type: "wheel",
            deltaX: e.wheelDeltaX ? - 1/40 * e.wheelDeltaX : 0,
            deltaY: e.wheelDelta ? - 1/40 * e.wheelDelta :  e.deltaY || e.detail,
            preventDefault: function () {
                e.preventDefault ? e.preventDefault : e.returnValue = false;
            }
        })
    }, config])
}
const extend = function (target, source) {
  if (Object.assign) {
    Object.assign(target, source);
  } else {
    for (let name in source) {
      target[name] = source;
    }
  }
  return target
}
const sum = function (n1, n2) {
  return (n1 * 10 + n2 * 10) / 10;
}
const minus = function (n1, n2) {
  return (n1 * 10 - n2 * 10) / 10;
}
const isFunction = function (o) {
  return typeof o === 'function';
}
const isDom = function (o) {
  typeof HTMLElement === 'object' ? o instanceof HTMLElement : typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string'
}
const getScrollLeft = function () {
  const scrollLeft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft
  return scrollLeft
}
const getScrollTop = function () {
  const scrollTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop
  return scrollTop
}

const guid = function () {
  let s = [], hexDigits = "0123456789abcdef";
  for (let i = 0; i < 16; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[3] = "4";
  s[7] = hexDigits.substr((s[7] & 0x3) | 0x8, 1);
  // s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

const map = function (o, cb) {
  return o.map(cb)
}
const each = function (o, cb) {
  if (o[Symbol.iterator]) {
    let i = 0
    for (let k of o) {
      cb(k, i, o)
      i++
    }
  } else {
    for (let k in o) {
      cb(o[k], k, o)
    }
  }
}
const filter = function (o, cb) {
  return o.filter(cb)
}
const find = function (o, cb) {
  return o.find(cb)
}
const values = function (o) {
  return Object.values(o)
}
const clone = function (source) {
  let _clone = {};
  extend(_clone, source);
  return _clone;
}
const deepClone = function (source) {
  if (!source) throw new Error(`source is ${typeof source}`)
  let clone = isArray(source) ? [] : {}
  each(source, (v, k) => {
    if (v && typeof v === 'object') {
      clone[k] = deepClone(v)
    } else {
      clone[k] = v
    }
  })
  return clone
}
const toNumber = function (val) {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
const isNumber = function (val) {
  return typeof val === 'number'
}
const isArray = function (o) {
  return o instanceof Array
}
const repeat = function (s, n) {
  let re = ''
  if (s.repeat) {
    re = s.repeat(n)
  } else {
    for (let i = 0; i < n; i++) {
      re += s
    }
  }
  return re
}

export default {
  guid,
  
  extend,
  clone,
  deepClone,

  sum,
  minus,

  isFunction,
  isDom,
  isNumber,

  getScrollLeft,
  getScrollTop,

  addEvent,
  addWheelEvent,

  map,
  each,
  values,
  find,
  filter
}