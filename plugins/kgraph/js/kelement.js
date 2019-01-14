import { addEvent, addWheelEvent } from './kevent';

const isDom = typeof HTMLElement === 'object' ? function(obj) { return obj instanceof HTMLElement; }: function(obj){ return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'; };

let $k = function (dom) {
  if (isDom(dom) || dom instanceof DocumentFragment) {
    return new KElement(dom);
  } else {
    return new KElement(document.querySelector(dom));
  }
}
let KElement = function (dom) {
  let k = this;
  k.dom = dom;
}
KElement.prototype = {
  append: function (k) {
    this.dom.appendChild(k.dom);
    return this;
  },
  insertBefore: function (k) {
    k.dom.parentNode.insertBefore(this.dom, k.dom);
    return this;
  },
  remove: function () {
    if (!this.dom.parentNode) { return this}
    this.dom.parentNode.removeChild(this.dom);
    return this;
  },
  css: function (styles) {
    for (let style in styles) {
      this.dom.style[style] = styles[style];
    }
    return this;
  },
  addClass: function (cls) {
    this.dom.classList.add(cls);
    return this;
  },
  removeClass: function (cls) {
    this.dom.classList.remove(cls);
    return this;
  },
  show: function () {
    this.dom.style.display = 'block';
    return this;
  },
  hide: function () {
    this.dom.style.display = 'none';
    return this;
  },
  attrs: function (attrs) {
    for (let name in attrs) {
      this.dom.setAttribute(name, attrs[name])
    }
    return this;
  },
  props: function (props) {
    for (let name in props) {
      this.dom[name] = props[name];
    }
    return this;
  },
  html: function (text) {
    if (text || text === '') {
      this.dom.innerHTML = text;
    } else {
      return this.dom.innerHTML;
    }
    return this;
  },
  text: function (text) {
    if (text) {
      this.dom.textContent = text;
    } else {
      return this.dom.textContent;
    }
    return this;
  },
  on: function (evt, fn, config) {
    addEvent(this.dom, evt, fn, config);
    return this;
  },
  onWheel: function (fn, config) {
    addWheelEvent(this.dom, fn, config);
    return this;
  }
}

export default $k;