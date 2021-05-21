/**
 * 简单手势插件
 */
 var kGesture = function (options) {
  var gestures = {}, events = {};

  const EVENTS_MAP = {
    touchstart: 'touchstart',
    touchmove: 'touchmove',
    touchend: 'touchend'
  }

  if (!document.body.ontouchstart) {
    Object.assign(EVENTS_MAP, { touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup' })
  }

  /**
   * 添加手势绑定触发函数
   * @param {[type]}   ges [手势名]
   * @param {Function} fn  [回调函数]
   */
  var bindGesture = function (ges, fn) {
    gestures[ges] = fn;
  }

  var excuteGesture = function (ges, e) {
    gestures[ges] && gestures[ges](e);
  }

  var parents = function (parent, cls) {
    if (parent.classList.contains(cls)) {
      return parent
    } else if (parent.tagName === 'HTML') {
      return null
    } else {
      return parents(parent.parentNode, cls)
    }
  }

  var prevents = {
    e: null,
    run: function () {
      if (this.e && (!scrollBox || (this.dir === 'up' && canSwipUp) || (this.dir === 'down' && canSwipDown))) { 
        this.e.preventDefault();
      }
    }
  }
  /**
   * 统一事件监听
   * 预处理点击or触屏点对象
   */
  var bindEvt = function (dom, evt, cb, options) {
    dom.addEventListener(evt, function (e) {
      prevents.e = e
      e = e.changedTouches ? e.changedTouches[0] : e;
      cb(e);
    }, { passive: false })
  };

  var defaults = {
    distance: 50
  };

  options = options || {}

  for (var i in defaults) {
    options[i] = options[i] || defaults[i]
  }

  var startPoint = null,
  scrollBox = null, // 可以滚动的父级容器
  canSwipUp = true,
  canSwipDown = true;

  var resetParams = function () {
    startPoint = null;
    canSwipUp = true;
    canSwipDown = true;
  }

  bindEvt(document, EVENTS_MAP.touchstart, function (e) {
    excuteGesture(EVENTS_MAP.touchstart, e);
    scrollBox = parents(e.target, 'has-scroll')
    if (scrollBox) {
      canSwipUp = scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight
      canSwipDown = scrollBox.scrollTop <= 0
    }
    startPoint = e;
  })

  bindEvt(document, EVENTS_MAP.touchmove, function (e) {
    if (!startPoint) return
    var distanceVer = startPoint.clientY - e.clientY;
    prevents.dir = distanceVer > 0 ? 'up' : 'down';
    excuteGesture(EVENTS_MAP.touchmove, e);
    prevents.run();
  })

  bindEvt(document, EVENTS_MAP.touchend, function (e) {
    excuteGesture(EVENTS_MAP.touchend, e);
    var distanceHor = startPoint.clientX - e.clientX,
    distanceVer = startPoint.clientY - e.clientY;
    if (Math.abs(distanceHor) > Math.abs(distanceVer)) {
      if (distanceHor > options.distance) {
        excuteGesture('swipLeft', e);
      } else if (distanceHor < -options.distance) {
        excuteGesture('swipRight', e);
      }
    } else {
      if (distanceVer > options.distance && canSwipUp) {
        excuteGesture('swipUp', e);
      } else if (distanceVer < -options.distance && canSwipDown) {
        excuteGesture('swipDown', e);
      }
    }
    resetParams()
  })

  return {
    bindGesture: bindGesture
  }
}