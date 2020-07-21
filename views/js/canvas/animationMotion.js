const AnimationMotion = function (cfg) {
  let defaultConfig = {
    type: 'path',
    path: '',
    pathCanvas: '#path', // 路线画布
    motionCanvas: '#motion' // 移动画布
  }
  let config = Object.assign({}, defaultConfig, cfg)
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', "path"); 
  const points = []
  const ca = document.querySelector(config.pathCanvas);
  const ctx = ca.getContext('2d');

  const mca = document.querySelector(config.motionCanvas)
  const mctx = mca.getContext('2d');

  let isPause = false

  function init () {
    console.log(config)
    pathElement.setAttributeNS(null, 'd', config.path);
    let idx = 0
    let length = pathElement.getTotalLength()
    while (idx <= length) {
      const x = parseInt(pathElement.getPointAtLength(idx).x);
      const y = parseInt(pathElement.getPointAtLength(idx).y);
      points.push({x, y})
      idx++;
    }
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#FFF";
  }
  
  function move(x, y) {
    mctx.beginPath();
    mctx.arc(x, y, 25, 0, Math.PI*2, true);
    mctx.fillStyle = '#f0f';
    mctx.fill();
    mctx.closePath();
  }

  function draw (f) {
    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;
      ctx.lineTo(x, y);
      ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  function drawPath () {
    let step = 0
    let length = points.length
    let duration = 3000
    let frames = 120
    let totalFrames = duration / 1000 * frames
    let stepFrames = Math.round(length / totalFrames)
    console.log(stepFrames)
    console.time()
    const timer = setInterval(() => {
      if (step < length) {
        for (let i = step; i < step + stepFrames && i < length; i++) {
          let x = points[i].x;
          let y = points[i].y;
          ctx.lineTo(x, y);
          ctx.moveTo(x, y);
        }
        ctx.stroke();
        step = step + stepFrames
      } else {
        clearInterval(timer)
        console.timeEnd()
      }
    }, 1000 / frames)
  }

  function drawMotion () {
    let step = 0
    let length = points.length
    let duration = 3000
    let frames = 120
    let totalFrames = duration / 1000 * frames
    let stepFrames = Math.round(length / totalFrames)
    console.log(stepFrames)
    console.time()
    const timer = setInterval(() => {
      if (!isPause) {
        mctx.clearRect(0, 0, mca.width, mca.height);
        if (step < length) {
          move(points[step].x, points[step].y)
          step = step + stepFrames
          const stopStep = config.stopSteps[0]
          if (step >= stopStep) {
            config.stopSteps.shift();
            step = stopStep;
            isPause = true;
          }
        } else {
          clearInterval(timer)
          console.timeEnd()
        }
      }
    }, 1000 / frames)
  }

  const pause = function () {
    isPause = true
  }

  const stopAt = function () {

  }

  const toggle = function () {
    isPause = !isPause
  }

  init()

  return {
    start (type) {
      if (type === 'path') {
        drawPath()
      } else if (type === 'motion') {
        drawMotion()
      }
    },
    stop () {},
    stopAt,
    pause,
    toggle,
    draw
  }
}

let am = AnimationMotion({
  type: 'path',
  path: 'M2.65,41.25c132-96,287.41,32.3,382,30,187.45-4.58,264.65-143.36,749,.08,405,119.92,392-105.87,754,1.92,366,109,329-129,750,3.07,407.56,127.86,376-205.07,758.22-7.58,0,0,181.81,97.51,367.81,25.51',
  stopSteps: [150, 300],
});
am.draw();
am.start('motion')

document.onclick = function () {
  am.toggle();
  am.stopAt();
}