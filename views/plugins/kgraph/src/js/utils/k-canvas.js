import _ from './index'

const kc = function (ctx) {
  this.ctx = ctx
}

kc.prototype.draw = function (data) {
  if (data.shapeType === 'line') {
    this.drawLine(data)
  } 
}

kc.prototype.drawLine = function (data) {
  const ctx = this.ctx
  ctx.beginPath()
  ctx.strokeStyle = data.attrs.strokeStyle;
  ctx.lineWidth = data.attrs.lineWidth;
  _.each(data.points, (p) => {
    if (p.t === 'M') {
      ctx.moveTo(p.x, p.y)
    } else if (p.t === 'L') {
      ctx.lineTo(p.x, p.y)
    }
  })
  ctx.stroke()
}

export default kc