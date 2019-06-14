import { addEvent, addWheelEvent } from './event'

const getCss = function(element, attr) {
  if (window.getComputedStyle) {
    return attr
      ? window.getComputedStyle(element, null)[attr]
      : window.getComputedStyle(element, null)
  }
  return attr ? element.currentStyle[attr] : element.currentStyle
}

let KElement = function(dom) {
  let k = this
  k.dom = dom
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
    if (this.isHide) return false
    this.display = getCss(this.dom, 'display') || 'block'
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
    } else {
      return this.dom.clientHeight
    }
  },
  width: function(w) {
    if (typeof w === 'boolean' && w) {
      return this.dom.offsetWidth
    } else if (typeof w === 'number') {
      this.dom.style.width = w + 'px'
    } else {
      return this.dom.clientWidth
    }
  }
}

export default KElement
