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

  const buruiting = {
    currentPage: null,

    switch (n) {
      this.leave(this.currentPage);
      this.currentPage = pages[n];
      this.enter(this.currentPage);
    },
    leave (page) {
      event.on(page, 'animationend', () => {
        page.classList.remove('active');
        page.classList.remove('leave');
      })
      page.classList.add('leave');
    },
    enter (page) {
      event.on(page, 'animationend', () => {
        page.classList.remove('enter');
      })
      page.classList.add('active');
      page.classList.add('enter');
    }
  }
  
  const pages = getDoms('.page');

  buruiting.currentPage = pages[0]

  getDoms('*[data-click]').forEach(item => {
    event.on(item, 'click', () => {
      buruiting[item.dataset.click](item.dataset.target);
    })
  })

} ())