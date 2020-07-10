var changeFont = function () {
    var nWdWidth = window.innerWidth;
    var nFontSize = nWdWidth / 750 * 100;
    document.getElementsByTagName("html")[0].style.fontSize = nFontSize + "px";
}
changeFont();
var changeHeight = function () {
    var oWrap = document.querySelector(".wrap");
    var wdH = window.innerHeight;
    if (wdH > oWrap.offsetHeight) {
        oWrap.style.minHeight = wdH + "px";
        oWrap.style.minHeight = "initial";
    }
}
var fnInit = function () {
//    changeHeight();
}
window.onload = fnInit;
window.onresize = function () {
    changeFont();
//    changeHeight();
}