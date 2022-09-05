import Util from "@/util";
import Base from "./Base";
export default class extends Base {
  constructor(cfg) {
    super(cfg);
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Section",
        includes: [],
        editable: true,
        draggable: true,
        direction: "row",
      },
      cfg
    );
    _cfg.includes = _cfg.includes.concat(["kitx-column"]);
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
