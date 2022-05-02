import Util from "../../util";
import timingFn from "./timingFn";

class Animate {
  constructor(cfg) {
    const defaultCfg = {
      queue: [],
    };
    this._cfg = Util.mix({}, defaultCfg, cfg);
  }

  isExsit(item) {
    const queue = this.get("queue");
    const id = item.shape.get("id");
    const property = item.property;
    return Util.find(
      queue,
      (m) => m.shape.get("id") === id && m.p === property
    );
  }

  add(item) {
    return;
    const shape = item.shape;
    if (!shape) return false;
    const property = item.property;
    if (!property) return false;
    const exsitItem = this.isExsit(item);
    if (exsitItem) {
      exsitItem.pasue = true;
      this.update(exsitItem, item);
    } else {
      const queue = this.get("queue");
      const style = shape.get("style");
      const beginingValue =
        property === "size" ? shape.get("size") : style[property];
      queue.push(
        Util.mix({}, this.getDefaultProp(), {
          shape,
          p: property, // property 属性
          t: 0, // current time 当前时间
          b: beginingValue || 0, // beginning value 初始值
          c: item.value - beginingValue || 0, // change in value
          d: item.duration || 1000, // duration 持续时间
        })
      );
    }
    const running = this.get("running");
    if (!running) this.runQueue();
  }

  update(exsitItem, item) {
    const property = item.property;
    const shape = item.shape;
    const style = shape.get("style");
    const beginingValue =
      property === "size" ? shape.get("size") : style[property];
    exsitItem.t = 0;
    exsitItem.b = beginingValue || 0;
    exsitItem.c = item.value - beginingValue || 0;
    exsitItem.d = item.duration || 1000;
  }

  remove(item) {
    const queue = this.get("queue");
    const index = queue.indexOf(item);
    queue.splice(index, 1);
  }

  runQueue() {
    const graph = this.get("graph");
    let queue = this.get("queue");
    const interval = setInterval(() => {
      graph.autoPaint();
      if (!queue.length) {
        clearInterval(interval);
        this.set("running", false);
        return false;
      }
      Util.each(queue, (item) => {
        if (item) {
          !item.pause && this.run(item);
        }
      });
      queue = Util.filter(queue, (item) => !item.pause);
      this.set("queue", queue);
    }, 1000 / 60);
    this.set("running", true);
  }

  run(item) {
    if (!item) return false;
    const shape = item.shape;
    if (!shape) return false;
    const cfg = {};
    let t = item.t + 1000 / 60;
    let d = item.d;
    cfg[item.p] = timingFn[item.timingFunction](item.t, item.b, item.c, item.d);
    shape.update(cfg);
    item.t = t;
    if (t >= d) item.pause = true;
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

  getDefaultProp() {
    return {
      timingFunction: "linear",

      delay: 0,

      duration: 1000,
    };
  }
}

export default Animate;
