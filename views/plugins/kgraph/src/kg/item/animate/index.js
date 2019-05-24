import linear from './linear'

const tween = {
  linear
}

const animate = function (props, option = {}) {
  const type = option.type || 'linear'
  const duration = option.duration || 1000
  const fn = tween[type]
  const shape = this.getShape()

  for (let name in props) {
    let value = props[name]
    let shapeStyle = shape.get('style')
    let b = shapeStyle[name]
    if (!b && b !== 0) return false
    let t = 0
    let d = duration
    let c = value - b
    let v = b
    let j = {}
    let interval = setInterval(() => {
      if (t < d) {
        t = t + 1000 / 60
        v = fn(t, b, c, d)
        j[name] = v
        shapeStyle[name] = v
        this.get('graph').paint()
      } else {
        clearInterval(interval)
        j[name] = value
        this.update(j)
      }
      // console.log(shapeStyle)
    }, 1000 / 60)
  }
}

export default animate