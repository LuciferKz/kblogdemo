import Util from "../../util";

class VueElement {
  constructor(cfg) {
    const defaultCfg = {
      el: null,
      component: null,
      template: null,
      data: {},
      props: {},
      events: {},
      parent: null,
      hidden: false,
      x: 0,
      y: 0,
      id: "",
    };
    this._cfg = Util.mix({}, defaultCfg, cfg);
    this.init();
  }

  init() {
    const parent = this.get("parent");
    const id = `node-${parent.get("id")}`;
    this.set("id", id);
    this.set("hidden", parent.get("hidden"));
    this.create();
    this.updatePosition();
  }

  create() {
    const parent = this.get("parent");
    const box = parent.get("box");

    this.set("style", {
      position: "absolute",
      width: `${box.width}px`,
      height: `${box.height}px`,
      zIndex: 9999,
      userSelect: "none",
      top: `${box.t}px`,
      left: `${box.l}px`,
    });
  }

  bindEl() {
    const id = this.get("id");
    const el = document.getElementById(id);
    this.set("el", el);
    this.updatePosition(this.get("x"), this.get("y"));
  }

  updatePosition(x, y) {
    const id = this.get("id");
    const el = this.get("el") || document.getElementById(id);
    const style = this.get("style");

    this.set("x", x);
    this.set("y", x);

    if (el) {
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;

      style.top = `${y}px`;
      style.left = `${x}px`;
    }
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

export default VueElement;
