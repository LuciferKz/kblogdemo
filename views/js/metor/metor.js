class Metorrain {
  constructor(ctx, opt) {
    this.opt = Object.assign(
      {},
      {
        count: 10,
      },
      opt
    );
    this.init(ctx);
  }

  init(ctx) {
    this.metors = [];
    this.ctx = ctx;
    this.addMetors(this.count);
  }

  play() {
    this.process = setInterval(() => {
      this.addMetors(this.opt.count - this.metors.length);
      for (let i = this.metors.length - 1; i > -1; i--) {
        let m = this.metors[i];
        m.move();
        if (m.start.x + m.opt.size < 0 || m.start.y > this.cHeight) {
          this.metors.splice(i, 1);
        }
      }
    }, 1000 / 30);
  }

  addMetors(count) {
    if (count <= 0) return;
    for (let i = 0; i < count; i++) {
      let _metor = new Metor(this.ctx);
      _metor.draw();
      this.metors.push(_metor);
    }
  }
}

class Metor {
  constructor(ctx, opt) {
    this.ctx = ctx;
    this.opt = Object.assign(
      {},
      {
        size: 80,
        speed: Math.round(Math.random() * 100) / 10 + 2,
      },
      opt
    );
    const x =
      Math.round(Math.random() * window.innerWidth) + window.innerWidth / 2;
    const y = -Math.round(Math.random() * 500);
    this.start = { x, y };
  }

  move() {
    this.start.x = this.start.x - this.opt.speed;
    this.start.y = this.start.y + this.opt.speed;
  }

  draw() {
    requestAnimationFrame(() => {
      const ctx = this.ctx;
      ctx.save();
      const gradient = ctx.createLinearGradient(
        this.start.x,
        this.start.y,
        this.start.x + this.opt.size,
        this.start.y
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.translate(this.start.x, this.start.y);
      ctx.rotate((Math.PI / 180) * -45);
      ctx.translate(-this.start.x, -this.start.y);
      ctx.fillRect(this.start.x, this.start.y, this.start.x + this.opt.size, 2);
      ctx.restore();
    });
  }
}

class Starry {
  constructor(ctx, opts = {}) {
    this.ctx = ctx;
    this.count = opts.count || Math.round(Math.random() * 10);
    this.init();
  }

  init() {
    this.stars = [];
    for (let i = 0; i < this.count; i++) {
      this.stars.push(new Star(this.ctx));
    }
  }

  play() {
    this.process = setInterval(() => {
      this.stars.forEach((star) => {
        star.play();
      });
    }, 1000 / 30);
  }
}

class Star {
  constructor(ctx) {
    this.ctx = ctx;
    this.status = "out";
    this.opacity = 1;
    this.init();
  }

  init() {
    this.r = 100;
    this.x = Math.round((Math.random() * window.innerWidth) / 2);
    this.y = Math.round((Math.random() * window.innerHeight) / 2);
  }

  play() {
    if (this.status === "out") {
      this.opacity = this.opacity - 0.05;
    } else {
      this.opacity = this.opacity + 0.05;
    }
    if (this.opacity < 0.3) {
      this.status = "in";
    } else if (this.opacity > 1) {
      this.status = "out";
    }
  }

  draw() {
    // requestAnimationFrame(() => {
    // const ctx = this.ctx;
    // // ctx.save();
    // const grd = ctx.createRadialGradient(
    //   this.x,
    //   this.y,
    //   1,
    //   this.x,
    //   this.y,
    //   4
    // );
    // // grd.addColorStop(0, "rgba(133, 27, 104, .5)");
    // // grd.addColorStop(0, "white");
    // grd.addColorStop(0, "white");
    // grd.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
    // grd.addColorStop(1, "rgba(255, 255, 255, 0)");
    // ctx.globalAlpha = this.opacity;
    // ctx.fillStyle = grd;
    // ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    // ctx.fill();
    // ctx.restore();
    // });
  }
}

const playMetorrain = function () {
  const ca = document.createElement("canvas");
  document.body.appendChild(ca);
  const ctx = ca.getContext("2d");

  const _metorrain = new Metorrain(ctx);
  _metorrain.play();

  const cWidth = window.innerWidth;
  const cHeight = window.innerHeight;
  ca.width = cWidth;
  ca.height = cHeight;

  setInterval(() => {
    ctx.clearRect(0, 0, cWidth, cHeight);
    _metorrain.metors.forEach((m) => {
      m.draw();
    });
  }, 1000 / 60);

  const starry = document.createElement("div");
  starry.style.position = "absolute";
  starry.style.top = "0";
  starry.style.left = "0";
  starry.style.width = "100%";
  starry.style.height = "100%";
  starry.className = "starry";

  for (let i = 0; i < 10; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
    star.style.left = `${cWidth * Math.random()}px`;
    star.style.top = `${cHeight * Math.random()}px`;
    star.style.animation = `blink ${Math.random() * 3 + 1}s linear infinite`;
    star.style.width = `4px`;
    star.style.height = `4px`;
    star.style.borderRadius = `50%`;
    star.style.backgroundImage = `radial-gradient(#fff, transparent)`;
    star.className = "star";
    starry.appendChild(star);
  }

  document.body.appendChild(starry);
};

playMetorrain();
