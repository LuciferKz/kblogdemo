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

export const parseStyle = function (style) {
  if (!style) return "";
  const keys = Object.keys(style);
  return `style="${keys
    .map((k) => `${transformStyle(k)}: ${style[k]};`)
    .join(" ")}"`;
};
