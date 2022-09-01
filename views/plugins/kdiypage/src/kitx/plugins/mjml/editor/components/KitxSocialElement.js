// https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png

import Util from "@/util";
import Base from "./Base";
// import { KitxSocialElementAttributes } from "../attributes";
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
  //   const icon = refs.icon;
  //   const innerIcon = refs.icon;
  //   const link = refs.link;
  //   const innerLink = refs.innerLink;

  //   const attributes = kit.get("attributes");
  //   const attrs = Util.deepMix(
  //     {},
  //     KitxSocialElementAttributes,
  //     SocialElementsIcon[attributes.name],
  //     attributes
  //   );

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
  //       // "background-color": attrs["container-background-color"],
  //     });
  //     // inner.attrs(Util.pick(attrs, ["align"]));
  //   }

  //   if (icon) {
  //     icon.css({
  //       ...Util.pick(attrs, ["border-radius"]),
  //     });
  //     icon.attrs({
  //       width: attrs["icon-size"],
  //       src: attrs.src,
  //     });
  //   }

  //   if (innerIcon) {
  //     innerIcon.css({
  //       ...Util.pick(attrs, ["border-radius", "background-color"]),
  //       width: attrs["icon-size"],
  //     });
  //   }

  //   if (link) {
  //     link.css({
  //       ...Util.pick(attrs, [
  //         "color",
  //         "font-family",
  //         "font-size",
  //         "font-style",
  //         "font-weight",
  //         "line-height",
  //         "letter-spacing",
  //         "text-decoration",
  //         "text-transform",
  //         "width",
  //       ]),
  //     });
  //   }

  //   console.log(this.renderHtml(attrs));
  // }

  renderHtml(attributes) {
    const children = this.get("children");

    const {
      align,
      alt,
      "background-color": backgroundColor,
      "border-radius": borderRadius,
      color,
      "css-class": cssClass,
      href,
      "icon-height": iconHeight,
      "icon-size": iconSize,
      "line-height": lineHeight,
      name,
      padding,
      "padding-bottom": paddingBottom,
      "padding-left": paddingLeft,
      "padding-right": paddingRight,
      "padding-top": paddingTop,
      "icon-padding": iconPadding,
      "text-padding": textPadding,
      sizes,
      src,
      srcset,
      rel,
      target,
      title,
      "text-decoration": textDecoration,
      "vertical-align": verticalAlign,
      "font-family": fontFamily,
      "font-size": fontSize,
      "font-style": fontStyle,
      "font-weight": fontWeight,
    } = attributes;

    return `
      <div class="${cssClass}">
        <a style="width: ${iconSize};" href="${href}">
          <img src="${src} />
        </a>
        <a href="${href}">${children ? children : ""}</a>
      </div>
    `;
  }
}
