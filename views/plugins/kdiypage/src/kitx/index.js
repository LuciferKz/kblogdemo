import Util from "@/util";
import Kit from "./kit";
import { EventEmitter, KitRenderer } from "./plugins";
import { EmailComponents } from "./plugins/mjml/components.js";
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
        container: $k(document.body),
        status: "editing",
      },
      cfg
    );

    _cfg.container = $k(cfg.container);
    this._cfg = _cfg;
    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };

    this.init();
  }

  init() {
    // this.$renderer = new KitRenderer();
    this.installComponents(EmailComponents);
    // this.$editor = new KitEditor({ kitx: this });
  }

  load(data) {
    if (!Util.isObject(data)) throw Error("data required object");
    const status = this.get("status");
    this.set("status", "bulkAdd");
    const kitstree = this.toKits([data]);
    this.set("kitstree", kitstree);
    // this.render(kitstree);
    this.emit("load");
    this.set("status", status);
  }

  toMJML() {}

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

      // 由子到父生成ast树
      if (children && Util.isArray(children)) {
        ast = kit.toAst(this.toAst(children), this);
      } else {
        ast = kit.toAst(null, this);
      }
      return ast;
    });
  }

  toKits(data, pid) {
    return data.map((d) => {
      // 多个子节点，处理数组
      if (Util.isArray(d)) {
        return this.toKits(d, pid);
      }
      // 单个子节点，处理对象
      d = this.mergeDefaultCfg(d);
      if (pid) d.pid = pid;

      const children = d.children;
      if (Util.isArray(children)) {
        delete d.children;
      }
      const _kit =
        this.get("status") === "bulkAdd" ? this.addItem(d) : this.add(d);
      if (Util.isArray(children)) {
        _kit.set("children", this.toKits(children, _kit.get("seqNum")));
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

  add(d, index) {
    return this.addItem(d, index);
  }

  addItem(d, index) {
    if (!d.type) throw Error("type is requried");
    if (!this.hasComponent(d.type))
      throw Error(`${d.type} is not exsit, please check your components`);
    const cfg = this.mergeDefaultCfg(d);
    if (cfg.kitstree) {
      const data = Util.mix({}, d, cfg.kitstree);
      const kitstree = this.toKits([data], cfg.pid);
      return kitstree[0];
    } else {
      this.emit("beforeAddItem", d);
      const kits = this.get("kits");
      const kitstree = this.get("kitstree");
      cfg.kitx = this;
      const kit = new Kit(cfg);
      kits[kit.get("seqNum")] = kit;
      if (!d.pid) {
        kitstree.push(kit);
      } else {
        const parent = kits[d.pid];
        parent.addChild(kit, index);
      }
      if (Util.isArray(cfg.children)) {
        kit.set("children", this.toKits(cfg.children, kit.get("seqNum")));
      }
      this.emit("afterAddItem", kit);
      return kit;
    }
  }

  moveItemTo(kit, pid, index) {
    // 原父级下删除
    const oriPid = kit.get("pid");
    const oriParent = this.findById(oriPid);
    oriParent.removeChild(kit);

    // 添加到父级下
    const parent = this.findById(pid);
    parent.addChild(kit, index);
    kit.set("pid", pid);
  }

  update(id, cfg) {
    const kits = this.get("kits");
    const kit = kits[id];
    this.emit("beforeUpdateItem", kit, cfg);
    kit.update(cfg);
    this.emit("afterUpdateItem", kit);
    return kit;
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
    const _plugin = Plugin.install(
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

  clear() {
    const container = this.get("container");
    container.html("");
  }

  // render(kitstree) {
  //   this.emit("beforeRender", this);
  //   this.clear();
  //   const container = this.get("container");
  //   // const els = kitstree[0].get("el");
  //   // container.append(els);
  //   this.emit("afterRender", kitstree);
  // }

  getData() {
    const kitstree = this.get("kitstree");
    return this.toJson(kitstree);
  }

  findById(id) {
    const kits = this.get("kits");
    return kits[id];
  }
}

export default KitxDiy;
