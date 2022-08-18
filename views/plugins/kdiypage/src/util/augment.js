import isFunction from './type/is-function'
import toArray from './to-array'
import mix from './mix'

const augment = function(c) {
  const args = toArray(arguments);
  for (let i = 1; i < args.length; i++) {
    let obj = args[i];
    if (isFunction(obj)) {
      obj = obj.prototype;
    }
    mix(c.prototype, obj);
  }
};

export default augment;