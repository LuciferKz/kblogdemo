import Util from "@/util";
import parse from "./parser";
import { KitEditor } from "./editor";

function dfsPostTreeEach(tree, func) {
  let node,
    nodes = tree.slice();
  let temp = new Map();
  while ((node = nodes[0])) {
    let childLength = node.children ? node.children.length : 0;
    if (childLength && !temp.has(node.id)) {
      nodes.unshift(...node.children);
    }
    if (!childLength || temp.has(node.id)) {
      func(node);
      nodes.shift();
      temp.delete(node.id);
    }
    temp.set(node.id);
  }
}

class KitxMjml {
  constructor(cfg) {
    const _cfg = Util.mix({}, cfg);

    // _cfg.container = $k(cfg.container);

    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };

    this.init();
  }

  init() {
    const kitx = this.get("kitx");
    this.$editor = new KitEditor({ kitx });
    this.onHooks();
  }
  onHooks() {
    const kitx = this.get("kitx");
    const kits = kitx.get("kitx");
    const kitstree = kitx.get("kitstree");

    kitx.on("load", () => {
      console.log(kitstree);
      this.render();
    });
  }
  toMjml() {}
  toHtml(kit) {
    return parse(kit, {
      editing: true,
    });
  }
  render() {
    const kitx = this.get("kitx");
    const container = kitx.get("container");
    const kitstree = kitx.getData();

    dfsPostTreeEach(kitstree, (node) => {
      node.html = this.toHtml(node);
      node.editing = true;
    });

    container.html(kitstree[0].html);
  }
}

export default {
  install(cfg) {
    const _kitxMjml = new KitxMjml(cfg);

    // kitx.on("afterAddItem", () => {
    //   _kitxMjml.toHtml(kitstree);
    // });

    return _kitxMjml;
  },
};
