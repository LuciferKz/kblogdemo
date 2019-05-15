class Rect extends Base {
  constructor (cfg) {
  }
  
  draw (cfg) {
    this.cfg = kutil.extend(this.getDefaultStyle(), cfg)
  }

  getDefaultStyle () {
    return {
      x: 0,
      y: 0,
      z: 0,
      width: 0,
      height: 0,
      color: "#000",
      stroke: false,
      lineWidth: 1
    }
  }
}