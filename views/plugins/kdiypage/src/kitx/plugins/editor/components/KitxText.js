import Util from "@/util";
import Base from "./Base";
import { KitxTextAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Text",
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
    const container = refs.container;
    const inner = refs.inner;
    const text = refs.text;

    const attrs = Util.deepMix({}, KitxTextAttributes, kit.get("attributes"));

    if (inner) {
      inner.css({
        ...Util.pick(attrs, [
          "height",
          "padding",
          "padding-bottom",
          "padding-left",
          "padding-right",
          "padding-top",
        ]),
        "background-color": attrs["container-background-color"],
      });

      inner.attrs(Util.pick(attrs, ["align"]));
    }

    if (text) {
      text.css(
        Util.pick(attrs, [
          "color",
          "font-family",
          "font-size",
          "font-style",
          "font-weight",
          "line-height",
          "letter-spacing",
          "text-decoration",
          "text-transform",
          "width",
        ])
      );
    }
  }
}
