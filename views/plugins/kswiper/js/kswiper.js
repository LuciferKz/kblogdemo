var KSwiper = function (options) {
    var wrap, height, maxIdx, curIdx = 0, dur = 300, throttleDur = 1000;

    var bindWheel = function (el, fn) {
        if (document.addEventListener) {
            el.addEventListener('DOMMouseScroll', fn, false);
        }
        el.onmousewheel = fn;
    }

    var addEvent = function (el, evt, fn) {
        if (document.addEventListener) {
            el.addEventListener(evt, fn, false);
        } else if (document.attachEvent) {
            el.attachEvent('on' + evt, fn)
        }
    }
    
    var getDelta = function (e) {
        return (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
    }
    
    var getDirection = function (e) {
        var delta = getDelta(e);
        if (delta > 0) {
            return 'up';
        } else if (delta < 0) {
            return 'down';
        }
        return 'still';
    }

    var throttle = function (fn, delay) {
        var last = 0;
        return function () {
            var now = +new Date();
            if (now - last > delay) {
                fn.apply(this, arguments)
                last = now;
            }
        }
    }

    var swipDown = throttle(function () {
        swipTo(++curIdx);
        wrap.style.transitionDuration = dur + 'ms';
    }, throttleDur)

    var swipUp = throttle(function () {
        swipTo(--curIdx);
        wrap.style.transitionDuration = dur + 'ms';
    }, throttleDur)

    var swipTo = function (idx, anim) {
        if (!anim) {
            wrap.style.transitionDuration = dur + 'ms';
        }
        curIdx = idx;
        scroll();
    }

    var clearDuration = function () {
        wrap.style.transitionDuration = '0ms';
    }

    var scroll = function () {
        curIdx = (curIdx > maxIdx ? maxIdx : (curIdx < 0 ? 0 : curIdx));
        wrap.style.transform = 'translate(0, -' + curIdx * height + 'px';
        switchNav()
        setTimeout(function () {
            clearDuration()
        }, dur)
    }

    var switchNav = function () {
        activeNav && activeNav.classList.remove('active');
        activeNav = navs.item(curIdx);
        activeNav.classList.add('active');
    }
    
    var config = function (opts) {
        wrap = opts.wrap || document.body;
        pages = opts.pages || [];
        navs = opts.navs || [];
        height = opts.height || window.innerHeight;
        maxIdx = pages.length - 1;
    }

    var activeNav = null;

    var wrapwheel = function (e) {
        e = e || window.event;
        var dir = getDirection(e);
        if (dir === 'up') {
            swipUp();
        } else if (dir === 'down') {
            swipDown();
        }
    }

    var initSize = function () {
        if (!options.height) height = window.innerHeight;
        wrap.style.height = height + 'px';
        for (var i = 0, len = pages.length; i < len; i++) {
            pages.item(i).style.height = height + 'px';
        }
    }

    var init = function () {
        wrap.style.height = height + 'px';
        initSize();

        for (var i = 0, len = pages.length; i < len; i++) {
            (function (i) {
                var page = pages.item(i);
                if (page.classList.contains('mouse-wheel')) {
                    var timeout = null, lastTop = 1;
                    bindWheel(page, function (e) {
                        e.cancelBubble = true;
                        e = e || window.event;
                        var dir = getDirection(e);

                        timeout && clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            lastTop = page.scrollTop;
                        }, 50)
                        
                        if (lastTop === 0 && dir === 'up') {
                            swipUp();
                        }
                    })
                }
            } (i))
        }

        for (var i = 0, len = navs.length; i < len; i++) {
            (function (i) {
                navs.item(i).onclick = function () {
                    swipTo(i)
                    this.classList.add('active')
                }
            } (i))
        }

        bindWheel(document, wrapwheel);
        bindWheel(window, wrapwheel);
        swipTo(0);
    }

    window.onresize = function () {
        initSize();
        swipTo(curIdx, true);
    }
    
    config(options)

    return {
        init: init,
        swipTo: swipTo,
    }
}