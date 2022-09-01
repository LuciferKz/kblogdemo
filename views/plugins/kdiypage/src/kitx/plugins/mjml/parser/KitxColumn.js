export default function (kit) {
  const children = kit.children || [];
  const padding = children.length > 0 ? "10px 0" : "20px 0";
  const seqNum = kit.seqNum;
  const { width } = kit.attributes;
  return `
    <section id="${seqNum}" class="kitx-section" style="padding: ${padding}; pointer-events: all;">
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
