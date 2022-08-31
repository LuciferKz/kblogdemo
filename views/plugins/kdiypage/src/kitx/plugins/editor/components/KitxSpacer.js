import Util from "@/util";
import Base from "./Base";
import { KitxSpacerAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Spacer",
        editable: true,
        draggable: true,
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
    const kit = this.get("kit");
    const refs = kit.get("refs");
    const inner = refs.inner;
    const spacer = refs.spacer;

    const attrs = Util.deepMix({}, KitxSpacerAttributes, kit.get("attributes"));

    if (inner) {
      inner.css({
        "background-color": attrs["container-background-color"],
      });

      inner.attrs(Util.pick(attrs, ["align"]));
    }

    if (spacer) {
      spacer.css(
        Util.pick(attrs, [
          "height",
          "padding",
          "padding-bottom",
          "padding-left",
          "padding-right",
          "padding-top",
        ])
      );
    }
  }
}
