var KCanvas = function () {
    var l = this;
    l.childList = [];
    l.length = 0;
    l.status = "live";
    l.ctx = null;
    l.w = 0;
    l.h = 0;
    l.left = 0;
    l.top = 0;
};

KCanvas.prototype = {
    render: function () {
        var l = this;
        l.draw(0, l.childList);
    },
    draw: function (num, arr) {
        var l = this;
        l.ctx.moveTo(l.left, l.top);
        if (arr[num]) {
            if (arr[num] instanceof KCanvas) {
                if (arr[num].status === "dead") {
                    //arr[num].childList = [];
                } else {
                    l.draw(0, arr[num].childList);
                }
            } else {
                if (arr[num].draw && arr[num].status !== "dead") {
                    arr[num].draw();
                }
            }
        }
        if (num < arr.length - 1) {
            num++;
            l.draw(num, arr);
        } else {
        }
    },
    addChild: function (child) {
        var l = this;
        if (child instanceof Array) {
        } else {
            child.ctx = l.ctx;
        }
        l.childList.push(child);
        l.length = l.childList.length;
    },
    clearChild: function () {
        var l = this;
        l.childList = [];
        l.length = 0;
    }
};

var Layer = function () {
    var l = this;
    l.type = "rect";
    l.x = 0;
    l.y = 0;
    l.z = 0;
    l.width = 0;
    l.height = 0;
    l.color = "#000";
    l.stroke = false;
    l.lineWidth = 1;
    l.ctx = null;
}
Layer.prototype = {
    draw: function () {
        var l = this, c = l.ctx;
        if (l.type == "rect") {
            if (l.stroke) {
                c.lineWidth = l.lineWidth;
                c.strokeStyle = l.color;
                c.strokeRect(l.x, l.y, l.width, l.height);
            } else {
                c.fillStyle = l.color;
                c.fillRect(l.x, l.y, l.width, l.height);
            }
        }
    },
    add: function (name, fn) {
        var l = this;
        l[name] = fn;
    },
    remove: function () {
        var l = this;
        l.status = "dead";
    },
    clearChild: function () {
        var l = this;
        l.childList = [];
        l.length = 0;
    }
}
var TextLayer = function (t) {
    var l = this;
    l.x = 0;
    l.y = 0;
    l.z = 0;
    l.content = t || "";
    l.baseline = "top";
    l.color = "#000";
    l.size = "11px";
    l.weight = "normal";
    l.family = "榛戜綋";
    l.align = "left";
    l.shadowBlur = 0;
    l.shadowColor = "#000";
    l.shadowOffsetX = 0;
    l.shadowOffsetY = 0;
    l.stroke = false;
}
TextLayer.prototype = {
    draw: function () {
        var l = this, c = l.ctx;
        c.save();
        c.textBaseline = l.baseline;
        c.fillStyle = l.color;
        c.textAlign = l.align;
        c.font = l.weight + " " + l.size + " " + l.family;

        c.shadowBlur = l.shadowBlur;
        c.shadowColor = l.shadowColor;
        c.shadowOffsetX = l.shadowOffsetX;
        c.shadowOffsetY = l.shadowOffsetY;

        if (l.stroke) {
            c.strokeText(l.content, l.x, l.y);
        } else {
            c.fillText(l.content, l.x, l.y);
        }
        c.restore();
    },
    add: function (name,fn) {
        var l = this;
        l[name] = fn;
    },
    remove: function () {
        var l = this;
        l.status = "dead";
    },
    clearChild: function () {
        var l = this;
        l.childList = [];
        l.length = 0;
    }
}
var ImageLayer = function () {
    var l = this;
    l.x = 0;
    l.y = 0;
    l.width = 0;
    l.height = 0;
    l.sx = 0;
    l.sy = 0;
    l.sw = 0;
    l.sh = 0;
    l.dx = 0;
    l.dy = 0;
    l.dw = 0;
    l.dh = 0;
    l.alpha = 1;
    l.rotate = 0;
    l.rx = 0,
    l.ry = 0,
    l.img = null;
}
ImageLayer.prototype = {
    draw: function () {
        var l = this;
        if (l.img) {
            l.ctx.globalAlpha = l.alpha;
            if (l.rotate !== 0) {
                l.ctx.save();
                l.ctx.translate(l.rx, l.ry);
                l.ctx.rotate(l.rotate * Math.PI / 180)
                l.ctx.drawImage(l.img, l.sx, l.sy, l.sw, l.sh, l.x - l.rx, l.y - l.ry, l.width, l.height);
                l.ctx.restore();
            } else {

                l.ctx.drawImage(l.img, l.sx, l.sy, l.sw, l.sh, l.x, l.y, l.width, l.height);
            }
            l.ctx.globalAlpha = 1;
        }
    },
    add: function (name, fn) {
        var l = this;
        l[name] = fn;
    },
    remove: function () {
        var l = this;
        l.status = "dead";
    },
    clearChild: function () {
        var l = this;
        l.childList = [];
        l.length = 0;
    }
}
var LineLayer = function () {
    var l = this;
    l.points = [];
    l.x = 0;
    l.y = 0;
    l.lineCap = "butt"; // "butt", "round", "square" (default "butt")
    l.color = "#000";
    l.lineWidth = 1;
    l.fill = false;
    l.alpha = 1;
}
LineLayer.prototype = {
    draw: function () {
        var l = this, i, len;
        l.ctx.save();
        l.ctx.beginPath();
        l.ctx.lineWidth = l.lineWidth;
        l.ctx.moveTo(l.x, l.y);
        for (i = 0, len = l.points.length; i < len; i++) {
            l.ctx.lineTo(l.points[i].x, l.points[i].y);
        }
        if (l.fill) {
            l.ctx.fillStyle = l.color;
        } else {
            l.ctx.strokeStyle = l.color;
            l.ctx.stroke();
        }
        l.ctx.globalAlpha = l.alpha;
        l.ctx.closePath();
        l.ctx.restore();
    }
}

var KEvent = function () {
    var le = this;
    le.event = {};
}
KEvent.prototype.init = function (ca) {
    var le = this;
    le.ca = ca;
    le.ca.addEventListener("touchstart", function (e) { if (le.event["touchstart"]) { le.handleEvent(e, "touchstart"); } });
    le.ca.addEventListener("touchmove", function (e) { if (le.event["touchmove"]) { le.handleEvent(e, "touchmove"); } });
    le.ca.addEventListener("touchend", function (e) { if (le.event["touchend"]) { le.handleEvent(e, "touchend"); } });
}
KEvent.prototype.addEvent = function (obj, evt, fn) {
    var le = this, l = obj, e = evt, f = fn;
    var newEvt = {
        self:obj,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        callback: fn
    };
    if (le.event[evt]) {
        le.event[evt].push(newEvt);
    } else {
        le.event[evt] = [newEvt];
    }
}
KEvent.prototype.clearEvent = function () {
    var le = this;
    le.event = {};
};
KEvent.prototype.delEvent = function (obj, evt) {
    var le = this, evts = le.event[evt];
    var i, len = evts.length;
    for (i = len - 1; i > -1; i--) {
        if (evts[i].self === obj) {
            evts.splice(i, 1);
        }
    };
}
KEvent.prototype.handleEvent = function (e, evt) {
    var le = this, ev, point, evts = le.event[evt]
    i = 0, len = evts.length;
    if (e.changedTouches) {
        ev = e.changedTouches[0];
    } else {
        ev = e;
    }
    var lx, ly, ex = ev.pageX - le.ca.offsetLeft, ey = ev.pageY - le.ca.offsetTop;
    for (; i < len; i++) {
        if (evts[i]) {
            lx = evts[i].x, ly = evts[i].y;
            if (lx < ex && ly < ey && lx + evts[i].width > ex && ly + evts[i].height > ey) {
                evts[i].callback.call(evts[i].self);
            }
        }
    }
}