import Base from "./base";
import { nodeConnect } from "./util";
import { inDirection } from "../util/getPoints";

class Anchor extends Base {
  constructor(cfg) {
    super(cfg);
  }

  _init() {
    const x = this.get("x");
    const y = this.get("y");
    const offset = this.get("offset");
    this.set("x", x + offset.x);
    this.set("y", y + offset.y);

    super._init();
    const graph = this.get("graph");
    const parent = graph.findById(this.get("parent"));
    let dir = this.getPosition();
    this.set("dir", dir);

    let anchors = parent.get("anchors");
    anchors[dir] = this;
    let m = this.get("m");
    anchors[`${m[0]}_${m[1]}`] = this;

    if (graph.get("enableNodeConnect")) nodeConnect(this);
    this._subscribe();
  }

  _subscribe() {
    const graph = this.get("graph");
    const parent = graph.findById(this.get("parent"));

    parent.on("focus", () => {
      this.show();
    });
    parent.on("blur", () => {
      if (!this.get("alwaysShow")) this.hide();
    });
    parent.on("hover", (val) => {
      val ? this.show() : this.hide();
    });
  }

  _getShapeCfg() {
    super._getShapeCfg();
    let shape = this.get("shape");
    shape.hidden = this.get("hidden");
    return shape;
  }

  _getDefaultCfg() {
    return {
      x: 0,

      y: 0,

      state: {},

      hidden: false,

      position: "",

      m: [],
      // 点偏移 px
      offset: { x: 0, y: 0 },

      shape: {
        size: 5,

        type: "circle",

        style: {
          lineWidth: 2,

          stroke: "#CCC",

          fill: "#FFF",
        },
      },

      cancelBubble: true,

      event: true,
      // 生成线点时首个点的偏移量
      edgeOffset: 25,
    };
  }

  isPointIn(point) {
    const eventArea = this.get("eventArea") || {};
    const shape = this.get("shape");
    const r = eventArea.r || shape.size;
    const x = this.get("x");
    const y = this.get("y");
    return this.pointDistance({ x, y }, point) < Math.pow(r, 2);
  }

  pointDistance(p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  }

  getPoint() {
    return { x: this.get("x"), y: this.get("y") };
  }

  getPosition() {
    const m = this.get("m");
    return inDirection(m);
  }
}

export default Anchor;
