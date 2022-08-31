export function JsonToHtml(data) {
  const processAttr = function (attrs) {
    if (!attrs) return "";
    const keys = Object.keys(attrs);
    return keys
      .map((k) => {
        return ` ${k}="${attrs[k]}"`;
      })
      .join("");
  };

  const processData = function (data) {
    if (!data) return "";
    const keys = Object.keys(data);
    return keys
      .map((k) => {
        return ` data-${k}="${data[k]}"`;
      })
      .join("");
  };

  const transformStyle = function (k) {
    const uppercase = k.match(/[A-Z]/g);
    let newK = k;
    if (uppercase) {
      uppercase.forEach((str) => {
        newK = newK.replace(str, `-${str.toLowerCase()}`);
      });
    }
    return newK;
  };

  const processStyle = function (style) {
    if (!style) return "";
    const keys = Object.keys(style);
    return `style="${keys
      .map((k) => `${transformStyle(k)}: ${style[k]};`)
      .join(" ")}"`;
  };

  const processChildren = function (kit) {
    if (kit.innerHTML) {
      return kit.innerHTML;
    } else if (kit.content) {
      return kit.content;
    } else if (kit.children) {
      return JsonToHtml(kit.children);
    } else {
      return "";
    }
  };

  const tags = /(div|span|)/;

  return data
    .map((d) => {
      let tagName = d.tag || d.type;
      const dataset = processData(d.data);
      const attrs = processAttr(d.attrs);
      const style = processStyle(d.style);
      const id = d.id || d.seqNum ? `id="${d.id || d.seqNum}"` : "";
      const innerHTML = processChildren(d);

      return `<${tagName} ${id}${dataset}${attrs}${style}>${innerHTML}</${tagName}>`;
    })
    .join("");
}

export class KitRenderer {
  constructor(cfg) {}

  toHtml(data) {
    return JsonToHtml(data);
  }
}
export default class Renderer {
  constructor() {}
}
