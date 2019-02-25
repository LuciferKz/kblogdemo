const kutil = {
  guid: function () {
    let s = [], hexDigits = "0123456789abcdef";
    for (let i = 0; i < 16; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[3] = "4";
    s[7] = hexDigits.substr((s[7] & 0x3) | 0x8, 1);
    // s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
  },
  newElement: function (elm, refs) {
    let k = $k(document.createElement(elm.tag));
    refs = refs || {};

    elm.attrs && k.attrs(elm.attrs);
    elm.props && k.props(elm.props);
    elm.style && k.css(elm.style);

    for (let evt in elm.evts) {
      k.on(evt, elm.evts[evt]);
    }

    elm.children && elm.children.forEach((child) => {
      k.append(this.newElement(child, refs));
    })

    elm.ref && (refs[elm.ref] = k);
    return k;
  },
  extend: function (target, source) {
    if (Object.assign) {
      Object.assign(target, source);
    } else {
      for (let name in source) {
        target[name] = source;
      }
    }
  },
  clone: function (source) {
    let _clone = {};
    this.extend(_clone, source);
    return _clone;
  },
  sum: function (n1, n2) {
    return (n1 * 10 + n2 * 10) / 10;
  },
  minus: function (n1, n2) {
    return (n1 * 10 - n2 * 10) / 10;
  },
  isFunction: function (o) {
    return Object.prototype.toString.call(o) === '[object Function]';
  }
}

window.kutil = kutil;