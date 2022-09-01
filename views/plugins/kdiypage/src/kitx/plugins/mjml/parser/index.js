import KitxBody from "./KitxBody";
import KitxSection from "./KitxSection";
import KitxColumn from "./KitxColumn";
// import KitxText from "./KitxText";
// import KitxButton from "./KitxButton";
// import KitxDivider from "./KitxDivider";
// import KitxImage from "./KitxImage";
// import KitxSpacer from "./KitxSpacer";
// import KitxNavbar from "./KitxNavbar";
// import KitxNavbarLink from "./KitxNavbarLink";
// import KitxSocial from "./KitxSocial";
// import KitxSocialElement from "./KitxSocialElement";

const renderers = {
  "kitx-body": KitxBody,
  "kitx-section": KitxSection,
  "kitx-column": KitxColumn,
  // "kitx-text": KitxText,
  // "kitx-button": KitxButton,
  // "kitx-divider": KitxDivider,
  // "kitx-image": KitxImage,
  // "kitx-spacer": KitxSpacer,
  // "kitx-navbar": KitxNavbar,
  // "kitx-navbar-link": KitxNavbarLink,
  // "kitx-social": KitxSocial,
  // "kitx-social-element": KitxSocialElement,
};

export default function (kit, options) {
  const type = kit.type;
  const render = renderers[type];
  return render(kit, options);
}
