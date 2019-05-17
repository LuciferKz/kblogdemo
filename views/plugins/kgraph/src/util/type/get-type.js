const toString = {}.toString;

const getType = function(value) {
  return toString.call(value).replace(/^\[object /, '').replace(/\]$/, '');
};

export default getType;