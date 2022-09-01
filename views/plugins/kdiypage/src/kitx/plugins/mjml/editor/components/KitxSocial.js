import Util from "@/util";
import Base from "./Base";
// import { KitxSocialAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Social",
        editable: true,
        draggable: true,
        direction: "row",
        includes: ["kitx-social-element"],
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
  //   const container = refs.container;
  //   const inner = refs.inner;

  //   const attrs = Util.deepMix({}, KitxSocialAttributes, kit.get("attributes"));

  //   if (container) {
  //     container.css({
  //       outline: "1px dashed rgba(170,170,170,0.7)",
  //       outlineOffset: "-2px",
  //     });
  //   }

  //   if (inner) {
  //     inner.css({
  //       ...Util.pick(attrs, [
  //         "padding",
  //         "padding-bottom",
  //         "padding-left",
  //         "padding-right",
  //         "padding-top",
  //       ]),
  //       "background-color": attrs["container-background-color"],
  //     });

  //     inner.attrs(Util.pick(attrs, ["align"]));
  //   }
  // }
}
