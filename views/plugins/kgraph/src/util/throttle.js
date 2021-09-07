export default function throttle(fn, interval = 1000 / 120) {
  let last = 0
  return function () {
    let context = globalThis
    let args = arguments
    let now = +new Date()

    if (now - last >= interval) {
      last = now;
      fn.apply(context, args);
    }
  }
}