class KParallax {
  constructor (opt) {
    this.opt = Object.assign({}, {
      selector: '',
      scale: 1.2, // 根据的比例来设置
      // perspective: 5,
      offsetGamma: 0,
      offsetBeta: 0,
      perspective: 1000,
    }, opt)
    this.init()
  }
  
  init () {
    const layers = document.querySelectorAll(`${this.opt.selector} .layer`)
    layers.forEach(l => {
      l.style.position = 'absolute'
      l.style.zIndex = (1 - l.dataset.depth).toFixed(2) * 10
    })
    this.layers = layers;
  }

  go () {
    const opt = this.opt;
    const cWidth = window.innerWidth;
    const cHeight = window.innerHeight;
    const center = { x: cWidth / 2, y: cHeight / 2 };
    this.cWidth = cWidth;
    this.cHeight = cHeight;

    document.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission()
      .then(state => {
        if(state === "granted"){//允许
            console.error("用户允许",state)
        }else if(state === "denied"){//拒绝
            console.error("用户拒绝",state)
        }else if(state === "prompt"){
            console.error("用户干了啥",state)
        }
      }).catch(function(err){
          alert('error: ' + err);
      });
    })

    if( window.DeviceOrientationEvent ){

      // 在135°的旋转过程中移动的距离
      let wratio = cWidth / 135
      let hratio = cHeight / 135
      let orientation = 0
      window.onorientationchange = function(){
        // window.location.reload(true); //刷新操作
        switch(window.orientation){
          case -90:
          case 90:
              alert("横屏:" + window.orientation);
          break;
          case 0:
          case 180:
              alert("竖屏:" + window.orientation);
          break;
        }
        orientation = window.orientation
      }
      window.addEventListener('deviceorientation', (e) => {
        const alpha = e.alpha // 0 ~ 360 z
        const beta = e.beta //-180 ~ 180 x
        const gamma = e.gamma //  -90 ~ 90 y

        let clientY = 0;
        let clientX = 0;

        if (orientation === 0) {
          // beta 45 ~ -45
        } else if (orientation === 90) {
          // beta 45 ~ -90
          clientY = Math.round(hratio * gamma)
        } else if (orientation === -90) {
          // beta -45 ~ 90
          clientY = Math.round(hratio * gamma)
        } else {
          // beta -45 ~ 45
        }
        clientX = center.x;
        const diffX = clientX - center.x;
        const diffY = clientY - center.y;

        document.getElementById('debuger').innerHTML = `
          alpha: ${ Math.round(alpha) };
          beta: ${ Math.round(beta) };
          gamma: ${ Math.round(gamma) };
          orientation: ${ orientation };
          clientY: ${ clientY };
        `
        this.move(diffX, diffY)
      })
    } else {
      // alert('你的设备不支持deviceorientatiinevent')
      // 深度 影响 焦点移动时 层的移动量
      document.addEventListener('mousemove', (e) => {
        const clientX = e.clientX
        const clientY = e.clientY
        const diffX = clientX - center.x 
        const diffY = clientY - center.y
        this.move(diffX, diffY)
      })
    }
  }

  move (diffX, diffY) {
    const opt = this.opt;
    const layers = this.layers;
    const cWidth = this.cWidth;
    const cHeight = this.cHeight;
    const range = { hor: { max: cWidth / 2, min: cWidth / 2 }, ver: { max: cHeight / 2, min: cHeight / 2 }};
    const offsetX = (cWidth * opt.scale - cWidth) / 2;
    const offsetY = (cHeight * opt.scale - cHeight)  / 2;
    let limit = { t: offsetY, l: offsetX, b: offsetY, r: offsetX };

    let translateX = 0;
    let translateY = 0;
    if (diffX > 0) {
      // 焦点右移
      translateX = diffX / range.hor.max * limit.l
    } else {
      // 焦点左移
      translateX = diffX / range.hor.min * limit.r
    }
    if (diffY > 0) {
      // 焦点下移
      translateY = diffY / range.hor.max * limit.t
    } else {
      // 焦点上移
      translateY = diffY / range.hor.min * limit.b
    }

    // if (translateX < -limit.l) translateX = -limit.l
    // if (translateX > limit.r) translateX = limit.r
    // if (translateY < -limit.t) translateY = -limit.t
    // if (translateY > limit.b) translateY = limit.b

    layers.forEach(l => {
      // l.style.transform = `translate(${ translateX * (1 + (opt.perspective * (1 - l.dataset.depth))) }px, ${ translateY * (1 + (opt.perspective * (1 - l.dataset.depth))) }px)`
      l.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`
    })
  }
}