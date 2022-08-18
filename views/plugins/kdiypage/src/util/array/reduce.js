import isArray from '../type/is-array';
import isPlainObject from '../type/is-plain-object';
import each from '../each';

const reduce = function(arr, fn, init) {
  if (!isArray(arr) && !isPlainObject(arr)) {
    return arr;
  }
  let result = init;
  each(arr, (data, i) => {
    result = fn(result, data, i);
  });
  return result;
};

export default reduce;