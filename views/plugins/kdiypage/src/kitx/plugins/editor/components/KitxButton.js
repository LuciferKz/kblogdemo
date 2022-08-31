import Util from "@/util";
import Base from "./Base";
import { KitxButtonAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Button",
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
    const attrs = Util.deepMix({}, KitxButtonAttributes, kit.get("attributes"));
    const buttonCss = Util.pick(attrs, [
      "background-color",
      "border",
      "border-bottom",
      "border-left",
      "border-radius",
      "border-right",
      "border-top",
      "color",
      "font-family",
      "font-size",
      "font-style",
      "font-weight",
      "height",
      "letter-spacing",
      "line-height",
      "padding",
      "text-align",
      "text-decoration",
      "text-transform",
      "vertical-align",
      "width",
    ]);

    buttonCss.padding = attrs["inner-padding"];

    const buttonAttr = Util.pick(attrs, ["href"]);

    const tdCss = Util.pick(attrs, [
      "padding-bottom",
      "padding-left",
      "padding-right",
      "padding-top",
    ]);

    const containerCss = {
      "background-color": attrs["container-background-color"],
    };

    const tdAttrs = Util.pick(attrs, ["align"]);

    refs.container.css(containerCss);
    refs.button.css(buttonCss);
    refs.button.attrs(buttonAttr);
    refs.td.css(tdCss);
    refs.td.attrs(tdAttrs);
  }
}
