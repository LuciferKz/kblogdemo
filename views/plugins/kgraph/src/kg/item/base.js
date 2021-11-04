import Util from "../../util";
import getBox from "../util/getBox";
import isPointIn from "../event/util/isPointIn";
import EventEmitter from "../event-emitter";

class Item extends EventEmitter {
  constructor(cfg) {
    super();
    this._cfg = Util.deepMix(this.getDefaultCfg(), cfg);
    this.init(cfg);
  }

  init() {
    const graph = this.get("graph");
    graph.get("itemMap")[this.get("id")] = this;
    this._init();
  }

  _init() {
    const graph = this.get("graph");
    let shapeCfg = Util.mix(this.getDefaultShapeCfg(), this.getShapeCfg());
    shapeCfg.hidden = this.get("hidden");
    // if (!shapeCfg.type) throw new Error(`node(${ this.get('id') }) does not have a shape type`)
    graph.addShape(shapeCfg);
    this.getBox();
    this.subscribe();
  }

  subscribe() {
    const graph = this.get("graph");
    const parent = graph.findById(this.get("parent"));
    if (parent) {
      parent.on("updatePosition", (box) => {
        let x = this.get("x");
        let y = this.get("y");

        if (x !== undefined && y != undefined)
          this.update({ x: x - box.dx, y: y - box.dy });
      });

      parent.on("afterRemoveItem", () => {
        graph.removeItem(this);
      });
    }
  }

  update(cfg = {}) {
    const originPosition = { x: this._cfg.x, y: this._cfg.y };
    // 获取shape配置，并完成节点内置状态改动的更新
    const shape = this.getShapeCfg();

    Util.mix(shape, cfg);

    const isOnlyMove = this._isOnlyMove(cfg);

    if (isOnlyMove) {
      this.updatePosition(shape);
    } else {
      if (originPosition.x !== shape.x || originPosition.y !== shape.y) {
        this.updatePosition(shape);
      }
      if (cfg.width || cfg.height || cfg.r || cfg.size) {
        this.updateSize(shape);
      }
      this.updateShape();
    }
    const graph = this.get("graph");

    graph.autoPaint("update item");
  }

  updatePosition(cfg) {
    const graph = this.get("graph");
    const shapeMap = graph.get("shapeMap");
    const layer = shapeMap[this.get("id")];
    const shape = layer.get("shape") ? layer.get("shape") : layer;
    const ox = shape.get("x");
    const oy = shape.get("y");

    this.set("x", cfg.x);
    this.set("y", cfg.y);
    shape.update({ x: cfg.x, y: cfg.y });
    this.emit("updatePosition", { dx: ox - cfg.x, dy: oy - cfg.y });
  }

  updateSize(cfg) {
    if (cfg.width || cfg.height) {
      if (Util.isArray.shape.size) {
        cfg.size[0] = cfg.width;
        cfg.size[1] = cfg.height;
      } else if (cfg.width) {
        cfg.size = cfg.width;
      } else if (cfg.height) {
        cfg.size = cfg.height;
      }
    } else if (cfg.r) {
      cfg.size = cfg.r;
    }
  }

  updateShape() {
    const shapeCfg = this.get("shape");
    const shape = this.getShape();
    shape.update(shapeCfg);
    this.get("graph").autoPaint("update shape");
  }

  changeLabel(text) {
    const graph = this.get("graph");
    const labelId = this.get("labelId");
    const shapeMap = graph.get("shapeMap");
    this.set("label", text);
    shapeMap[labelId].update({
      content: text,
    });
    graph.autoPaint("changeLabel");
  }

  getShapeCfg() {
    return this._getShapeCfg();
  }

  _getShapeCfg() {
    const shape = this.get("shape");
    Util.mix(shape, {
      x: this._cfg.x,
      y: this._cfg.y,
    });
    return shape;
  }

  getBox() {
    const shape = this.get("shape");
    const box = getBox(shape);
    this.set("box", box);
    return box;
  }

  _isOnlyMove(cfg) {
    if (!cfg) return false;
    const existX = !Util.isNil(cfg.x);
    const existY = !Util.isNil(cfg.y);
    const keys = Object.keys(cfg);
    return (
      (keys.length === 1 && (existX || existY)) ||
      (keys.length === 2 && existX && existY)
    );
  }

  isPointIn(point) {
    return isPointIn(this, point);
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

  setState(key, val) {
    const state = this.get("state");
    const graph = this.get("graph");
    state[key] = val;
    const stateShapeMap = this.get("stateShapeMap");
    const autoPaint = graph.get("autoPaint");
    graph.setAutoPaint(false);

    if (stateShapeMap && stateShapeMap.default) {
      let shapeCfg = Util.deepMix(
        this.getDefaultShapeCfg(),
        stateShapeMap.default
      );
      Util.each(state, (value, name) => {
        if (value) {
          Util.deepMix(shapeCfg, stateShapeMap[name]);
        }
      });
      const style = shapeCfg.style;
      if (style.transition) {
        Util.each(style.transition.property, (prop) => {
          graph.$animate.add(
            Util.mix({}, style.transition, {
              shape: this.getShape(),
              property: prop,
              value: prop === "size" ? shapeCfg.size : style[prop],
            })
          );
        });
      } else if (shapeCfg) {
        let shape = this.get("shape");
        Util.deepMix(shape, shapeCfg);
        this.updateShape();
      }
    }
    this.emit("stateChange", key, val, state);
    graph.setAutoPaint(autoPaint);
  }

  show() {
    const graph = this.get("graph");
    this.set("hidden", false);
    const shape = this.getShape();
    shape.update({ hidden: false });
    this.emit("show");
    graph.autoPaint("show item");
  }

  hide() {
    const graph = this.get("graph");
    this.set("hidden", true);
    const shape = this.getShape();
    shape.update({ hidden: true });
    this.emit("hide");
    graph.autoPaint("hide item");
  }

  getShape() {
    const graph = this.get("graph");
    const shapeMap = graph.get("shapeMap");
    const id = this.get("id");
    const shape = shapeMap[id];
    return shape;
  }

  getDefaultCfg() {
    const defaultCfg = {
      state: {},

      box: {},

      parent: "",

      shape: {},

      alwaysShow: true,
    };
    return Util.mix(defaultCfg, this._getDefaultCfg());
  }

  _getDefaultCfg() {
    return {};
  }

  getDefaultShapeCfg() {
    const graph = this.get("graph");
    const parentId = this.get("parent");
    const shapeMap = graph.get("shapeMap");
    const layer = shapeMap[parentId];

    return {
      id: this.get("id"),

      parent: layer,
    };
  }

  hasParent(id) {
    const graph = this.get("graph");
    let parent = this.get("parent");
    let result = false;
    while (parent) {
      if (parent === id) {
        result = true;
        break;
      }
      parent = graph.findById(parent).get("parent");
    }
    return result;
  }
}

export default Item;
