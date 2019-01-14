var prefix = '', _addEventListener;

if (document.addEventListener) {
    _addEventListener = 'addEventListener';
} else if (document.attachEvent) {
    _addEventListener = 'attachEvent';
    prefix = 'on';
}

var addEvent = function (el, evt, cb, config) {
    el[_addEventListener](prefix + evt, cb, config)
}

var addWheelEvent = function (el, cb, config) {
    var evt = 'wheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? "mousewheel" : 'DOMMouseScroll'
    addEvent.apply(this, [el, evt, function (e) {
        cb({
            originalEvent: e,
            target: e.target || e.srcElement,
            type: "wheel",
            deltaX: e.wheelDeltaX ? - 1/40 * e.wheelDeltaX : 0,
            deltaY: e.wheelDelta ? - 1/40 * e.wheelDelta :  e.deltaY || e.detail,
            preventDefault: function () {
                e.preventDefault ? e.preventDefault : e.returnValue = false;
            }
        })
    }, config])
}

export {
  addEvent,
  addWheelEvent,
}