(function () {

  const getDom = function (selector) {
    return document.querySelector(selector);
  }

  const getDoms = function (selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  const event = {
    on (dom, evt, fn) {
      dom.addEventListener(evt, fn);
    },
    off (dom, evt, fn) {
      dom.removeEventListener(evt, fn);
    }
  }

  const block = getDom('.block');

  const buruiting = {
    currentIndex: 0,

    currentPage: null,

    switch (n) {
      if (this.currentIndex === n) return;
      this.currentIndex = n;
      const leaveDelay = this.currentPage.dataset.leaveDelay;
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
        console.log(e.target.classList, e.target.classList.contains('page'))
        if (!e.target.classList.contains('page')) return;
        page.classList.remove('active');
        page.classList.remove('leave');
      })
      page.classList.add('leave');
    },
    enter (page) {
      if (page.dataset.blockOpacity) block.style.opacity = page.dataset.blockOpacity;
      event.on(page, 'animationend', (e) => {
        console.log(e.target.classList, e.target.classList.contains('page'), page.dataset)
        if (!e.target.classList.contains('page')) return;
        page.classList.remove('enter');
        if (page.dataset.enter) {
          setTimeout(() => {
            this.trigger(page, page.dataset.enter);
          }, page.dataset.leaveDelay || 0)
        }
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

  getDoms('*[data-click]').forEach(item => {
    event.on(item, 'click', () => {
      buruiting[item.dataset.click](item.dataset.target);
    })
  })

  document.addEventListener('touchstart', (e) => {
    e.preventDefault();
  })
  document.addEventListener('touchmove', (e) => {
    e.preventDefault();
  })
  document.body.onselectstart = function () {
    return false;
  }

  var oDomAnimate = document.getElementById('animateMotion');

  document.onclick = function () {
      startAnimation();
  }

  var startAnimation = function () {
      oDomAnimate.beginElement();
  }

  buruiting.switch(7);
} ())