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
  // const baseUrl = 'http://demo.zhangzhenkai.com'
  // const manifest = [
  //   `${baseUrl}/views/project/buruiting2020/static/img/img2.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/breath.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/evolution.gif`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/brand.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/earth.gif`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/rocket.gif`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/t1.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/t2.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/t3.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/t4.png`,
  //   `${baseUrl}/views/project/buruiting2020/static/img/t5.png`
  // ]

  // /* loading */
  // const oDomLayerLoading = getDom("#loader");

  // const oPreload = new PreLoad(manifest);
  // oPreload.setCallback({
  //     finish: function(preload){
  //       setTimeout(function(){
  //         oDomLayerLoading.style.display = "none";
  //       },1000);
  //     },
  // });

  // oPreload.start();
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
    runTransition(events.groups[name])
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

  const block = getDom('.block');
  const layerIcons = getDom('.layer-icons');

  const events = {
    switching: false,

    currentIndex: -1,

    currentPage: null,

    listener: {},

    pages: [

    ],

    parts: {
      'p3': []
    },

    groups: {

    },

    switch (data) {
      let n = data.target;
      if (this.currentIndex === n) return;
      if (this.currentPage && this.currentPage.classList.contains('enter')) return;
      if (this.switching) return;
      this.currentIndex = n;
      const leaveDelay = this.currentPage ? this.currentPage.dataset.leaveDelay || 0 : 0;
      this.switching = true;
      setTimeout(() => {
        this.trigger(this.currentPage, 'leave')
        this.currentPage = this.pages[n];
        const enterDelay = this.currentPage.dataset.enterDelay || 0;
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
      const pageName = this.currentPage.dataset.elName;
      const currentPart = this.parts[pageName];
      currentPart && runGroup(currentPart.dataset.groupName);
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
      if (!el) return;
      const fn = this[evt];
      const key = `${el.dataset.elName}.${evt}`
      console.log(key)
      el.dataset.elName && this.publish(key);
      if (!fn) return false;
      this[evt](el.dataset, el);
    },
    listen (evt, cb) {
      this.listener[evt] = cb;
    },
    publish (evt) {
      const cb = this.listener[evt];
      cb && cb();
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

  getDoms('*[data-click]').forEach(item => {
    event.on(item, 'touchstart', () => {
      events.trigger(item, 'click');
      events.trigger(item, item.dataset.click);
    })
  })

  getDoms('[data-group]').forEach(item => {
    const groupName = item.dataset.group;
    const groups = events.groups;
    if (!groups[groupName]) groups[groupName] = [];
    const group = groups[groupName];
    group[item.dataset.index] = Object.assign({}, { el: item }, item.dataset);
  })
  
  getDoms('[data-animation-motion]').forEach(item => {
    const begins = item.dataset.begin.split(',');
    begins.forEach(evt => {
      events.listen(evt, () => {
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
      events.pages = pages;
      events.switch({ target: 2 })
    }
  }, 40)
} ())