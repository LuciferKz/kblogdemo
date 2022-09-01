import { parseStyle } from "./parser";
export default function (kit, options = {}) {
  const children = kit.children || [];
  const padding = children.length > 0 ? "10px 0" : "20px 0";
  const seqNum = kit.seqNum;
  const { width } = kit.attributes;

  const containerStyle = {
    padding: padding,
    "pointer-events": "all",
  };

  if (options.editing) {
    containerStyle.outline = "1px dashed rgba(170,170,170,0.7)";
    containerStyle.outlineOffset = "-2px";
  }
  return `
    <section id="${seqNum}" class="kitx-section" ${parseStyle(containerStyle)}>
      ${children.map((child) => child.html).join(",")}
    </section>
  `;
}

// {
//   tag: "section",
//   ref: "container",
//   style: {
//     pointerEvents: "all",
//     padding: "10px 0",
//   },
//   children: [
//     {
//       tag: "table",
//       attrs: {
//         cellpadding: 0,
//         cellspacing: 0,
//         border: 0,
//         width: "100%",
//       },
//       children: [
//         {
//           tag: "tr",
//           children: [
//             {
//               tag: "td",
//               attrs: {
//                 class: "kitx-flex",
//               },
//               slot: "default",
//               // children: "$default",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }
