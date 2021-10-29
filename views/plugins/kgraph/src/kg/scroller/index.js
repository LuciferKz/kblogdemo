import newElement from "../../util/dom/new-element";
import Util from "../../util";
import raf from "../util/raf";

const scrollEvents = {
  downPoint: null,
  prevPoint: null,
  direction: "vertical",
  scroller: null,
  mousedown: function(e, dir) {
    scrollEvents.direction = dir;
    scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", scrollEvents.mousemove);
    document.addEventListener("mouseup", scrollEvents.mouseup);
  },
  mousemove: function(e) {
    e.preventDefault();
    let se = scrollEvents;
    let scroller = se.scroller;
    if (scrollEvents.direction === "vertical" && scroller.get("hasVer")) {
      scroller.scrollVer(e.clientY - scrollEvents.prevPoint.y);
    } else if (
      scrollEvents.direction === "horizontal" &&
      scroller.get("hasHor")
    ) {
      scroller.scrollHor(e.clientX - scrollEvents.prevPoint.x);
    }
    scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
  },
  mouseup: function(e) {
    document.removeEventListener("mousemove", scrollEvents.mousemove);
    document.removeEventListener("mouseup", scrollEvents.mouseup);
  },
};

const convertToTranslate = function(size, origin, ratio) {
  return (size / 2 + origin) * ratio - size / 2;
};

const convertToOriTranslate = function(size, origin, ratio) {
  return (size / 2 + -origin) / ratio - size / 2;
};

class Scroller {
  constructor(cfg) {
    const defaultCfg = {
      container: null,
      // 垂直滚动条
      vbar: null,
      // 水平滚动条
      hbar: null,
      // 滚动区域宽度
      width: 1000,
      // 滚动区域高度
      height: 500,

      scrollTop: 0,

      scrollLeft: 0,
      // 垂直滚动条bar高度
      vbarSize: 0,
      // 水平滚动条bar宽度
      hbarSize: 0,

      refs: {},

      graph: null,
      // 滚轮速度
      speed: 20,
      // 滚动条大小
      barSize: 10,

      originTranslateX: 0,

      originTranslateY: 0,
      // 滚动后画布水平偏移值
      translateX: 0,
      // 滚动后画布垂直偏移值
      translateY: 0,
      // 滚动条组件状态 running 正常 pause 暂停（不可滚动）
      status: "running",

      ratio: null,
    };
    this._cfg = Util.mix({}, defaultCfg, cfg);
    this.init();
  }

  init() {
    this.buildLayout();
    // this.changeSize();
    const graph = this.get("graph");
    const container = this.get("container");
    const speed = this.get("speed");
    container.onWheel((e) => {
      raf(() => {
        if (this.get("status") === "pause") return;
        e.preventDefault();

        const deltaX = Math.abs(e.deltaX);
        const deltaY = Math.abs(e.deltaY);
        if (deltaY > deltaX) {
          this.get("hasVer") && this.scrollVer(e.deltaY * speed);
        } else {
          this.get("hasHor") && this.scrollHor(e.deltaX * speed);
        }
      });
    });

    scrollEvents.scroller = this;

    const vbar = this.get("vbar");
    vbar.on("mousedown", (e) => {
      scrollEvents.mousedown(e, "vertical");
    });

    const hbar = this.get("hbar");
    hbar.on("mousedown", (e) => {
      scrollEvents.mousedown(e, "horizontal");
    });

    graph.on("changeSize", () => {
      this.changeSize();
    });
  }

  reset() {
    this.set("scrollLeft", 0);
    this.set("scrollTop", 0);
  }

  start() {
    this.set("status", "running");
  }

  pause() {
    this.set("status", "pause");
  }

  buildLayout() {
    const refs = {};
    newElement(
      {
        tag: "div",
        ref: "scrollContainer",
        props: { className: "scroll-container" },
        style: { position: "absolute", top: "0", left: "0" },
        children: [
          {
            tag: "div",
            props: { className: "scroll-vertical-container" },
            children: [
              {
                tag: "div",
                ref: "scrollVerBar",
                props: { className: "scroll-bar" },
              },
            ],
          },
          {
            tag: "div",
            props: { className: "scroll-horizontal-container" },
            children: [
              {
                tag: "div",
                ref: "scrollHorBar",
                props: { className: "scroll-bar" },
              },
            ],
          },
        ],
      },
      refs
    );

    this.set("scroller", refs.scrollContainer);
    this.set("vbar", refs.scrollVerBar);
    this.set("hbar", refs.scrollHorBar);
    this.get("container").append(refs.scrollContainer);
  }

  changeSize() {
    let graph = this.get("graph");
    let ratio = graph.get("ratio");
    let barSize = this.get("barSize");
    let width = graph.get("width");
    let height = graph.get("height");
    this.set("width", width);
    this.set("height", height);
    let canvasWidth = graph.get("width");
    let canvasHeight = graph.get("height");
    let diagramWidth = graph.get("diagramWidth") * ratio;
    let diagramHeight = graph.get("diagramHeight") * ratio;
    let vbar = this.get("vbar");
    let hbar = this.get("hbar");
    let scroller = this.get("scroller");
    let hasVer = canvasHeight < diagramHeight;
    let hasHor = canvasWidth < diagramWidth;
    let vratio = canvasHeight / diagramHeight;
    let hratio = canvasWidth / diagramWidth;
    let scrollerRatio = this.get("ratio");

    this.set("hasVer", hasVer);
    this.set("hasHor", hasHor);
    this.set("vratio", vratio);
    this.set("hratio", hratio);

    // 变换尺寸先重置scrollLeft和scrollTop
    this.reset();
    scroller.css({
      width: width + barSize + "px",
      height: height + barSize + "px",
    });

    if (hasHor) {
      let hbarSize = hratio * width;
      hbar.css({ width: hbarSize + "px", display: "block" });
      this.set("hbarSize", hbarSize);

      const originTranslateX = this.get("originTranslateX");
      const translateX = convertToTranslate(width, originTranslateX, ratio);
      this.scrollHor(scrollerRatio ? translateX * hratio : 0);
    } else {
      hbar.css({ width: "0px", display: "none", transform: "translate(0,0)" });
      this.scrollHor(0);
    }

    if (hasVer) {
      let vbarSize = vratio * height;
      this.set("vbarSize", vbarSize);
      vbar.css({ height: vbarSize + "px", display: "block" });

      const originTranslateY = this.get("originTranslateY");
      const translateY = convertToTranslate(height, originTranslateY, ratio);
      this.scrollVer(scrollerRatio ? translateY * vratio : 0);
    } else {
      vbar.css({ height: "0px", display: "none", transform: "translate(0,0)" });
      this.scrollVer(0);
    }

    this.set("ratio", ratio);
    // this.scroll();
  }

  scroll() {
    const graph = this.get("graph");
    graph.translate(this.get("translateX"), this.get("translateY"));
    graph.emit("scroll", {
      x: this.get("translateX"),
      y: this.get("translateY"),
    });
  }

  scrollHor(x) {
    const hbar = this.get("hbar");
    const hbarSize = this.get("hbarSize");
    const width = this.get("width");
    const hratio = this.get("hratio");
    const graph = this.get("graph");
    const ratio = graph.get("ratio");
    let scrollLeft = this.get("scrollLeft");

    scrollLeft = scrollLeft + x;
    if (scrollLeft < 0) {
      scrollLeft = 0;
    } else if (scrollLeft + hbarSize > width) {
      scrollLeft = width - hbarSize;
    }

    const translateX = -(scrollLeft / hratio) || 0;

    hbar.css("transform", "translate(" + scrollLeft + "px,0)");
    this.set("scrollLeft", scrollLeft);
    this.set("translateX", translateX);
    this.set(
      "originTranslateX",
      convertToOriTranslate(width, translateX, ratio)
    );
    this.scroll();
  }

  scrollVer(y) {
    const vbar = this.get("vbar");
    const vbarSize = this.get("vbarSize");
    const height = this.get("height");
    const vratio = this.get("vratio");
    const graph = this.get("graph");
    const ratio = graph.get("ratio");
    let scrollTop = this.get("scrollTop");

    scrollTop = scrollTop + y;
    if (scrollTop < 0) {
      scrollTop = 0;
    } else if (scrollTop + vbarSize > height) {
      scrollTop = height - vbarSize;
    }

    const translateY = -(scrollTop / vratio) || 0;

    vbar.css("transform", "translate(0," + scrollTop + "px)");
    this.set("scrollTop", scrollTop);
    this.set("translateY", translateY);

    this.set(
      "originTranslateY",
      convertToOriTranslate(height, translateY, ratio)
    );

    // this.set("originTranslateY", translateY / ratio);
    this.scroll();
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get(key) {
    return this._cfg[key];
  }
}

export default Scroller;
