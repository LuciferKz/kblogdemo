import kutil from './kutil';

const KCanvasEvent = function () {
  let o, 
  offsetx = 0,
  offsety = 0,
  scale = 1,
  event = {},
  clientRect = null;
  let eventObjs = {};
  let init = function (layer) {
    o = layer;
    o.on("mousedown", (e) => { 
      if (event["mousedown"]) { 
        handleEvent(e, "mousedown"); 
      } 
    });
    o.on("mousemove", (e) => {
      if (event["mousemove"]) {
        handleEvent(e, "mousemove"); 
      }
      if (event["mouseleave"]) {
        handleEvent(e, "mouseleave");
      }
      if (event["mouseenter"]) {
        handleEvent(e, "mouseenter");
      }
    });
    o.on("dblclick", (e) => {
      if (event["dblclick"]) handleEvent(e, "dblclick");
    })
    o.on("mouseup", (e) => { 
      if (event["mouseup"]) { 
        handleEvent(e, "mouseup"); 
      }
    });
  }
  let setClientRect = function (cr) {
    clientRect = cr;
  }
  let setOffset = function (x, y) {
    offsetx = x;
    offsety = y;
  }
  let setScale = function (value) {
    scale = value;
  }
  let addEvent = function (obj, evt, fn, opt) {
    let l = obj, id = obj.id;
    if (!eventObjs[id]) {
      eventObjs[id] = {
        self: obj,
        x: l.x,
        y: l.y,
        r: l.x + l.width,
        b: l.y + l.height,
        width: l.width,
        height: l.height,
        enter: false,
        evts: {}
      }
    }
    eventObjs[id].evts[evt] = { fn: fn, opt: opt || {} };
    if (event[evt]) {
        !~event[evt].indexOf(id) && event[evt].push(id);
    } else {
        event[evt] = [id];
    }
  }
  let updateEvent = function (obj, evt) {
    let l = obj;
    if (eventObjs[obj.id]) {
      kutil.extend(eventObjs[obj.id], {
        x: l.x,
        y: l.y,
        r: l.x + l.width,
        b: l.y + l.height,
        width: l.width,
        height: l.height
      })
    }
  }
  let moveEvent = function (obj, type) {
    for (let evt in event) {
      let evts = event[evt], idx = evts.indexOf(obj.id);
      if (type === 'unshift') {
        evts.unshift(evts.splice(idx, 1)[0])
      } else {
        evts.push(evts.splice(idx, 1)[0])
      }
    }
  }
  let delEvent = function (obj) {
    if (eventObjs[obj.id]) {
      delete eventObjs[obj.id]
    }
  }
  let clearEvent = function () {
    event = {};
    eventObjs = {};
  }
  let handleEvent = function (e, evt) {
    let ev = e.changedTouches ? e.changedTouches[0] : e;
    let evts = event[evt],
    i = evts.length - 1,
    ex = (ev.clientX - offsetx - clientRect.left) / scale, 
    ey = (ev.clientY  - offsety - clientRect.top) / scale,
    stopPropagation = false;
    // console.log(ex, offsetx, clientRect.left, ey, offsety, clientRect.top);
    for (; i > -1; i--) {
      let id = evts[i];
      let evtObj = eventObjs[id];

      if (evtObj) {
        let _evt = evtObj.evts[evt];
        if (_evt) {
          let lx = evtObj.x, ly = evtObj.y, lr = evtObj.r, lb = evtObj.b;
          if (lx < ex && ly < ey && lr > ex && lb > ey) {
            if (evt === 'mouseleave') {
              continue;
            } else if (evt === 'mouseenter') {
              if (evtObj.enter) {
                if (stopPropagation) {
                  evtObj.enter = false;
                  evtObj.evts['mouseleave'].fn.call(evtObj.self, e);
                  continue;
                } else {
                  break;
                }
              };
              evtObj.enter = true;
            } else if (stopPropagation) {
              break;
            }
            _evt.fn.call(evtObj.self, e);
            if (_evt.opt.cancelBubble) stopPropagation = true;
          } else if (evt === 'mouseleave' && evtObj.enter) {
            evtObj.enter = false;
            _evt.fn.call(evtObj.self, e);
          }
        }
      }
    }
  }
  return {
    init: init,
    setClientRect: setClientRect,
    setOffset: setOffset,
    setScale: setScale,
    addEvent: addEvent,
    clearEvent: clearEvent,
    updateEvent: updateEvent,
    moveEvent: moveEvent,
    delEvent: delEvent,
    handleEvent: handleEvent
  }
}

export default KCanvasEvent;