var delay = function (fn, dur) {
    if (typeof fn !== "function") {
        console.error("is not a function");
    } else {
        setTimeout(fn, dur);
    }
}

var arrHas = function (arr, val) {
    if (arr.indexOf(val) > -1) {
        return true;
    } else {
        return false;
    }
}
var rand = function () {
    return Math.random() - 0.5;
}

var fnToDoubleDigit = function (n) {
    return ("0" + n).substr(-2, 2);
}