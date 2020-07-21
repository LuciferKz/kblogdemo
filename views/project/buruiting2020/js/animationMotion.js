const AnimationMotion = function (cfg) {
  let defaultConfig = {
    duration: 3000,
    type: 'path',
    path: '',
    pathCanvas: '#path', // 路线画布
    stopSteps: [],
    motionCanvas: '#motion', // 移动画布
    motionHeight: 0,
    motionOffsetY: 0
  }
  let config = Object.assign({}, defaultConfig, cfg)
  console.log('config', config)
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', "path"); 
  const points = []
  const ca = document.querySelector(config.pathCanvas);
  const ctx = ca.getContext('2d');
  ca.width = config.width
  ca.height = config.height || 300

  const mca = document.querySelector(config.motionCanvas)
  const mctx = mca.getContext('2d');
  mca.width = config.width
  mca.height = config.height + config.motionHeight / 2 || 300

  const motionEl = document.createElement('img');
  motionEl.src = config.motionImg;
  motionWidth = config.motionWidth * config.ratio;
  motionHeight = config.motionHeight * config.ratio;
  mca.style.top = -motionHeight / 2 + 'px';

  let isPause = false
  let isStop = true

  function init () {
    pathElement.setAttributeNS(null, 'd', config.path);
    let idx = 0
    let length = pathElement.getTotalLength()
    while (idx <= length) {
      const x = parseInt(pathElement.getPointAtLength(idx).x) * config.ratio;
      const y = parseInt(pathElement.getPointAtLength(idx).y) * config.ratio;
      points.push({x, y})
      idx++;
    }
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#FFF";
  }
  
  function move(x, y) {
    mctx.save();
    mctx.translate(0, motionHeight / 2 + config.motionOffsetY * config.ratio);
    mctx.drawImage(motionEl, 0, 0, 132, 84, x - motionWidth / 2, y - motionHeight / 2, motionWidth, motionHeight);
    mctx.restore();
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
    let duration = config.duration
    let frames = 120
    let totalFrames = duration / 1000 * frames
    let stepFrames = Math.round(length / totalFrames)
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
      }
    }, 1000 / frames)
  }

  function drawMotion () {
    let step = 0
    let length = points.length
    let duration = config.duration
    let frames = 120
    let totalFrames = duration / 1000 * frames
    let stepFrames = Math.round(length / totalFrames)
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
    isPause = !isPause;
  }

  init()

  return {
    start (type) {
      isPause = false;
      if (isStop) {
        isStop = false;
        if (type === 'path') {
          drawPath();
        } else if (type === 'motion') {
          drawMotion();
        }
      }
    },
    stop () {},
    stopAt,
    pause,
    toggle,
    draw
  }
}