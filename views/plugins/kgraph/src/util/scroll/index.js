export function getScrollLeft () {
  const scrollLeft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft
  return scrollLeft
}
export function getScrollTop () {
  const scrollTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop
  return scrollTop
}