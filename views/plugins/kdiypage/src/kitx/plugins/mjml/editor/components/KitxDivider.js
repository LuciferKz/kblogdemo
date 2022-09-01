import Util from "@/util";
import Base from "./Base";
// import { KitxDividerAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Divider",
        editable: true,
        draggable: true,
      },
      cfg
    );
    super(_cfg);
    // this.init();
  }

  // init() {
  //   this.render();
  // }

  // render() {
  //   const kit = this.get("kit");
  //   const refs = kit.get("refs");
  //   const attrs = Util.deepMix(
  //     {},
  //     KitxDividerAttributes,
  //     kit.get("attributes")
  //   );

  //   const container = refs.container;
  //   if (container) {
  //     container.css({
  //       outline: "1px dashed rgba(170,170,170,0.7)",
  //       outlineOffset: "-2px",
  //     });
  //   }

  //   const containerCss = {
  //     "background-color": attrs["container-background-color"],
  //   };

  //   const tdCss = Util.pick(attrs, [
  //     "padding-bottom",
  //     "padding-left",
  //     "padding-right",
  //     "padding-top",
  //     "padding",
  //   ]);

  //   const tdAttr = Util.pick(attrs, ["align"]);

  //   const dividerCss = Util.pick(attrs, [
  //     "border-color",
  //     "border-width",
  //     "width",
  //   ]);

  //   dividerCss["border-top-style"] = attrs["border-style"];

  //   container.css(containerCss);
  //   refs.divider.css(dividerCss);
  //   refs.td.css(tdCss);
  //   refs.td.attrs(tdAttr);
  // }
}
