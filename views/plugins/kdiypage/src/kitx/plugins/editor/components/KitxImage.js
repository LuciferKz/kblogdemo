import Util from "@/util";
import Base from "./Base";
import { KitxImageAttributes } from "../attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Image",
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
    const link = refs.link;
    const image = refs.image;

    const attrs = Util.deepMix({}, KitxImageAttributes, kit.get("attributes"));

    if (inner) {
      inner.css({
        ...Util.pick(attrs, [
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

    if (link) {
      link.css(Util.pick(attrs, ["href", "name", "title"]));
    }

    if (image) {
      image.css(
        Util.pick(attrs, [
          "border",
          "border-left",
          "border-top",
          "border-right",
          "border-bottom",
        ])
      );
      image.attrs(Util.pick(attrs, ["width", "height", "src", "alt"]));
      if (attrs["srcset"] !== "n/a") {
        image.attrs("srcset", attrs["srcset"]);
      }
    }
  }
}
