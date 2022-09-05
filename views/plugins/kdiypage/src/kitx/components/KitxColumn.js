import Util from "@/util";
import Base from "./Base";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Column",
        includes: "*",
        excludes: [],
        draggable: true,
        editable: true,
      },
      cfg
    );

    _cfg.excludes = _cfg.excludes.concat(["kitx-column", "kitx-section"]);
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
