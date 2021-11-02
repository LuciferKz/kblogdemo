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
    };
    this._cfg = Util.mix({}, defaultCfg, cfg);
    this.init();
  }

  init() {
    const parent = this.get("parent");
    const id = `node-${parent.get("id")}`;
    this.set("id", id);
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

  updatePosition() {
    const parent = this.get("parent");
    const box = parent.get("box");
    const id = this.get("id");
    const el = document.getElementById(id);
    const style = this.get("style");
    if (el) {
      el.style.top = `${box.t}px`;
      el.style.left = `${box.l}px`;

      style.top = `${box.t}px`;
      style.left = `${box.l}px`;
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
