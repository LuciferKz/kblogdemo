import Util from "@/util";

import { EventEmitter, KitRenderer } from "./plugins";
class Kit extends EventEmitter {
  constructor(cfg) {
    super();
    const _cfg = Util.deepMix(
      {
        seqNum: `kitx-${Util.genUUID()}`, // 唯一标识
        id: null, // ID
        name: null, // Kit Name
        type: "", // 类型
        // children: null, // 子Kit
        includes: [], // 可包含的kit类型
        excludes: [], // 不可包含的kit类型
        kitxtree: null, // 初始化Dom结构
        attrs: {
          class: "",
        },
        children: [],
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
    this.processEvents();
  }

  addChild(child, index) {
    const children = this.get("children");
    if (index) {
      children.splice(index, 0, child);
    } else {
      children.push(child);
    }
  }

  toJson() {
    const cfg = this.cfg;
    if (cfg.children) {
      cfg.children = cfg.children.map((child) => {
        if (Util.isArray(child)) {
          console.log(child);
          return child.map((_child) => _child.toJson());
        } else {
          return child.toJson();
        }
      });
    }
    return Util.pick(this.cfg, ["type", "children", "content"]);
  }

  toAst(children, kitx) {
    /**
     * 结合
     * kitstree，整体页面组件结构
     * eq. <single-column>{{ children }}</single-column>
     *
     * 以及
     * kitxtree，每个组件固定结构
     * eq.single-column固定结构
     * <div type="single-column">
     *   <table>
     *     <tr>
     *       <td>
     *        <kit-column>{{ children }}</kit-column>
     *       </td>
     *     </tr>
     *   </table>
     * </div>
     *
     * eq.kit-column固定结构
     * <div class="kit-column">
     *   <table>
     *     <tr>
     *       <td>{{ children }}</td>
     *     </tr>
     *   </table>
     * </div>
     *
     *
     * 生成完整的ast树
     * 并通过渲染插件生成html
     * <div type="single-column">
     *   <table>
     *     <tr>
     *       <td>
     *         <div class="kit-column">
     *           <table>
     *             <tr>
     *               <td>{{ children }}</td>
     *             </tr>
     *           </table>
     *         </div>
     *       </td>
     *     </tr>
     *   </table>
     * </div>
     *  */
    // const children = children;
    const seqNum = this.get("seqNum");
    const id = this.get("id");
    const tag = this.get("tag");
    const parent = this.get("parent");
    // const type = this.get("type");
    const attrs = this.processAttrs(this.get("attrs"));
    const data = this.get("data");
    const style = this.processStyle(this.get("style"));
    const content = this.get("content");
    const kitxtree = this.get("kitxtree");
    children = children || this.get("children");

    const ast = {
      seqNum,
      id,
      parent,
      tag,
      data,
      attrs,
      style,
      children,
      content,
    };
    if (kitxtree) {
      // 将内容嵌入插槽
      const _kitxtree = Util.clone(kitxtree);
      const _xtree = [..._kitxtree];

      while (_xtree.length > 0) {
        const item = _xtree.splice(0, 1)[0];
        const _children = item.children;
        if (_children) {
          if (Util.isString(_children)) {
            // 替换到默认嵌入位
            if (_children === "$default") {
              if (item.$index) {
                item.children = children[item.index];
              } else {
                item.children = children;
              }
            }
          } else if (Util.isArray(_children)) {
            // 循环遍历节点
            _children.forEach((child, idx) => {
              if (child.repeat) {
                const repeat = child.repeat;
                delete child.repeat;
                for (let i = 0; i < repeat; i++) {
                  const newItem = Util.clone(child);
                  newItem.key = `${seqNum}-${i + 1}`;
                  newItem.$index = i;
                  _children.splice(idx + i + 1, 0, newItem);
                }
                _children.splice(idx, 1);
              }
            });

            // 将结构内的kit类型替换上kitxtree结构
            item.children = _children.map((child) => {
              if (kitx.hasComponent(child.type)) {
                child.parent = item.seqNum;
                const _kit = kitx.addItem(child);
                const $index = child.$index;

                // 子节点内容
                let __children = children;
                if ($index || $index === 0) {
                  __children = children[$index] || {};

                  if (!Util.isArray(__children)) {
                    __children = [__children];
                  }
                }

                return _kit.toAst(__children, kitx);
              } else {
                return child;
              }
            });
            _xtree.unshift(...item.children);
          }
        }
      }

      ast.children = _kitxtree;
    }

    return ast;
  }

  processAttrs() {
    const attrs = Util.clone(this.get("attrs"));
    // 添加class
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
    const el = this.get("el");
    if (cfg.style) {
      const style = this.get("style") || {};
      Util.each(cfg.style, (value, key) => {
        // el.css(key, value);
        style[key] = value;
      });
      el.css(cfg.style);
      this.set("style", style);
    }

    if (cfg.attrs) {
      const attrs = this.get("attrs") || {};
      Util.each(cfg.attrs, (value, key) => {
        el.attrs({ key: value });
        attrs[key] = value;
      });
      this.set("attrs", attrs);
    }
  }

  addClass(cls) {
    const el = this.get("el");
    el.addClass(cls);
  }

  removeClass(cls) {
    const el = this.get("el");
    el.removeClass(cls);
  }

  addEvent(evt, fn) {
    const el = this.get("el");
    const listener = (e) => {
      fn.call(this, e);
    };
    el.addEventListener(evt, listener);
  }

  removeEvent(evt, fn) {
    const el = this.get("el");
    el.removeEventListener(evt, fn);
  }
}

export default Kit;
