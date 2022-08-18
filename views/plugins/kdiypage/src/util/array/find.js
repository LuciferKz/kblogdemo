import isFunction from '../type/is-function'
import isPlainObject from '../type/is-plain-object'
import isMatch from '../object/is-match'

function find(arr, predicate) {
  let _predicate;
  if (isFunction(predicate)) {
    _predicate = predicate;
  }
  if (isPlainObject(predicate)) {
    _predicate = a => isMatch(a, predicate);
  }
  if (_predicate) {
    for (let i = 0; i < arr.length; i += 1) {
      if (_predicate(arr[i])) {
        return arr[i];
      }
    }
  }
  return null;
}

export default find;