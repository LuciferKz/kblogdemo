import Util from "@/util";
import { newElement } from "../util/dom";

import { EventEmitter } from "./plugins";
class Kit extends EventEmitter {
  constructor(cfg) {
    super();
    const _cfg = Util.deepMix(
      {
        kitx: null,
        seqNum: `kitx-${Util.genUUID()}`, // 唯一标识
        id: null, // ID
        name: null, // Kit Name
        type: "", // 类型
        attributes: {},
        // children: null, // 子Kit
        // includes: [], // 可包含的kit类型
        // excludes: [], // 不可包含的kit类型
        // kitxtree: null, // 初始化Dom结构
        // attrs: {
        //   class: "",
        // },
        // refs: {},
        // // children: [],
        // slots: {},
        // data: {},
        // style: {
        //   "pointer-events": "none",
        // },
      },
      cfg
    );
    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };
    this.cfg = _cfg;
    this.init();
  }

  init() {
    // this.processEvents();
    // const ast = this.toAst();
    // const slots = this.get("slots");
    // const refs = this.get("refs");
    // const children = this.get("children");
    // ast.attrs = this.processAttrs(ast);
    // console.log(ast);
    // const el = newElement(ast, refs, (node, k) => {
    //   if (node.slot === "default") {
    //     slots["$default"] = k;
    //     if (children && Util.isString(children)) {
    //       k.html(children);
    //     }
    //   }
    // });
    // this.set("el", el);
  }

  addChild(child, index) {
    const slots = this.get("slots");
    const children = this.get("children");
    // const el = child.get("el");
    this.emit("beforeAddChild", child);
    if (children) {
      if (Util.isNumber(index) && children[index]) {
        // el.insertBefore(children[index].get("el"));
        children.splice(index, 0, child);
      } else {
        // if (slots.$default) slots.$default.append(el);
        children.push(child);
      }
    } else {
      // if (slots.$default) slots.$default.append(el);
      this.set("children", [child]);
    }
    this.emit("afterAddChild", child);
  }

  removeChild(child) {
    const children = this.get("children");
    const index = children.indexOf(child);
    children.splice(index, 1);
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

  update(cfg) {
    if (cfg.style) {
      const style = this.get("style") || {};
      Util.each(cfg.style, (value, key) => {
        style[key] = value;
      });
      this.set("style", style);
    }

    if (cfg.attrs) {
      const attrs = this.get("attrs") || {};
      Util.each(cfg.attrs, (value, key) => {
        attrs[key] = value;
      });
      this.set("attrs", attrs);
    }

    this.emit("onKitUpdate", cfg);
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

  getBox() {
    const el = this.get("el");
    return el.getBoundingClientRect();
  }
}

export default Kit;
