// 鑾峰彇html鍥剧墖瀵硅薄
const getImage = function (src) {
    var img = document.createElement('img');
    img.src = src;
    return img;
}

// 閲嶆柊缁樺埗
const rerender = function () {
    mycanvas.ctx.clearRect(0, 0, nWinW, nWinH);
    mycanvas.render();
}

// 鍥剧墖鍔犺浇
const load = function (mani, fn) {
    let status = "loading";
    let oImg, arrImgs = [],
        isReady = true;

    for (let i in mani) {
        oImg = new Image();
        oImg.src = mani[i];
        mani[i] = oImg;
        arrImgs.push(oImg)
    }

    onReady(arrImgs, fn);
};

const onReady = function (arr, fn) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].complete) {
            arr.splice(i, 1);
            i--;
        }
    }
    if (!arr.length && fn) {
        fn();
    } else {
        setTimeout(function () {
            onReady(arr, fn);
        }, 40);
    }
};