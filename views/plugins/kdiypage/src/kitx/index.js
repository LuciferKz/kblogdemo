import Util from "@/util";
import Kit from "./kit";
import { EventEmitter, KitRenderer } from "./plugins";
import $k from "@/util/dom";
import newElement from "../util/dom/new-element";

class KitxDiy extends EventEmitter {
  constructor(cfg) {
    super();
    const _cfg = Util.mix(
      {
        data: [],
        kits: {},
        kitstree: [],
        components: {},
        container: $k(document.body),
        status: "editing",
      },
      cfg
    );

    _cfg.container = $k(cfg.container);

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

    const kits = this.get("kits");
    this.on("afterAddItem", (kit) => {
      console.log("afterAddItem", kit.get("type"));
      const pid = kit.get("parent");
      console.log("parent", parent);
      if (pid) {
        const kitparent = kits[pid];
        kitparent.addChild(kit);
        // kitparent
        //   .get("el")
        //   .dom.insertAdjacentHTML(
        //     "beforeEnd",
        //     this.toHtml([kit.toAst(null, this)])
        //   );
        kitparent.get("el").append(kit.toAst);
        console.log("kitparent", kitparent);
      } else {
        const kitstree = this.get("kitstree");
        kitstree.push(kit);
        this.get("container").dom.insertAdjacentHTML(
          "beforeEnd",
          this.toHtml([kit.toAst(null, this)])
        );
        console.log("kitstree", kitstree);
      }

      if (kit) this.bind(kit);

      kit.on("load", () => {
        const events = kit.get("events");
        if (!events) return;
        Util.each(events, (fn, evt) => {
          kit.addEvent(evt, fn);
        });
      });
    });

    this.on("afterAddKitstree", (kitstree, pid) => {
      console.log("afterAddKitstree", kitstree);
      const parent = this.get("kits")[pid];
      const ast = this.toAst(kitstree);
      // const html = this.toHtml(ast);

      // console.log(html, parent.get("el"));
      // parent.get("el").dom.insertAdjacentHTML("beforeEnd", html);
      // console.log(ast);

      const kitEl = newElement(ast[0]);
      console.log("newElement", kitEl);
      parent.get("el").append(kitEl);
      parent.addChild(kitstree[0]);

      const tree = [...kitstree];
      while (tree.length > 0) {
        const kit = tree.splice(0, 1)[0];
        console.log(kit);
        // this.addItem(kit);
        this.bind(kit);
        const children = kit.get("children");
        if (children) {
          tree.unshift(...children);
        }
      }
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
      this.set("status", "rendering");
      const kitstree = this.toKits(cfg.data, d.parent);
      this.emit("afterAddKitstree", kitstree, d.parent);
      return kitstree[0];
    } else {
      // const parent = kits[parent];
      const kit = new Kit(cfg);
      kits[kit.get("seqNum")] = kit;
      // parent.addChild(kit);
      if (this.get("status") !== "rendering") this.emit("afterAddItem", kit);
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
    this.set("status", "rendering");
    const kitstree = this.toKits(data);
    this.set("kitstree", kitstree);
    const ast = this.toAst(kitstree);
    const html = this.toHtml(ast);
    const container = this.get("container");
    container.html(html);
    this.set("status", "editing");
    this.emit("afterRender", kitstree);
  }

  getData() {
    const kitstree = this.get("kitstree");
    return this.toJson(kitstree);
  }

  bind(kit) {
    setTimeout(() => {
      const id = kit.get("id") || kit.get("seqNum");
      const el = kit.get("el") ? kit.get("el") : $k(`#${id}`);
      kit.set("el", el);
      if (el.dom) kit.emit("load");
    }, 0);
  }

  findKit(seqNum) {
    const kits = this.get("kits");
    return kits[seqNum];
  }
}

export default KitxDiy;
