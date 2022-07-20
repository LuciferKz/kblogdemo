const random = function (m, n) {
  return Math.random() * n + m;
};

class Metorrain {
  constructor(opt) {
    this.opt = Object.assign(
      {},
      {
        count: 10,
      },
      opt
    );
    const ca = document.createElement("canvas");
    opt.container.appendChild(ca);
    this.init(ca);
  }

  init(ca) {
    this.metors = [];
    this.ctx = ca.getContext("2d");
    this.addMetors(this.count);
    console.log(this.opt.container.scrollWidth);
    const cWidth = this.opt.container.scrollWidth;
    const cHeight = this.opt.container.scrollHeight;
    ca.width = cWidth;
    ca.height = cHeight;
    this.cWidth = cWidth;
    this.cHeight = cHeight;
  }

  play() {
    this.process = setInterval(() => {
      this.addMetors(this.opt.count - this.metors.length);
      this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
      for (let i = this.metors.length - 1; i > -1; i--) {
        let m = this.metors[i];
        m.move();
        if (m.start.x + m.opt.size < 0 || m.start.y > this.cHeight) {
          this.metors.splice(i, 1);
        }
        m.draw();
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
        size: Math.random() * 50 + 30,
        speed: Math.round(Math.random() * 50) / 10 + 2,
      },
      opt
    );
    this.angle = Math.random() * -40 + -20;
    const x =
      Math.round(Math.random() * window.innerWidth) + window.innerWidth / 2;
    const y = -Math.round(Math.random() * 1000);
    this.opacity = 0.05;
    this.start = { x, y };
    this.speedX = this.opt.speed;
    this.speedY = Math.tan((Math.PI / 180) * -this.angle) * this.speedX;
  }

  move() {
    this.start.x = this.start.x - this.speedX;
    this.start.y = this.start.y + this.speedY;
    this.opacity = this.opacity + 0.01;
  }

  draw() {
    requestAnimationFrame(() => {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = this.opacity;
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
      ctx.rotate((Math.PI / 180) * this.angle);
      ctx.translate(-this.start.x, -this.start.y);
      ctx.fillRect(this.start.x, this.start.y, this.start.x + this.opt.size, 2);
      ctx.restore();
    });
  }
}

class Starry {
  constructor(opts = {}) {
    const starry = document.createElement("div");
    starry.style.position = "absolute";
    starry.style.top = "0";
    starry.style.left = "0";
    starry.style.width = "100%";
    starry.style.height = "100%";
    starry.className = "starry";
    this.el = starry;
    this.opts = opts;
    const cWidth = opts.container.scrollWidth;
    const cHeight = opts.container.scrollHeight;
    this.cWidth = cWidth;
    this.cHeight = cHeight;
    this.init();
    this.opts.container.appendChild(starry);
  }

  init() {
    this.insertCssRule();
    const stars = this.getStar("cross");
    this.el.appendChild(stars);
  }

  insertCssRule() {
    const sheet = document.styleSheets[0];

    let newCssRule = `
      @keyframes blink {
        0% {
          opacity: 0;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.5);
        }
        100% {
          opacity: 0;
          transform: scale(1);
        }
      }
    `;
    sheet.insertRule(newCssRule);
  }

  getStar(type) {
    if (type === "point") {
      const stars = document.createDocumentFragment();
      for (let i = 0; i < this.opts.count; i++) {
        const star = document.createElement("div");
        star.style.borderRadius = `50%`;
        star.style.opacity = `0`;
        star.style.backgroundImage = `radial-gradient(rgba(255, 255, 255, 0.8) 0%, transparent 70%, transparent 100%)`;
        star.style.position = "absolute";
        star.style.left = `${this.cWidth * Math.random()}px`;
        star.style.top = `${this.cHeight * Math.random()}px`;
        star.style.animation = `blink ${Math.random() * 3 + 1}s linear ${
          Math.random() * 2
        }s infinite`;
        star.style.width = `6px`;
        star.style.height = `6px`;
        star.className = "star";
        stars.appendChild(star);
      }
      return stars;
    } else if (type === "cross") {
      const stars = document.createElement("div");
      stars.style.position = "absolute";
      stars.style.width = this.cWidth + "px";
      stars.style.height = this.cHeight + "px";
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      // stars.appendChild(defs);
      // stars.appendChild(group);
      // defs.appendChild(polygon);

      // polygon.setAttribute("id", "star");
      const points = [10, 0, 12, 8, 20, 10, 12, 12, 10, 20, 8, 12, 0, 10, 8, 8];
      polygon.setAttribute("fill", "white");

      for (let i = 0; i < this.opts.count; i++) {
        var star = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        const rd = random(0.2, 0.3);
        const _polygon = polygon.cloneNode();
        _polygon.setAttribute("points", points.map((p) => p * rd).join(" "));
        star.appendChild(_polygon);
        star.setAttribute("width", "20");
        star.setAttribute("height", "20");
        star.style.position = "absolute";
        star.style.left = `${random(0, this.cWidth - 20)}px`;
        star.style.top = `${random(0, this.cHeight - 20)}px`;
        star.style.animation = `blink 3s linear ${random(0, 1)}s infinite`;
        //随机设置星星的透明度
        // star.setAttribute("opacity", random(0, 1).toString());
        stars.appendChild(star);
      }
      return stars;
    }
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

  draw() {}
}

class DarkSky {
  constructor(container = document.body) {
    this.init(container);
  }

  init(container) {
    const sky = document.createElement("div");
    sky.className = "dark-sky";
    sky.style.position = "absolute";
    sky.style.top = 0;
    sky.style.left = 0;
    sky.style.width = "100%";
    sky.style.height = "100%";
    sky.style.zIndex = "1";
    container.appendChild(sky);

    const _metorrain = new Metorrain({ container: sky, count: 20 });
    _metorrain.play();
    const _starry = new Starry({ container: sky, count: 20 });
  }
}
