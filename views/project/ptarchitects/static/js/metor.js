
class Metorrain {
  constructor (ca, opt) {
    this.opt = Object.assign({}, {
      count: 5,
    }, opt)
    this.init(ca)
  }

  init (ca) {
    const ctx = ca.getContext('2d');
    const cWidth = window.innerWidth;
    const cHeight = window.innerHeight;
    ca.width = cWidth;
    ca.height = cHeight;
    this.metors = []
    this.ctx = ctx;
    this.cWidth = cWidth;
    this.cHeight = cHeight;
    this.addMetors(this.count)
  }

  play () {
    this.process = setInterval(() => {
      requestAnimationFrame(() => {
        this.addMetors(this.opt.count - this.metors.length)
        for (let i = this.metors.length - 1; i > -1; i--) {
          let m = this.metors[i]
          m.move();
          if (m.start.x < 0 || m.start.y > this.cHeight) {
            this.metors.splice(i, 1)
          }
        }
        this.draw();
      })
    }, 1000 / 60)
  }

  stop () {
    clearInterval(this.process)
  }

  draw () {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.cWidth, this.cHeight);
    this.metors.forEach((m) => {
      m.draw();
    })
  }

  addMetors (count) {
    if (count <= 0) return
    for (let i = 0; i < count; i++) {
      let _metor = new Metor(this.ctx)
      _metor.draw()
      this.metors.push(_metor)
    }
  }
}

class Metor {
  constructor (ctx, opt) {
    this.ctx = ctx;
    this.opt = Object.assign({}, {
      size: 80,
      speed: Math.round(Math.random() * 15) / 10
    }, opt)
    const x = Math.round(Math.random() * window.innerWidth) + window.innerWidth / 2
    const y = -Math.round(Math.random() * 500)
    this.start = { x, y }
    this.end = { x: x + this.opt.size, y }
    console.log(this.start, this.end)
  }

  move () {
    this.start.x = this.start.x - this.opt.speed;
    this.start.y = this.start.y + this.opt.speed;
  }

  draw () {
    const ctx = this.ctx;
    ctx.save();
    const gradient = ctx.createLinearGradient(this.start.x, this.start.y, this.start.x + this.opt.size, this.start.y);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.translate(this.start.x, this.start.y);
    ctx.rotate(Math.PI / 180 * -45);
    ctx.translate(-this.start.x, -this.start.y);
    ctx.fillRect(this.start.x, this.start.y, this.start.x + this.opt.size, 2)
    ctx.restore();
  }
}

class Starry {
  constructor (ca) {
    ca.width = window.innerWidth;
    ca.height = window.innerHeight;
    this.ctx = ca.getContext('2d');
    this.init()
  }

  init () {
    this.count = Math.round(Math.random() * 10)
    this.stars = []
  }

  play () {
    
  }
}

class Star {
  constructor (ctx) {
    this.ctx = ctx
  }

  init () {
    this.r = 3
    this.x = Math.round(Math.random() * window.innerWidth / 2) + window.innerWidth / 2
    this.y = Math.round(Math.random() * window.innerHeight / 2)
  }

  draw () {
    const ctx = this.ctx;
    const grd = ctx.createRadialGradient(100, 100, 2, 100, 100, 5);
    grd.addColorStop(0, "rgba(133, 27, 104, .5)");
    grd.addColorStop(1, 'transparent');
    ctx.save();
    ctx.fillStyle = grd;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }
}

const playMetorrain = function () {
  const _metorrain = new Metorrain(document.getElementById('metor'))
  _metorrain.play()

  // const _starry = new Starry(document.getElementById('starry'))
  // _starry.play()
}

playMetorrain()