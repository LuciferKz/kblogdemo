import each from './each';
import isArrayLike from './type/is-array-like';

const map = function(arr, func) {
  if (!isArrayLike(arr)) {
    return arr;
  }
  const result = [];
  each(arr, function(value, index) {
    result.push(func(value, index));
  });
  return result;
};

export default map;