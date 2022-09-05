import Util from "@/util";
import Base from "./Base";
import { KitxSocialAttributes } from "./attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Social",
        editable: true,
        draggable: true,
        direction: "row",
        includes: [],
      },
      cfg
    );
    _cfg.includes = _cfg.includes.concat(["kitx-social-element"]);
    super(_cfg);
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const refs = this.get("refs");
    const container = refs.container;

    if (container) {
      container.css({
        outline: "1px dashed rgba(170,170,170,0.7)",
        outlineOffset: "-2px",
      });
    }
  }
}
