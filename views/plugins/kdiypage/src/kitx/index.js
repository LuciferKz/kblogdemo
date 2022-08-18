import Util from "@/util";
import Kit from "./kit";
import { EventEmitter, KitRenderer } from "./plugins";
import $k from "@/util/dom";

class KitxDiy extends EventEmitter {
  constructor(cfg) {
    super();
    const _cfg = Util.mix(
      {
        data: [],
        kits: {},
        kitstree: [],
        components: {},
        container: document.body,
        status: "editing",
      },
      cfg
    );

    _cfg.container = cfg.container;

    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };

    this.init();
  }

  init() {
    this.$renderer = new KitRenderer();
    // this.$editor = new KitEditor({ kitx: this });

    this.on("afterAddItem", (kit) => {
      // if (d.parent) {
      //   const parent = kits[d.parent];
      //   // parent
      //   //   .get("el")
      //   //   .dom.insertAdjacentHTML(
      //   //     "beforeEnd",
      //   //     this.toHtml([kit.toAst(null, this)])
      //   //   );
      //   console.log(kits, d.parent, "addChild");
      //   parent.addChild(kit);
      //   console.log(this.toHtml([kit.toAst(null, this)]));
      //   parent
      //     .get("el")
      //     .dom.insertAdjacentHTML(
      //       "beforeEnd",
      //       this.toHtml([kit.toAst(null, this)])
      //     );
      // } else {
      //   const kitstree = this.get("kitstree");
      //   kitstree.push(kit);
      //   // this.get("container").insertAdjacentHTML(
      //   //   "beforeEnd",
      //   //   this.toHtml([kit.toAst(null, this)])
      //   // );
      //   console.log("kitstree", kitstree);
      // }
      this.bind(kit);
    });
  }

  load(data) {
    if (!Util.isArray(data)) throw Error("data required array");
    this.render(data);
  }

  toJson(kits) {
    if (!kits) throw new Error("kit list is required");
    if (!Util.isArray(kits)) throw new Error("kit list must be array");
    return kits.map((kit) => {
      if (Util.isArray(kit)) {
        return this.toJson(kit);
      } else {
        return kit.toJson();
      }
    });
  }

  toAst(kits) {
    return kits.map((kit) => {
      let ast = "";
      // 多个子节点，处理数组
      if (Util.isArray(kit)) {
        return this.toAst(kit);
      }
      // 单个子节点，处理对象
      const children = kit.get("children");
      if (children) {
        ast = kit.toAst(this.toAst(children), this);
      } else {
        ast = kit.toAst(null, this);
      }
      return ast;
    });
  }

  toKits(data, parent) {
    return data.map((d) => {
      // 多个子节点，处理数组
      if (Util.isArray(d)) {
        return this.toKits(d, parent);
      }
      // 单个子节点，处理对象
      d = this.mergeDefaultCfg(d);
      if (parent) d.parent = parent;
      const _kit = this.addItem(d);
      if (d.children) {
        _kit.set("children", this.toKits(d.children, _kit.get("seqNum")));
      }
      return _kit;
    });
  }

  toHtml(ast) {
    return this.$renderer.toHtml(ast);
  }

  mergeDefaultCfg(cfg) {
    const components = this.get("components");
    const defaultCfg = components[cfg.type];
    return Util.mix({}, defaultCfg, cfg);
  }

  addItem(d) {
    // const components = this.get("components");
    const kits = this.get("kits");
    if (!d.type) throw Error("type is requried");
    // const component = components[d.type];
    // if (!component)
    //   throw Error(`${d.type} is not exsit, please check your components`);
    const cfg = this.mergeDefaultCfg(d);
    if (cfg.data) {
      const parent = this.get("kits")[d.parent];
      const kitstree = this.toKits(cfg.data, d.parent);
      parent.set("children", kitstree);

      const ast = this.toAst(kitstree);
      const html = this.toHtml(ast);
      console.log(html);
      parent.get("el").dom.insertAdjacentHTML("beforeEnd", html);
      // parent.get("el").html(html);
    } else {
      const kit = new Kit(cfg);
      kits[kit.get("seqNum")] = kit;

      this.emit("afterAddItem", kit);
      return kit;
    }
  }

  switchStatus() {
    const status = this.get("status");
    const kits = this.get("kits");
    Util.each(kits, (kit) => {
      const editable = kit.get("editable");
      if (status === "editing" && editable) {
        this.$editor.addItem(kit);
      } else {
        this.$editor.removeItem(kit);
      }
    });
  }

  // 安装组件库
  installComponents(customComponents) {
    const components = this.get("components");
    Util.each(customComponents, (component) => {
      components[component.type] = component;
    });
  }

  installPlugin(name, Plugin, cfg) {
    const _plugin = new Plugin(
      Util.mix(
        {
          kitx: this,
        },
        cfg
      )
    );
    this[`$${name}`] = _plugin;
    return _plugin;
  }

  hasComponent(name) {
    const components = this.get("components");
    return !!components[name];
  }

  render(data) {
    this.emit("beforeRender", this);
    const kitstree = this.toKits(data);
    this.set("kitstree", kitstree);
    const ast = this.toAst(kitstree);
    const html = this.toHtml(ast);
    const container = this.get("container");
    container.innerHTML = html;
    this.emit("afterRender", kitstree);
  }

  getData() {
    const kitstree = this.get("kitstree");
    return this.toJson(kitstree);
  }

  bind(kit) {
    setTimeout(() => {
      const events = kit.get("events");
      if (!kit.get("el")) {
        const id = kit.get("id") || kit.get("seqNum");
        const el = $k(`#${id}`);
        kit.set("el", el);
      }
      kit.emit("load");
      Util.each(events, (fn, evt) => {
        kit.addEvent(evt, fn);
      });
    }, 0);
  }

  findKit(seqNum) {
    const kits = this.get("kits");
    return kits[seqNum];
  }
}

export default KitxDiy;
