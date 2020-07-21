(function () {

  "use strict";

  document.body.onselectstart = function () {
    return false;
  }

  const getDom = function (selector) {
    return document.querySelector(selector);
  }

  const getDoms = function (selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  /* loading */
  var oDomLayerLoading = getDom("#loader");

  var oPreload = new PreLoad();
  oPreload.setCallback({
      finish: function(preload){
        setTimeout(function(){
          oDomLayerLoading.style.display = "none";
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

  const block = getDom('.block');
  const layerIcons = getDom('.layer-icons');

  const events = {
    switching: false,

    currentIndex: 0,

    currentPage: null,

    listener: {},

    switch (data) {
      let n = data.target;
      console.log(data)
      if (this.currentIndex === n) return;
      if (this.currentPage.classList.contains('enter')) return;
      if (this.switching) return;
      this.currentIndex = n;
      const leaveDelay = this.currentPage.dataset.leaveDelay;
      this.switching = true;
      setTimeout(() => {
        this.trigger(this.currentPage, 'leave')
        this.currentPage = pages[n];
        const enterDelay = this.currentPage.dataset.enterDelay;
        setTimeout(() => {
          this.trigger(this.currentPage, 'enter')
        }, enterDelay)
      }, leaveDelay)
    },
    slideToNext (data, el) {
      const n = parseInt(data.current) + 1;
      this.currentPage.style.transitionDuration = data.dur + 's';
      this.currentPage.style.transform = `translate(-${n * 7.5}rem, 0)`;
      el.dataset.current = n;
      console.log(el.dataset);
    },
    leave (data, el) {
      event.on(el, 'animationend', (e) => {
        if (!e.target.classList.contains('page')) return;
        el.classList.remove('active');
        el.classList.remove('leave');
      })
      el.classList.add('leave');
      if (layerIcons) layerIcons.classList.remove('active');
    },
    enter (data, el) {
      if (data.blockOpacity) block.style.opacity = data.blockOpacity;
      event.on(el, 'animationend', (e) => {
        if (!e.target.classList.contains('page')) return;
        el.classList.remove('enter');
        if (data.activeIcons) layerIcons.classList.add('active');
        if (data.enter) {
          setTimeout(() => {
            this.trigger(el, data.enter);
          }, data.leaveDelay || 0)
        }
        this.switching = false;
      })
      el.classList.add('active');
      el.classList.add('enter');
      runGroup(data.groupName)
    },
    replace (dt, dom) {
      const gif = dom.querySelector('img');
      gif.src = gif.src.replace('gif', 'png');
    },
    runPage (data) {
      runGroup(data.groupName);
    },
    beginAnimationMotion () {
      this.am.start('motion');
    },
    trigger (el, evt) {
      const fn = this[evt];
      el.dataset.elName && this.publish(`${el.dataset.elName}.${evt}`)
      if (!fn) return false;
      this[evt](el.dataset, el);
    },
    listen (evt, cb) {
      this.listener[evt] = cb
    },
    publish (evt) {
      const cb = this.listener[evt]
      cb && cb()
    }
  }
  
  const pages = getDoms('.page');

  events.currentPage = pages[0]

  getDoms('*[data-click]').forEach(item => {
    event.on(item, 'touchstart', () => {
      events.trigger(item, 'click');
      events.trigger(item, item.dataset.click);
    })
  })

  const groups = {}

  getDoms('[data-group]').forEach(item => {
    const groupName = item.dataset.group;
    if (!groups[groupName]) groups[groupName] = [];
    const group = groups[groupName];
    group[item.dataset.index] = Object.assign({}, { el: item }, item.dataset)
  })

  const runGroup = function (name) {
    runTransition(groups[name])
  }

  const runTransition = function (g) {
    let delay = 0
    for (let i = 0; i < g.length; i++) {
      const item = g[i];
      if (!item) continue;
      delay += parseFloat(item.delay)
      let _delay = delay;
      item.el.classList.add(item.hide);
      setTimeout(() => {
        setTimeout(() => {
          item.el.style.transition = `all ${ item.dur || 1 }s ${ item.timingFn || 'linear' } ${ 0 }s`
          item.el.classList.remove(item.hide);
          item.el.classList.add(item.show);

          const gifEnd = item.gifEnd;
          if (gifEnd === 'freeze') {
            setTimeout(() => {
              events.trigger(item.el, 'replace')
            }, item.gifDur * 1000)
          }
        }, _delay * 1000)
      }, 100)
    }
  }
  
  getDoms('[data-animation-motion]').forEach(item => {
    const begins = item.dataset.begin.split(',');
    begins.forEach(evt => {
      events.listen(evt, () => {
        console.log('listen', item)
        events.trigger(item, 'beginAnimationMotion')
      })
    })
  })

  const loadingSvg = setInterval(() => {
    const svgWidth = document.getElementById('rainbow-path').width.baseVal.value;
    if (svgWidth) {
      clearInterval(loadingSvg);
      const svgHeight = document.getElementById('rainbow-path').height.baseVal.value;
      let am = AnimationMotion({
        path: 'M2.65,41.25c132-96,287.41,32.3,382,30,187.45-4.58,264.65-143.36,749,.08,405,119.92,392-105.87,754,1.92,366,109,329-129,750,3.07,407.56,127.86,376-205.07,758.22-7.58,0,0,181.81,97.51,367.81,25.51',
        motionImg: './static/img/rocket.png',
        ratio: svgWidth / 3760,
        width: svgWidth,
        height: svgHeight,
        duration: 20000,
        stopSteps: [390, 1150, 1920, 2690],
        motionWidth: 132,
        motionHeight: 84,
        motionOffsetY: 20,
      });

      events.am = am;
  
      // events.trigger(pages[1], 'switch')
    }
  }, 40)
} ())