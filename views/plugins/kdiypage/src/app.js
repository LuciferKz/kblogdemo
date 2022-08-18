import KitxDiy from "./kitx";
import { KitEditor } from "./kitx/plugins";
import { EmailComponents } from "./kitx/components";
import "./style/index.css";

const kitxz = new KitxDiy({
  container: document.querySelector(".diy-emulator"),
});
kitxz.installComponents(EmailComponents);
const editor = kitxz.installPlugin("editor", KitEditor, {
  container: document.querySelector(".diy-emulator-container"),
});
editor.addEvents("richeditor", {
  dblclick() {
    const el = this.get("el");
    el.setAttribute("contenteditable", true);
    el.focus();
  },
  blur() {
    const el = this.get("el");
    el.setAttribute("contenteditable", false);
    el.focus();
  },
});

document.querySelectorAll(".diy-blocks-item").forEach((item) => {
  editor.addDragItem(item);
});

// kitxz.load([
//   {
//     type: "kit-section",
//     children: [
//       {
//         type: "kit-column",
//         children: [
//           {
//             type: "richeditor",
//             content: "Content 1",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     type: "kit-section",
//     children: [
//       {
//         type: "kit-column",
//         children: [
//           {
//             type: "richeditor",
//             content: "Content 1",
//           },
//         ],
//       },
//       {
//         type: "kit-column",
//         children: [
//           {
//             type: "richeditor",
//             content: "Content 2",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     type: "kit-section",
//     children: [
//       {
//         type: "kit-column",
//         attrs: {
//           class: "kitx-flex-12",
//         },
//         children: [
//           {
//             type: "richeditor",
//             content: "Content 1",
//           },
//           {
//             type: "richeditor",
//             content: "Content 4",
//           },
//         ],
//       },
//       {
//         type: "kit-column",
//         attrs: {
//           class: "kitx-flex-12",
//         },
//         children: [
//           {
//             type: "richeditor",
//             content: "Content 2",
//           },
//         ],
//       },
//       {
//         type: "kit-column",
//         attrs: {
//           class: "kitx-flex-12",
//         },
//         children: [
//           {
//             type: "richeditor",
//             content: "Content 3",
//           },
//         ],
//       },
//     ],
//   },
// ]);

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
