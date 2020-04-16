import each from './each';
import isArrayLike from './type/is-array-like';

const filter = function(arr, func) {
  if (!isArrayLike(arr)) {
    return arr;
  }
  const result = [];
  each(arr, function(value, index) {
    if (func(value, index)) {
      result.push(value);
    }
  });
  return result;
};

export default filter;