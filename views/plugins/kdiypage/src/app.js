import KitxDiy from "./kitx";
import KitxMjml from "./kitx/plugins/mjml/index";
// import { EmailComponents } from "./kitx/components";
import "./style/index.css";

{
  /* <div class="diy-emulator diy-email"></div> */
}

const kitxz = new KitxDiy({
  container: document.querySelector(".diy-emulator-container"),
});
// kitxz.installComponents(EmailComponents);
const mjml = kitxz.installPlugin("mjml", KitxMjml);

// editor.addEvents("kitx-text", {
//   dblclick() {
//     const el = this.get("el");
//     el.attrs("contenteditable", "true");
//     el.focus();
//   },
//   blur() {
//     const el = this.get("el");
//     el.attrs("contenteditable", "false");
//   },
// });

document.querySelectorAll(".diy-blocks-item").forEach((item) => {
  mjml.$editor.initDragItem(item);
});

kitxz.load({
  type: "kitx-body",
  children: [
    {
      type: "kitx-section",
    },
  ],
});

// kitxz.load({
//   type: "kitx-body",
//   children: [
//     {
//       type: "kitx-section",
//       children: [
//         {
//           type: "kitx-column",
//           children: [
//             {
//               type: "kitx-text",
//               children: "Kitx编辑器: Email组件套装",
//             },
//           ],
//         },
//         {
//           type: "kitx-column",
//           children: [
//             {
//               type: "kitx-text",
//               children: "如何使用Kitx编辑支持Email的Html界面",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "kitx-section",
//       children: [
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-12",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children:
//                 "Kitx邮件组件列表，从右侧拖拽组件。<br />绿色指示线标识即将插入的位置。<br /> 黄色边框线指示当前组件所在容器。",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "kitx-section",
//       children: [
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-12",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children: "文字组件: kitx-text",
//             },
//             {
//               type: "kitx-text",
//               children: "双击编辑文字...",
//             },
//           ],
//         },
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-12",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children: "图片组件: kitx-image",
//             },
//             {
//               type: "kitx-image",
//               attributes: {
//                 src: "https://via.placeholder.com/350x250/78c5d6/fff",
//               },
//             },
//           ],
//         },
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-12",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children: "按钮组件: kitx-button",
//             },
//             {
//               type: "kitx-button",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "kitx-section",
//       children: [
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-8",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children: "分隔线组件: kitx-divider",
//             },
//             {
//               type: "kitx-divider",
//             },
//           ],
//         },
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-12",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children: "空白格组件: kitx-spacer",
//             },
//             {
//               type: "kitx-spacer",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "kitx-section",
//       children: [
//         {
//           type: "kitx-column",
//           attrs: {
//             class: "kitx-flex-16",
//           },
//           children: [
//             {
//               type: "kitx-text",
//               children:
//                 "社交分享组件: kitx-social, 社交分享元素: kitx-social-element",
//             },
//             {
//               type: "kitx-social",
//               children: [
//                 {
//                   type: "kitx-social-element",
//                   attributes: {
//                     name: "facebook",
//                   },
//                 },
//                 {
//                   type: "kitx-social-element",
//                   attributes: {
//                     name: "google",
//                   },
//                 },
//                 {
//                   type: "kitx-social-element",
//                   attributes: {
//                     name: "twitter",
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: "kitx-section",
//       children: [
//         {
//           type: "kitx-column",
//           children: [
//             {
//               type: "kitx-text",
//               children:
//                 "导航栏组件: kitx-navbar，导航栏子组件: kitx-navbar-link",
//             },
//             {
//               type: "kitx-navbar",
//               children: [
//                 {
//                   type: "kitx-navbar-link",
//                   children: "链接1-1",
//                 },
//                 {
//                   type: "kitx-navbar-link",
//                   children: "链接1-2",
//                 },
//                 {
//                   type: "kitx-navbar-link",
//                   children: "链接1-3",
//                 },
//                 {
//                   type: "kitx-navbar-link",
//                   children: "链接1-4",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     // {
//     //   type: "kitx-divider",
//     //   // children: "Content 1",
//     // },
//     // {
//     //   type: "kitx-spacer",
//     // },
//     // {
//     //   type: "kitx-button",
//     // },
//   ],
// });

document.getElementById("save").onclick = function () {
  console.log(kitxz.getData());
};

const diyBlocks = [
  {
    key: "DiyLayout",
    label: "区块",
    items: [
      {
        key: "SingleColumn",
        label: "1 Column",
      },
      {
        key: "DoubleColumn",
        label: "2 Column",
      },
      {
        key: "TribleColumn",
        label: "3 Column",
      },
    ],
  },
  {
    key: "DiyElement",
    label: "板块",
    items: [
      {
        key: "Text",
        label: "Text",
      },
      {
        key: "Button",
        label: "Button",
      },
      {
        key: "Image",
        label: "Image",
      },
      {
        key: "Divider",
        label: "Divider",
      },
      {
        key: "GroupSocial",
        label: "Group Social",
      },
      {
        key: "SocialElement",
        label: "Social Element",
      },
      {
        key: "Spacer",
        label: "Spacer",
      },
      {
        key: "Navbar",
        label: "Navbar",
      },
      {
        key: "NavbarLink",
        label: "Navbar Link",
      },
      {
        key: "Hero",
        label: "Hero",
      },
      {
        key: "Raw",
        label: "Raw",
      },
    ],
  },
];
