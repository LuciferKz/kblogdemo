/**
 * 
 * @param {时间} t  毫秒
 * @param {经过时间} b 毫秒
 * @param {经过距离} c 
 * @param {当前位置} d 
 */
const linear = function (t, b, c, d) {
  return t * (c / d) + b
}

export default linear