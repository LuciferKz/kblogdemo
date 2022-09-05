import Util from "@/util";
import { newElement } from "../../../util/dom";
import parse from "./parser";
// import { KitEditor } from "./editor";

export class KitxMjml {
  constructor(cfg) {
    const _cfg = Util.mix({}, cfg);

    // _cfg.container = $k(cfg.container);

    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };
  }

  toMjml() {}

  toHtml(kit) {
    return parse(kit, {
      editing: true,
    });
  }

  toDom(ast) {}

  render(container, tree) {
    Util.dfsPostTreeEach(tree, (node) => {
      node.html = this.toHtml(node);
      node.editing = true;
    });
    container.html(tree[0].html);
  }
}

export default {
  install(kitx, cfg) {
    const mjml = new KitxMjml(cfg);
    const container = kitx.get("container");
    kitx.on("render", (kitstree) => {
      const els = kitstree[0].get("el");
      console.log(els);
      container.append(els);
    });
    return mjml;
  },
};
