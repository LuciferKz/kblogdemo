import Element from './element'
import Util from '../index'

let $k = function (dom) {
  if (Util.isDom(dom) || dom instanceof DocumentFragment || dom.window === window) {
    return new Element(dom);
  } else {
    return new Element(document.querySelector(dom));
  }
}

export default $k