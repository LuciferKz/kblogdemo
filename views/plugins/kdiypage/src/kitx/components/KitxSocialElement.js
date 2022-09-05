// https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png

import Util from "@/util";
import Base from "./Base";
const SocialElementsIcon = {
  facebook: {
    src: "https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png",
    "background-color": "#3b5998",
  },
  google: {
    src: "https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png",
    "background-color": "#dc4e41",
  },
  twitter: {
    src: "https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png",
    "background-color": "#55acee",
  },
};
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Social Element",
        editable: true,
        draggable: true,
      },
      cfg
    );
    super(_cfg);
    this.init();
  }

  init() {
    const attributes = this.get("attributes");
    const element = SocialElementsIcon[attributes.name];
    if (element) {
      this.update({
        attributes: element,
      });
    }
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
