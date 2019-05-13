export function guid () {
  let s = [], hexDigits = "0123456789abcdef";
  for (let i = 0; i < 16; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[3] = "4";
  s[7] = hexDigits.substr((s[7] & 0x3) | 0x8, 1);
  // s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}