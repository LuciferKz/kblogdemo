import Util from "../../util/index";
import Base from "./Base";
import KitxBody from "./KitxBody";
import KitxSection from "./KitxSection";
import KitxColumn from "./KitxColumn";
import KitxText from "./KitxText";
import KitxButton from "./KitxButton";
import KitxDivider from "./KitxDivider";
import KitxImage from "./KitxImage";
import KitxSpacer from "./KitxSpacer";
import KitxNavbar from "./KitxNavbar";
import KitxNavbarLink from "./KitxNavbarLink";
import KitxSocial from "./KitxSocial";
import KitxSocialElement from "./KitxSocialElement";

import Components from "./Components";

export const BaseComponents = {
  "kitx-body": KitxBody,
  "kitx-section": KitxSection,
  "kitx-column": KitxColumn,
  "kitx-text": KitxText,
  "kitx-button": KitxButton,
  "kitx-divider": KitxDivider,
  "kitx-image": KitxImage,
  "kitx-spacer": KitxSpacer,
  "kitx-navbar": KitxNavbar,
  "kitx-navbar-link": KitxNavbarLink,
  "kitx-social": KitxSocial,
  "kitx-social-element": KitxSocialElement,
};

const create = function (type, cfg) {
  let _cfg = cfg;
  if (Components[type]) {
    _cfg = Util.deepMix({}, Components[type], cfg);
  }
  const component = BaseComponents[type];
  if (!component) throw new Error(`不存在组件: ${type}`);
  if (component) {
    return new component(_cfg);
  } else {
    return new Base(_cfg);
  }
};

export default create;
