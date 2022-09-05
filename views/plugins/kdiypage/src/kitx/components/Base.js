import Util from "@/util";
import { EventEmitter } from "../plugins/event-emitter";
import { newElement } from "../../util/dom";
import ComponentsAttributes from "./attributes";

const transformStyle = function (k) {
  const uppercase = k.match(/[A-Z]/g);
  let newK = k;
  if (uppercase) {
    uppercase.forEach((str) => {
      newK = newK.replace(str, `-${str.toLowerCase()}`);
    });
  }
  return newK;
};

export default class Base extends EventEmitter {
  constructor(cfg = {}) {
    super();
    const _cfg = Util.mix(
      {
        excludes: [],
        includes: [],

        kitx: null,
        seqNum: `kitx-${Util.genUUID()}`, // 唯一标识
        id: null, // ID
        name: null, // Kit Name
        type: "", // 类型

        slots: {},
        refs: {},

        attributes: {},

        emits: [],
      },
      cfg
    );

    const defaultAttributes = ComponentsAttributes[cfg.type];
    if (defaultAttributes) {
      Util.each(defaultAttributes, (value, key) => {
        if (value === "n/a") return;
        _cfg.attributes[key] = _cfg.attributes[key] || value;
      });
    }

    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };
    this.cfg = _cfg;
    this._init();
  }

  _init() {
    this.watchAttributes();
    const ast = this.toAst();
    const slots = this.get("slots");
    const refs = this.get("refs");
    const children = this.get("children");

    const el = newElement(ast, refs, (node, k) => {
      if (node.slot === "default") {
        slots["$default"] = k;
        if (children && Util.isString(children)) {
          k.html(children);
        }
      }
    });

    const attributes = this.get("attributes");
    Util.each(attributes, (value, key) => {
      this.emit(`dynamic:${key}`, value);
    });

    this.addClass(this.get("type"));

    this.set("el", el);
    this._render();
  }

  _render() {
    const kit = this;
    const container = kit.get("el");
    if (container) {
      container.on("mouseover", (e) => {
        e.stopPropagation();
        this.addClass("kitx-hovered");
        this.emit("container:mouseover");
      });
      container.on("mouseout", (e) => {
        e.stopPropagation();
        this.removeClass("kitx-hovered");
        this.emit("container:mouseout");
      });
      container.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.emit("container:click");
      });
      if (this.get("draggable")) {
        container.attrs("draggable", "true");
      }
      container.on("dragstart", (e) => {
        e.stopPropagation();
        this.emit("container:dragstart", e);
      });
      container.on("drag", (e) => {
        this.emit("container:drag", e);
      });
      container.on("dragend", (e) => {
        e.stopPropagation();
        this.emit("container:dragend", e);
      });
      container.on("dragover", (e) => {
        // e.stopPropagation();
        e.preventDefault();
        this.emit("container:dragover", e);
      });
      container.on("dragleave", (e) => {
        // e.stopPropagation();
        this.emit("container:dragleave", e);
      });
      container.on("drop", (e) => {
        this.emit("container:drop", e);
      });
    }
  }

  update(cfg) {
    const attributes = this.get("attributes");
    if (cfg.attributes) {
      Util.each(cfg.attributes, (value, key) => {
        attributes[key] = value;
      });
    }
  }

  watchAttributes() {
    const attributes = this.get("attributes");
    const attributesProxy = new Proxy(attributes, {
      get: (target, propKey, receiver) => {
        return Reflect.get(target, propKey, receiver);
      },
      set: (target, propKey, value, receiver) => {
        this.emit(`dynamic:${propKey}`, value);
        return Reflect.set(target, propKey, value, receiver);
      },
    });

    this.set("attributes", attributesProxy);

    const refs = this.get("refs");
    const kitxtree = this.get("kitxtree");
    Util.bfsTreeEach([kitxtree], (node) => {
      const { style, attrs } = node.dynamic || {};
      if (style) {
        Util.each(style, (propValue, propKey) => {
          if (!Util.isString(propValue)) return;
          this.on(`dynamic:${propValue}`, (value) => {
            refs[node.ref].css(transformStyle(propKey), value);
          });
        });
      }

      if (attrs) {
        Util.each(attrs, (propValue, propKey) => {
          if (!Util.isString(propValue)) return;
          this.on(`dynamic:${propValue}`, (value) => {
            refs[node.ref].attrs(propKey, value);
          });
        });
      }

      if ((style || attrs) && !node.ref) {
        node.ref = `kitx-${Util.genUUID()}`;
      }
    });
  }

  getContainer() {
    const refs = this.get("refs");
    const container = refs.container;
    return container;
  }

  getChildren() {
    const children = this.get("children");
    return children;
  }

  getBox() {
    const refs = this.get("refs");
    const container = refs.container;
    if (container) {
      return container.getBoundingClientRect();
    } else {
      return { top: 0, left: 0, width: 0, height: 0 };
    }
  }

  addClass(cls) {
    const attributes = this.get("attributes");
    const cssClass = attributes["css-class"];
    const classArray = cssClass ? cssClass.split(" ") : [];
    if (classArray.includes(cls)) return;
    classArray.push(cls);
    this.update({
      attributes: {
        "css-class": classArray.join(" "),
      },
    });
  }

  removeClass(cls) {
    const attributes = this.get("attributes");
    const cssClass = attributes["css-class"];
    const classArray = cssClass ? cssClass.split(" ") : [];
    const index = classArray.indexOf(cls);
    if (index > -1) {
      classArray.splice(index, 1);
      this.update({
        attributes: {
          "css-class": classArray.join(" "),
        },
      });
    }
  }

  hasClass(cls) {
    const container = this.getContainer();
    return container.hasClass(cls);
  }

  // old
  addChild(child, index) {
    const slots = this.get("slots");
    const children = this.get("children");
    const el = child.get("refs").container;
    this.emit("beforeAddChild", child);
    if (children) {
      if (Util.isNumber(index) && children[index]) {
        el.insertBefore(children[index].get("el"));
        children.splice(index, 0, child);
      } else {
        if (slots.$default) slots.$default.append(el);
        children.push(child);
      }
    } else {
      if (slots.$default) slots.$default.append(el);
      this.set("children", [child]);
    }
    this.emit("afterAddChild", child);
  }

  removeChild(child) {
    const children = this.get("children");
    const index = children.indexOf(child);
    children.splice(index, 1);
    child.get("el").remove();
  }

  toJson() {
    const json = Util.pick(this.cfg, [
      "seqNum",
      "type",
      "children",
      "attributes",
    ]);

    if (json.children) {
      json.children = json.children.map((child) => {
        if (Util.isArray(child)) {
          return child.map((_child) => _child.toJson());
        } else {
          return child.toJson();
        }
      });
    }
    return json;
  }
  // children, kitx
  toAst() {
    // 处理kitxtree！！！！！！！
    const kitxtree = this.get("kitxtree");

    if (kitxtree) {
      // 将内容嵌入插槽
      const cloneXtree = Util.clone(kitxtree);
      const xtree = [cloneXtree];
      while (xtree.length > 0) {
        const item = xtree.splice(0, 1)[0];
        if (item.repeat) {
          item.$index = 0;
          delete item.repeat;
          for (let i = 1; i < item.repeat; i++) {
            xtree.unshift(Util.mix(Util.clone(item), { $index: i }));
          }
        }
        const __children = item.children;
        if (__children) {
          if (Util.isArray(__children)) {
            xtree.unshift(...__children);
          }
        }
      }
      return cloneXtree;
    } else {
      return {};
    }
  }

  processData(data) {
    return Util.deepMix(
      {
        kitxtype: this.get("type"),
      },
      data
    );
  }

  processAttrs(ast) {
    const attrs = Util.clone(ast.attrs || {});
    const type = this.get("type");
    const classList = attrs.class ? attrs.class.split(" ") : [];
    classList.push(type);
    attrs.class = classList.join(" ");
    return attrs;
  }

  processStyle(style) {
    // const style = Util.clone(this.get("style"));
    // return Util.mix({}, _style, style);
    return style;
  }

  processEvents() {
    const editable = this.get("editable");
    const events = this.get("events");
    if (editable) {
      this.set("events", { ...events });
    }
  }

  parent() {
    const pid = this.get("pid");
    const kitx = this.get("kitx");
    const kits = kitx.get("kits");
    return kits[pid];
  }

  prevSibling() {
    const parent = this.parent();
    const siblings = parent.get("children");
    const index = siblings.indexOf(this);
    return siblings[index - 1];
  }

  nextSibling() {
    const parent = this.parent();
    const siblings = parent.get("children");
    const index = siblings.indexOf(this);
    return siblings[index + 1];
  }

  getIndex() {
    const parent = this.parent();
    const siblings = parent.get("children");
    const index = siblings.indexOf(this);
    return index;
  }
}
