(function () {

  
  "use strict";

  const touchstart = document.body.ontouchstart ? 'touchstart' : 'mousedown'

  const getDom = function (selector) {
    return document.querySelector(selector);
  }

  const getDoms = function (selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  var oDomLayerLoading = getDom("#loader");

  var oPreload = new PreLoad();
  oPreload.setCallback({
      finish: function(preload){
        setTimeout(function(){
          oDomLayerLoading.style.display = "none";
          // buruiting.switch(0);
        },1000);
      },
  });

  oPreload.start();

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

  const buruiting = {
    switching: false,

    currentIndex: 0,

    currentPage: null,

    switch (n) {
      if (this.currentIndex === n) return;
      if (this.currentPage.classList.contains('enter')) return;
      if (this.switching) return;
      this.currentIndex = n;
      const leaveDelay = this.currentPage.dataset.leaveDelay;
      this.switching = true;
      setTimeout(() => {
        this.leave(this.currentPage);
        this.currentPage = pages[n];
        const enterDelay = this.currentPage.dataset.enterDelay;
        setTimeout(() => {
          this.enter(this.currentPage);
        }, enterDelay)
    }, leaveDelay)
    },
    leave (page) {
      event.on(page, 'animationend', (e) => {
        if (!e.target.classList.contains('page')) return;
        page.classList.remove('active');
        page.classList.remove('leave');
      })
      page.classList.add('leave');
      layerIcons.classList.remove('active');
    },
    enter (page) {
      if (page.dataset.blockOpacity) block.style.opacity = page.dataset.blockOpacity;
      event.on(page, 'animationend', (e) => {
        if (!e.target.classList.contains('page')) return;
        page.classList.remove('enter');
        if (page.dataset.activeIcons) layerIcons.classList.add('active');
        if (page.dataset.enter) {
          setTimeout(() => {
            this.trigger(page, page.dataset.enter);
          }, page.dataset.leaveDelay || 0)
        }
        this.switching = false;
      })
      page.classList.add('active');
      page.classList.add('enter');
    },
    trigger (dom, evt) {
      if (evt === 'switch') {
        this.switch(dom.dataset.target)
      }
    },
  }
  
  const pages = getDoms('.page');

  buruiting.currentPage = pages[0]
  buruiting.currentPage.classList.add('active')

  getDoms('*[data-click]').forEach(item => {
    event.on(item, touchstart, (e) => {
      buruiting[item.dataset.click](item.dataset.target);
    })
  })

  document.addEventListener(touchstart, (e) => {
    // e.preventDefault();
  }, { passive: true })
  document.addEventListener('touchmove', (e) => {
    // e.preventDefault();
  }, { passive: true })
  document.body.onselectstart = function () {
    return false;
  }

  // var oDomAnimate = document.getElementById('animateMotion');

  // document.onclick = function () {
  //     startAnimation();
  // }

  // var startAnimation = function () {
  //     oDomAnimate.beginElement();
  // }

  // buruiting.switch(1);
  // console.log(window.innerWidth);
  if (window.innerHeight < 667) {
    pages.forEach((item) => {
      item.style.top = '-0.6rem'
    })
  }
} ())