const line = function () {

}

line.prototype = {
  getPath (points) {
    _.each(points, (p, idx) => {
      if (idx === 0) {
        points.push({ t: 'M', x: p.x, y: p.y })
      } else {
        points.push({ t: 'M', x: p.x, y: p.y })
      }
    })
  },
}