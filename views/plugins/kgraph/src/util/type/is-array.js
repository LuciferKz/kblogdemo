import isType from './is-type'

const isArray = function(value) {
  return isType(value, 'Array');
};

export default isArray