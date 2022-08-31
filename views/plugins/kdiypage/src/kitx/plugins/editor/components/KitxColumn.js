import Util from "@/util";
import Base from "./Base";
import { KitxColumnAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Column",
        includes: [
          "kitx-text",
          "kitx-button",
          "kitx-image",
          "kitx-divider",
          "kitx-social",
          "kitx-spacer",
          "kitx-simple-navbar",
          "kitx-navbar",
          "kitx-hero",
          "kitx-raw",
        ],
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
    // super.render();
    const kit = this.get("kit");
    const refs = kit.get("refs");
    const attrs = Util.deepMix({}, KitxColumnAttributes, kit.get("attributes"));

    const container = refs.container;
    const column = refs.column;
    const inner = refs.inner;

    if (container) {
      container.css({
        outline: "1px dashed rgba(170,170,170,0.7)",
        outlineOffset: "-2px",
        width: attrs["width"],
      });
    }

    if (column) {
      column.css(
        Util.pick(attrs, [
          "background-color",
          "border",
          "border-bottom",
          "border-left",
          "border-radius",
          "border-right",
          "border-top",
          "padding",
          "padding-bottom",
          "padding-left",
          "padding-right",
          "padding-top",
        ])
      );
    }

    if (inner) {
      inner.css({
        border: attrs["inner-border"],
        "border-left": attrs["inner-border-left"],
        "border-top": attrs["inner-border-top"],
        "border-right": attrs["inner-border-right"],
        "border-bottom": attrs["inner-border-bottom"],
        "border-radius": attrs["inner-border-radius"],
        "background-color": attrs["inner-background-color"],
      });

      inner.attrs({
        align: attrs["align"],
      });
    }
    // "vertical-align": "middle",

    // "css-class": "n/a",
  }
}
