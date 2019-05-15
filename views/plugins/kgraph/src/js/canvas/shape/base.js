const Util = require('@/js/util')

class Base {
  constructor () {
  }

  draw () {
    // 扩展方法
  }

  /**
   * 画布内横坐标
   */
  x = 0

  /**
   * 画布内纵坐标
   */
  y = 0

  /**
   * 画布尺寸, 数字 width, height = size. 数组 0: width 1: height 圆则为半径
   * @type { number, array }
   */
  size = 10
}

module.exports = Base