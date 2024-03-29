(function () {

  "use strict";

  document.body.onselectstart = function () {
    return false;
  }

  const getDom = function (selector, parent = document) {
    return parent.querySelector(selector);
  }

  const getDoms = function (selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }
  const baseUrl = 'http://www.maxbund.com'

  const manifest = [
    `${baseUrl}/buruiting2020/static/img/bg.png`, 
    `${baseUrl}/buruiting2020/static/img/bg1.png`, 
    `${baseUrl}/buruiting2020/static/img/bg2.png`,
    `${baseUrl}/buruiting2020/static/img/bg3.png`,
    `${baseUrl}/buruiting2020/static/img/img2.png`, 
    `${baseUrl}/buruiting2020/static/img/breath.png`, 
    `${baseUrl}/buruiting2020/static/img/evolution.gif`, 
    `${baseUrl}/buruiting2020/static/img/brand.png`, 
    `${baseUrl}/buruiting2020/static/img/earth.gif`, 
    `${baseUrl}/buruiting2020/static/img/rocket.gif`, 
    `${baseUrl}/buruiting2020/static/img/t1.png`, 
    `${baseUrl}/buruiting2020/static/img/t2.png`, 
    `${baseUrl}/buruiting2020/static/img/t3.png`, 
    `${baseUrl}/buruiting2020/static/img/t4.png`, 
    `${baseUrl}/buruiting2020/static/img/t5.png`, 
    `${baseUrl}/buruiting2020/static/img/fingerprint.svg`, 
    `${baseUrl}/buruiting2020/static/img/p4-1.png`, 
    `${baseUrl}/buruiting2020/static/img/p4-2.png`, 
    `${baseUrl}/buruiting2020/static/img/p4-3.png`, 
    `${baseUrl}/buruiting2020/static/img/p4-4.png`, 
    `${baseUrl}/buruiting2020/static/img/p4-5.png`
  ]

  /* loading */
  const oDomLayerLoading = getDom("#loader");

  const oPreload = new PreLoad(manifest);
  oPreload.setCallback({
      finish: function(preload){
        setTimeout(function(){
          oDomLayerLoading.style.display = "none";
          events.trigger(events.pages[0], 'enter');
        },1000);
      },
  });

  oPreload.start();
  /* loading */

  const event = {
    on (dom, evt, fn) {
      dom.addEventListener(evt, fn);
    },
    off (dom, evt, fn) {
      dom.removeEventListener(evt, fn);
    }
  }

  const runGroup = function (name) {
    if (!name) return;
    if (!events.groups[name]) return;
    runTransition(events.groups[name])
  }

  const runTransition = function (g) {
    let delay = 0
    for (let i = 0; i < g.length; i++) {
      const item = g[i];
      if (!item) continue;
      let _delay = 0;
      if (item.delay !== 'immediately') {
        delay = delay + (parseFloat(item.delay) || 0)
        _delay = delay;
      }

      const duration = item.dur ? parseFloat(item.dur) : 1;
      const animType = item.animType || 'animation';

      switch (animType) {
        case 'transition':
          if (item.hide) {
            setStyles(item.el, item.hide);
          }
          setTimeout(() => {
            item.el.style.transition = `all ${ duration }s ${ item.timingFn || 'linear' } ${ _delay || 0 }s`
            setStyles(item.el, item.show)
          }, 100)
          break;
        case 'animation':
          item.el.classList.add(item.hide);
          setTimeout(() => {
            item.el.style.animation = `${item.show} ${ duration }s ${item.timingFn || 'linear'} ${_delay || 0}s ${item.iterationCount || 1} forwards`
            setTimeout(() => { 
              item.el.classList.remove(item.hide); 
              if (item.stay) item.el.style.animation = `${item.stay} 1.5s linear infinite`
            }, (_delay + duration) * 1000 + 100)
          }, 100)
          break;
        case 'animationMotion':
          setTimeout(() => {
            events.am.start('motion');
          }, _delay * 1000)
          break;
        case 'gif':
          const gif = item.el.getElementsByTagName('img')[0];
          const parentNode = gif.parentNode;
          parentNode.removeChild(gif);
          setTimeout(() => {
            parentNode.appendChild(gif);
          }, _delay * 1000)
          break;
      }
    }
  }

  const setStyles = function (el, styles) {
    styles.split(';').forEach((style) => {
      const s = style.split(':');
      const name = s[0];
      const value = s[1];
      el.style[name] = value;
    })
  }

  const block = getDom('.block');
  const layerIcons = getDom('.layer-icons');

  const events = {
    switching: false,

    currentIndex: -1,

    currentPage: null,

    listener: {},

    pages: [

    ],

    parts: { },

    groups: {

    },

    switch (data, el) {
      let n = data.target;
      console.log(n, this.currentIndex, this.currentPage, this.switching);
      if (this.currentIndex === n) return;
      if (this.currentPage && this.currentPage.classList.contains('enter')) return;
      if (this.switching) return;
      this.currentIndex = n;
      const leaveDelay = this.currentPage ? this.currentPage.dataset.leaveDelay || 0 : 0;
      this.switching = true;
      setTimeout(() => {
        this.trigger(this.currentPage, 'leave')
        const currentPage = this.pages[n];
        console.log(currentPage);
        const enterDelay = currentPage.dataset.enterDelay || 0;
        setTimeout(() => {
          this.trigger(currentPage, 'enter')
        }, enterDelay)
      }, leaveDelay * 1000)
    },
    slideToNext (data, el) {
      const n = parseInt(data.current) + 1;
      this.currentPage.style.transitionDuration = data.dur + 's';
      this.currentPage.style.transform = `translate(-${n * 7.5}rem, 0)`;
      el.dataset.current = n;
      const pageName = this.currentPage.dataset.elName;
      const currentPartArr = this.parts[pageName];
      const currentPart = currentPartArr[n];
      currentPart && runGroup(currentPart.dataset.groupName);
      // this.
    },
    leave (data, el) {
      event.on(el, 'animationend', (e) => {
        if (!e.target.classList.contains('page')) return;
        el.classList.remove('active');
        el.classList.remove('leave');
      })
      el.classList.add('leave');
    },
    enter (data, el) {
      if (data.blockOpacity) block.style.opacity = data.blockOpacity;
      event.on(el, 'animationend', (e) => {
        if (!e.target.classList.contains('page')) return;
        el.classList.remove('enter');
        if (data.enter) {
          setTimeout(() => {
            this.trigger(el, data.enter);
          }, (data.leaveDelay || 0) * 1000)
        }
        this.switching = false;
      })
      this.currentPage = el;
      el.classList.add('active');
      el.classList.add('enter');
    },
    runPage (data) {
      runGroup(data.groupName);
    },
    trigger (el, evt) {
      if (!el) return;
      const fn = this[evt];
      const key = `${el.dataset.elName}.${evt}`
      console.log(key);
      el.dataset.elName && this.publish(key);
      if (!fn) return false;
      this[evt](el.dataset, el);
    },
    listen (evt, cb) {
      if (!this.listener[evt]) this.listener[evt] = []
      this.listener[evt].push(cb);
    },
    publish (evt) {
      const fnArr = this.listener[evt];
      if (fnArr) {
        fnArr.forEach(fn => {
          fn();
        })
      }
    }
  }

  const pages = getDoms('.page');

  pages.forEach(item => {
    const pageName = item.dataset.elName;
    getDoms('.part', item).forEach((pitem) => {
      if (!events.parts[pageName]) events.parts[pageName] = [];
      events.parts[pageName].push(pitem)
    });
  });

  getDoms('[data-group]').forEach((item, index) => {
    const groupName = item.dataset.group;
    const groups = events.groups;
    if (!groups[groupName]) groups[groupName] = [];
    const group = groups[groupName];
    group[item.dataset.index || 0] = Object.assign({}, { el: item }, item.dataset);
  })
  
  getDoms('[data-begin]').forEach(item => {
    const begins = item.dataset.begin.split(',');
    begins.forEach(evt => {
      events.listen(evt, () => {
        runGroup(item.dataset.groupName);
      })
    })
  })

  getDoms('[data-hide]').forEach(item => {
    item = Object.assign({}, { el: item }, item.dataset)
    const animType = item.animType || 'animation';
    switch (animType) {
      case 'transition':
        if (item.hide) {
          setStyles(item.el, item.hide);
        }
        break;
      case 'animation':
        item.el.classList.add(item.hide);
        break;
      case 'animationMotion':
        break;
      case 'gif':
        const gif = item.el.getElementsByTagName('img')[0];
        const parentNode = gif.parentNode;
        parentNode.removeChild(gif);
        break;
    }
  })

  const loadingSvg = setInterval(() => {
    const svgWidth = document.getElementById('rainbow-path').width.baseVal.value;
    if (svgWidth) {
      clearInterval(loadingSvg);
      let fm = 0
      const svgHeight = document.getElementById('rainbow-path').height.baseVal.value;
      const keySteps = [390, 1160, 1925, 2695, 3500, 3760]
      let am = AnimationMotion({
        path: 'M2.65,41.25c132-96,287.41,32.3,382,30,187.45-4.58,264.65-143.36,749,.08,405,119.92,392-105.87,754,1.92,366,109,329-129,750,3.07,407.56,127.86,376-205.07,758.22-7.58,0,0,181.81,97.51,367.81,25.51',
        motionImg: './static/img/rocket.png',
        ratio: svgWidth / 3760,
        width: svgWidth,
        height: svgHeight,
        duration: 10000,
        stopSteps: [390, 1160, 1925, 2695, 3500],
        // keyTimes: [2, 2, 2, 2, 'freeze'],
        // keySteps: [0, 760, 1530, 2300, 3060],
        keySteps,
        keyCallbacks: [
          function () {
            events.trigger(events.parts['p3'][0], 'stop')
          },
          function () {
            events.trigger(events.parts['p3'][1], 'stop')
          },
          function () {
            events.trigger(events.parts['p3'][2], 'stop')
          },
          function () {
            events.trigger(events.parts['p3'][3], 'stop')
          },
          function () {
            events.trigger(events.parts['p3'][4], 'stop')
          },
          function () {
            events.trigger(events.pages[2], 'switch');
          },
        ],
        motionWidth: 132,
        motionHeight: 84,
        motionOffsetY: 20,
        afterMotion (data) {
          if (data.currentStep > 390) {
            if (!fm) fm = data.point.x;
            let progress = (data.point.x - fm) / (data.width * 0.8)

            if (progress > 1) progress = 1
            events.pages[2].style.transform = `translate(${-progress * 30}rem,0)`
            getDoms('.p3-text1').forEach(item => {
              item.style.display = 'none';
            })
          }
        },
        afterStart () {

        },
        afterPause (data) {
          layerIcons.classList.remove('active');
          setTimeout(() => {
            layerIcons.classList.add('active');
          }, 100)
          layerIcons.style.left = data.point.x + 'px';

          getDoms('.p3-text1').forEach(item => {
            item.style.display = 'block';
          })
        },
      });

      events.am = am;
      events.pages = pages;
    }
  }, 40)

  var _kGesture = new kGesture()
  _kGesture.bindGesture('swipLeft', function (e) {
    console.log('swipLeft', e)
    let parentNode = e.target
    while (parentNode.tagName !== 'HTML') {
      if (parentNode.dataset.elName) {
        let key = `${ parentNode.dataset.elName }.click`;
        events.publish(key);
      }
      if (parentNode.dataset.click) {
        events.trigger(parentNode, parentNode.dataset.click);
      }
      parentNode = parentNode.parentNode;
    }
  })

  document.addEventListener('click', (e) => {
    let parentNode = e.target
    while (parentNode.tagName !== 'HTML') {
      if (parentNode.dataset.elName) {
        let key = `${ parentNode.dataset.elName }.click`;
        events.publish(key);
      }
      if (parentNode.dataset.click) {
        events.trigger(parentNode, parentNode.dataset.click);
      }
      parentNode = parentNode.parentNode;
    }
  })

} ())