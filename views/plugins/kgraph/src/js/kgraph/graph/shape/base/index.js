import kutil from '../../utils'

const Base = function () {
  this.id = _.uuid()
}

const proto = {
  draw () {
    this.drawShape()
    if (this.label) this.drawLabel()
  },

  // 画出形状
  // drawShape (cfg) {

  // },

  // drawLabel () {

  // },

  getControlPoints () {

  },

  cfg: {

    style: {
      width: 50,
      height: 50,
      color: '#000'
    },

    edge: {
      points: ['lt', 'rt', 'tp', 'btm'] // 边界控制点
    }
  }
}

Base.prototype = proto

export default Base