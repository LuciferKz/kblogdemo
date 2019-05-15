import isObjectLike from './is-object-like'
import isType from './is-type'

const isPlainObject = function (o) {
  if (!isObjectLike(o) || !isType(o, 'Object')) {
    return false;
  }
  if (Object.getPrototypeOf(o) === null) {
    return true;
  }
  let proto = o;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(o) === proto;
}

export default isPlainObject
