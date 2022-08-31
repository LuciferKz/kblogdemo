import Util from "@/util";
import Base from "./Base";
import { KitxNavbarLinkAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Navbar Link",
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

    const attrs = Util.deepMix(
      {},
      KitxNavbarLinkAttributes,
      kit.get("attributes")
    );

    console.log(container);

    if (container) {
      container.css({
        ...Util.pick(attrs, [
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
          "padding",
          "padding-bottom",
          "padding-left",
          "padding-right",
          "padding-top",
        ]),
      });

      container.attrs({
        ...Util.pick(attrs, ["target", "rel", "href"]),
      });
    }
  }
}
