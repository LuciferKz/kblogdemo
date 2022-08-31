import Util from "@/util";
import Base from "./Base";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Navbar",
        editable: true,
        draggable: true,
        direction: "row",
        includes: ["kitx-navbar-link"],
      },
      cfg
    );
    super(_cfg);
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    // super.render();
    const kit = this.get("kit");
    const refs = kit.get("refs");
    const container = refs.container;
    if (container) {
      container.css({
        outline: "1px dashed rgba(170,170,170,0.7)",
        outlineOffset: "-2px",
      });
    }
  }
}
