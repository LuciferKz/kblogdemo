import isType from './is-type'

const isFunction = function(value) {
  return isType(value, 'Array');
};

export default isFunction