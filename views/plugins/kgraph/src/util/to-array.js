import isArrayLike from './type/is-array-like'

function toArray(value) {
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [];
}

export default toArray;