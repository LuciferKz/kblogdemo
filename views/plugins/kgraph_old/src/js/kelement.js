import { addEvent, addWheelEvent } from './kevent';

const getCss = function(element, attr) {
  if (!isDom(element)) return false
  if (window.getComputedStyle) {
    return attr
      ? window.getComputedStyle(element, null)[attr]
      : window.getComputedStyle(element, null)
  }
  return attr ? element.currentStyle[attr] : element.currentStyle
}

const isDom = typeof HTMLElement === 'object' ? function(obj) { return obj instanceof HTMLElement; }: function(obj){ return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'; };

let $k = function (dom) {
  if (dom.window === window) {
    console.log(dom)
  }
  if (isDom(dom) || dom instanceof DocumentFragment || dom.window === window) {
    return new KElement(dom);
  } else {
    return new KElement(document.querySelector(dom));
  }
}
let KElement = function (dom) {
  let k = this;
  k.dom = dom;
  k.display = 'block'
  k.isHide = getCss(dom, 'display') === 'none'
}
KElement.prototype = {
  append: function(k) {
    this.dom.appendChild(k.dom)
    return this
  },
  prepend: function(k) {
    this.dom.insertBefore(k.dom, this.dom.childNodes[0])
    return this
  },
  insertBefore: function(k) {
    k.dom.parentNode.insertBefore(this.dom, k.dom)
    return this
  },
  remove: function() {
    if (!this.dom.parentNode) {
      return this
    }
    this.dom.parentNode.removeChild(this.dom)
    return this
  },
  css: function(name, value) {
    if (typeof name === 'object') {
      let styles = name
      for (let style in styles) {
        this.dom.style[style] = styles[style]
      }
    } else {
      this.dom.style[name] = value
    }
    return this
  },
  hasClass: function(cls) {
    return this.dom.classList.contains(cls)
  },
  addClass: function(cls) {
    this.dom.classList.add(cls)
    return this
  },
  removeClass: function(cls) {
    this.dom.classList.remove(cls)
    return this
  },
  toggleClass: function(cls) {
    this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls)
    return this
  },
  show: function() {
    this.dom.style.display = this.display
    this.isHide = false
    return this
  },
  hide: function() {
    let _display = getCss(this.dom, 'display')
    if (_display === 'none') return false
    this.display = _display || 'block'
    this.dom.style.display = 'none'
    this.isHide = true
    return this
  },
  toggle: function() {
    this.isHide ? this.show() : this.hide()
    return this
  },
  attrs: function(attrs) {
    for (let name in attrs) {
      this.dom.setAttribute(name, attrs[name])
    }
    return this
  },
  props: function(props) {
    for (let name in props) {
      this.dom[name] = props[name]
    }
    return this
  },
  html: function(text) {
    if (text || text === '') {
      this.dom.innerHTML = text
    } else {
      return this.dom.innerHTML
    }
    return this
  },
  text: function(text) {
    if (text) {
      this.dom.textContent = text
    } else {
      return this.dom.textContent
    }
    return this
  },
  on: function(evt, fn, config) {
    addEvent(this.dom, evt, fn, config)
    return this
  },
  onWheel: function(fn, config) {
    addWheelEvent(this.dom, fn, config)
    return this
  },
  height: function(h) {
    if (typeof h === 'boolean' && h) {
      return this.dom.offsetHeight
    } else if (typeof h === 'number') {
      this.dom.style.height = h + 'px'
      return this
    } else {
      return this.dom.clientHeight
    }
  },
  width: function(w) {
    if (typeof w === 'boolean' && w) {
      return this.dom.offsetWidth
    } else if (typeof w === 'number') {
      this.dom.style.width = w + 'px'
      return this
    } else {
      return this.dom.clientWidth
    }
  },
  getBoundingClientRect () {
    return this.dom.getBoundingClientRect()
  }
}

window.$k = $k;