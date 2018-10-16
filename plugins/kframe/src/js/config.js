// 整个页的宽度
const maxWidth = 2000;

// 预加载图片
const manifest = {
    "bg": "src/img/bg.jpg",
    "item": "src/img/result.png",
    "img1": "src/img/img1.png",
    "button": "src/img/button.png",
    "title": "src/img/title.png",
    "title1": "src/img/title1.png",
    "rank": "src/img/rank.png",
    "tx1": "src/img/tx1.png",
    "tx2": "src/img/tx2.png",
    "tx3": "src/img/tx3.png",
    "music": "src/img/music.png",
    "line1": "src/img/line1.png",
    "line2": "src/img/line2.png"
};

/**
 * 
 * 所有图层，type目前就img一种
 * 
 * frames是图层的几个阶段
 * type: img
 * 
 * {
 *   img: 图片链接地址,
 *   x: 页面中初始位置横坐标,
 *   y: 页面中初始位置纵坐标,
 *   width: 在画布上要展示的宽,
 *   height: 在画布上要展示的高,
 *   sx: 从图片的x位置开始使用,
 *   sy: 从图片的y位置开始使用,
 *   sw: 图片的自身宽度,
 *   sh: 图片的自身高度,
 *   alpha: 图层透明度, 默认为1
 * }
 * 
 * {
 *   startX: 向左滑了多少像素之后开始这一帧动画,
 *   endX: 滑到多少之后结束动画,
 *   其他可以设置的属性都是包括上面初始的几个
 * }
 * 
 */
const layers = [{
    type: 'img',
    frames: [{
        img: manifest.img1,
        x: 0,
        y: -343,
        width: 375,
        height: 243,
        sx: 0, // 图片哪个位置开始画到canvas上
        sy: 0, // 图片哪个位置开始画到canvas上
        sw: 750, // 图片宽度
        sh: 486, // 图片高度
    }, {
        startX: 0,
        endX: 100,
        y: 100,
        alpha: 1,
    }, {
        startX: 200,
        endX: 300,
        y: 800,
        alpha: 0,
    }]
}, {
    type: 'img',
    frames: [{
        img: manifest.title,
        x: 0,
        y: -70,
        width: 375,
        height: 70,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 140,
    }, {
        startX: 300,
        endX: 400,
        y: 100,
        alpha: 1,
    }, {
        startX: 500,
        endX: 600,
        y: 800,
        alpha: 0,
    }]
}, {
    type: 'img',
    frames: [{
        img: manifest.title1,
        x: 0,
        y: -76,
        width: 375,
        height: 76,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 153,
    }, {
        startX: 600,
        endX: 700,
        y: 100,
        alpha: 1,
    }, {
        startX: 800,
        endX: 900,
        y: 800,
        alpha: 0,
    }]
}, {
    type: 'img',
    frames: [{
        img: manifest.tx1,
        x: 0,
        y: 600,
        width: 70,
        height: 70,
        sx: 0,
        sy: 0,
        sw: 70,
        sh: 70,
        rotate: 0,
        rx: 35,
        ry: 635,
    }, {
        startX: 0,
        endX: 2000,
        rotate: 360,
    }]
}];