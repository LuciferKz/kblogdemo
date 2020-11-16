const prefix = ''
let _addEventListener = ''
let _removeEventListener = ''

if (document.addEventListener) {
  _addEventListener = 'addEventListener'
  _removeEventListener = 'removeEventListener'
} else if (document.attachEvent) {
  _addEventListener = 'attachEvent'
  _removeEventListener = 'detachEvent'
  prefix = 'on'
}

const addEvent = function (el, evt, cb, config) {
  el[_addEventListener](prefix + evt, cb, config)
}

const removeEvent = function (el, evt, cb) {
  el[_removeEventListener](prefix + evt, cb)
}

const addWheelEvent = function (el, cb, config) {
  var evt = 'wheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? "mousewheel" : 'DOMMouseScroll'
  addEvent.apply(this, [el, evt, function (e) {
    cb({
      originalEvent: e,
      target: e.target || e.srcElement,
      type: "wheel",
      deltaX: e.wheelDeltaX ? - 1 / 40 * e.wheelDeltaX : 0,
      deltaY: e.wheelDelta ? - 1 / 40 * e.wheelDelta : e.deltaY || e.detail,
      preventDefault: function () {
        e.preventDefault ? e.preventDefault : e.returnValue = false;
      }
    })
  }, config])
}

const getCss = function (element, attr) {
  if (window.getComputedStyle) {
    return attr
      ? window.getComputedStyle(element, null)[attr]
      : window.getComputedStyle(element, null)
  }
  return attr ? element.currentStyle[attr] : element.currentStyle
}

const isDom = typeof HTMLElement === 'object' ? function(obj) { return obj instanceof HTMLElement; }: function(obj){ return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'; };

const parseSelector = function (str) {
  const result = {}
  
  const tagArr = str.match(/^[^.#]+/g)

  if (tagArr) result.tagName = tagArr[0].toUpperCase()

  // ios 不支持零宽断言
  // const idArr = str.match(/(?<=\#)[^.#]+/g)
  // if (idArr) result.id = idArr[0]
  const idArr = str.match(/#[a-zA-Z0-9]+/g)
  if (idArr && idArr[0]) result.id = idArr[0].slice(1)
  
  // result.class = str.match(/(?<=\.)[^.#]+/g)
  const classArr = str.match(/\.[a-zA-Z0-9]+/g)
  if (classArr && classArr.length) result.class = classArr.map(cls => cls.slice(1))

  return result
}

const assignToKElement = function (source, type) {
  for (let name in source) {
    let fn = source[name]
    if (type === 'multi') {
      source[name] = function () {
        const args = [].slice.call(arguments)
        if (this.length() > 1) {
          return this.each(el => {
            args.unshift(el)
            fn.apply(this, args)
          })
        } else {
          args.unshift(this.dom[0])
          return fn.apply(this, args)
        }
      }
    }
    KElement.prototype[name] = source[name];
  }
}

const KElement = function (dom) {
  let k = this;
  const type = Object.prototype.toString.call(dom)
  if (isDom(dom)) {
    k.dom = [dom]
  } else if (type === '[object NodeList]') {
    k.dom = dom
  } else {
    k.dom = [document.createElement(dom)]
  }
  k.events = {};
}

KElement.prototype = {
  toggle () {
    this.isHide ? this.show() : this.hide()
    return this
  },
  getClass () {
    return this.dom.classList.values()
  },
  getBoundingClientRect() {
    return this.dom.getBoundingClientRect()
  },
  toggleClass (cls) {
    this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls)
    return this
  },
  length () {
    return this.dom.length
  }
}
/**
 * 属性设置
 */
const multiElSetter = {
  parents (el, selector) {
    // let el = this.dom
    let parent = null

    const parser = parseSelector(selector)

    while (el.tagName !== 'HTML') {
      el = el.parentNode

      if (parser.class) {
        if (parser.class.some((str) => !el.classList.contains(parser.class))) {
          continue;
        }
      }
  
      if (parser.tagName && parser.tagName !== el.tagName) {
        continue;
      }

      if (parser.id && parser.id !== el.id) {
        continue;
      }

      parent = el

      break;
    }

    return parent ? $k(parent) : null
  },
  append (el, k) {
    for (let i = 0, len = k.length(); i < len; i++) {
      el.appendChild(k.dom[i])
    }
    return this
  },
  prepend (el, k) {
    for (let i = 0, len = k.length(); i < len; i++) {
      el.insertBefore(k.dom[i], el.childNodes[0])
    }
    return this
  },
  insertBefore (el, k) {
    for (let i = 0, len = k.length(); i < len; i++) {
      el.parentNode.insertBefore(el, k.dom[i])
    }
    return this
  },
  remove (el) {
    if (!el.parentNode) return this
    el.parentNode.removeChild(el)
    return this
  },

  css (el, name, value) {
    if (typeof name === 'object') {
      let styles = name
      for (let style in styles) {
        el.style[style] = styles[style]
      }
    } else {
      el.style[name] = value
    }
    return this
  },
  hasClass (el, cls) {
    return el.classList.contains(cls)
  },
  addClass (el, cls) {
    el.classList.add(cls)
    return this
  },
  removeClass (el, cls) {
    el.classList.remove(cls)
    return this
  },

  show (el) {
    el.style.display = this.display
    this.isHide = false
  },
  hide (el) {
    if (this.isHide) return false
    this.display = getCss(el, 'display') || 'block'
    el.style.display = 'none'
    this.isHide = true
  },
  attrs (el, name, value) {
    if (typeof name === 'object') {
      let attrs = name
      for (let key in attrs) {
        el.setAttribute(key, attrs[key])
      }
    } else {
      if (!value) {
        return el.getAttribute(name)
      } else {
        el.setAttribute(name, value)
      }
    }
  },
  props (el, props) {
    for (let name in props) {
      el[name] = props[name]
    }
  },
  data (el, name, value) {
    if (typeof name === 'object') {
      let dataset = name
      for (let name in dataset) {
        el.dataset[name] = dataset[name]
      }
    } else {
      if (!value) {
        return el.dataset[name]
      } else {
        el.dataset[name] = value
      }
    }
  },
  html (el, html) {
    if (html || html === '') {
      el.innerHTML = html
    } else {
      return el.innerHTML
    }
  },
  text (el, text) {
    if (text || text === '') {
      el.textContent = text
    } else {
      return el.textContent
    }
  },
  height: function (el, h) {
    if (typeof h === 'boolean' && h) {
      return el.offsetHeight
    } else if (typeof h === 'number') {
      el.style.height = h + 'px'
    } else {
      return el.tagName === 'IMG' ? el.height : el.clientHeight
    }
  },
  width: function (el, w) {
    if (typeof w === 'boolean' && w) {
      return el.offsetWidth
    } else if (typeof w === 'number') {
      el.style.width = w + 'px'
    } else {
      return el.tagName === 'IMG' ? el.width : el.clientWidth
    }
  },
}

assignToKElement(multiElSetter, 'multi');

/**
 * 事件
 */

const multiElEvts = {
  on (el, evt, fn, config) {
    addEvent(el, evt, fn, config)
    if (!this.events[evt]) this.events[evt] = []
    this.events[evt].push(fn)
    return this
  },
  once (el, evt, fn, config) {
    this.on(el, evt, () => {
      fn.apply(this, [fn, config])
      this.off(evt, fn)
    }, config)
  },
  onWheel (el, fn, config) {
    addWheelEvent(el, fn, config)
    return this
  },
  off (el, evt, fn) {
    if (!fn) {
      if (this.events[evt]) {
        this.events[evt].forEach((fn) => {
          removeEvent(el, evt, fn)
        })
      }
    } else {
      removeEvent(el, evt, fn)
    }
    return this
  }
}

assignToKElement(multiElEvts, 'multi');

const util = {
  each (fn) {
    const doms = this.dom
    for (let i = 0, len = doms.length; i < len; i++) {
      fn(doms.item(i), doms)
    }
    return this;
  }
}
assignToKElement(util);

const $k = function (dom) {
  if (isDom(dom) || dom instanceof DocumentFragment || dom === window || dom === document) {
    return new KElement(dom)
  } else {
    return new KElement(document.querySelectorAll(dom))
  }
}

const newElement = function (elm, refs) {
  let k = $k(document.createElement(elm.tag));
  refs = refs || {};

  elm.attrs && k.attrs(elm.attrs);
  elm.props && k.props(elm.props);
  elm.style && k.css(elm.style);
  elm.data && k.data(elm.data);

  for (let evt in elm.evts) {
    k.on(evt, elm.evts[evt]);
  }

  elm.children && elm.children.forEach((child) => {
    k.append(newElement(child, refs));
  })

  elm.ref && (refs[elm.ref] = k);
  return k;
}