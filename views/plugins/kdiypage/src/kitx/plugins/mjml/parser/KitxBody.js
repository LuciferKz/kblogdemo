export default function (kit) {
  const children = kit.children || [];
  const seqNum = kit.seqNum;
  return `
    <section id="${seqNum}" class="kitx-body" style="width: 100%; min-height: 100%;">
      <section style="margin: 0px auto; max-width: 600px; pointer-events: none">
        ${children.map((child) => child.html).join(",")}
      </section>
    </section>
  `;
}
