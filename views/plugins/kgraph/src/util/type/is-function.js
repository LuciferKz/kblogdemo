/**
 * 是否为函数
 * @param  {*} fn 对象
 * @return {Boolean}  是否函数
 */
import isType from './is-type';

const isFunction = function(value) {
  return isType(value, 'Function');
};

export default isFunction;