// 整个页的宽度
const maxWidth = 3750;

// 预加载图片
const manifest = {
    // "bg": "img/bg.jpg",
    "title": "img/title.png",
    "img1": "img/p1.png",
    "img2": "img/p2.png",
    "item": "img/p3.png",
    "cloud1": "img/p4.png",
    "cloud2": "img/p5.png",
    "dog1": "img/dog1.png",
    "dog2": "img/dog2.png",
    "img3": "img/p6.png",
    "img4": "img/p7.png",
    "img5": "img/p8.png",
    "img6": "img/p9.png",
    "img7": "img/p10.png",
    "img8": "img/p11.png",
    "img9": "img/p12.png",
    "img10": "img/p13.png",
    "img11": "img/p14.png",
    "dog3": "img/dog3.png",
    // "img12": "img/p15.png",
    "img13": "img/p16.png",
    "img14": "img/p17.png",
    "img15": "img/p18.png",
    "img16": "img/p19.png",
    "img17": "img/p20.png",
    "img18": "img/p21.png",
    "img19": "img/p22.png",
    "img20": "img/p26.png",
    "img21": "img/p27.png",
    "img22": "img/p28.png",
    "img23": "img/p29.png",
    "img24": "img/p30.png",
    "img25": "img/p31.png",
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


const layers = [

    
    
    
    
    {
    type: 'img',
    frames: [{
        img: manifest.title,
        x: 231, //初始的top
        y: 44,//初始的left
        width: 301, //div宽度
        height: 173, //div高度
        sx: 0, // 图片哪个位置开始画到canvas上
        sy: 0, // 图片哪个位置开始画到canvas上
        sw: 301, // 图片宽度
        sh: 173, // 图片高度
    }, {
        //进场画布结束点
        startX: 0, //往左滑动多少开始动画
        endX: 0,//往左滑动多少结束动画
        x: 231, //到left的位子
        alpha: 1, //透明度
    }, {
        //移出画布动画
        startX: 0, //往左滑动多少开始移出动画
        endX: 0,//往左滑动多少结束移除动画
        x: 231,//到图片left移动到的位子
        alpha: 1, //透明度
    }]
}, 

//第一帧动画


{
    type: 'img',
    frames: [{
        img: manifest.item,
        x: -630,
        y: 400,
        width: 1800, 
        height: 1800,
        sx: 0,
        sy: 0,
        sw: 1800,
        sh: 1800,
        rotate: 0,
        rx: 355,
        ry: 1410,
    }, {
        startX: 0,
        endX: 2000*5,
        rotate: -875,
    }]
},


    
{
    type: 'img',
    frames: [{
        img: manifest.img2,
        x: 0,
        y: 260,
        width: 750,
        height: 361,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 361,
    }, {
        startX: 10*5,
        endX: 50*5,
        x:0,
        alpha: 1,
    }, {
        startX: 0,
        endX: 100*5,
        x:-100,
        alpha: 0,
    }]
},




{
    type: 'img',
    frames: [{
        img: manifest.cloud2,
        x: 20,
        y: 20,
        width: 152,
        height: 92,
        sx: 0,
        sy: 0,
        sw: 152,
        sh: 92,
    }, {
        startX: 10*5,
        endX: 50*5,
        x:20,
        alpha: 1,
    }, {
        startX: 10*5,
        endX: 150*5,
        x:-100,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.cloud1,
        x: 520,
        y: 720,
        width: 247,
        height: 152,
        sx: 0,
        sy: 0,
        sw: 247,
        sh: 152,
    }, {
        startX: 10*5,
        endX: 50*5,
        x:520,
        alpha: 1,
    }, {
        startX: 0,
        endX: 150*5,
        x:-100,
        alpha: 0,
    }]
},


// {
//     type: 'img',
//     frames: [{
//         img: manifest.dog1,
//         x: -50,
//         y: 770,
//         width: 363,
//         height: 205,
//         sx: 0,
//         sy: 0,
//         sw: 363,
//         sh: 205,
//     }, {
//         startX: 0,
//         endX: 50,
//         x: -50,
//         alpha: 1,
//     }, {
//         startX: 0,
//         endX: 100,
//         x:590,
//         alpha: 0,
//     }]
// },

// 第二帧动画开始

{
    type: 'img',
    frames: [{
        img: manifest.img17,
        x: -800,
        y: 400,
        width: 750,
        height: 429,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 429,
    }, {
        startX: 80*5,
        endX: 100*5,
        x: 5,
        alpha: 1,
    }, {
        startX: 200*5,
        endX: 220*5,
        x:1590,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img18,
        x: 30,
        y: 250,
        width: 440,
        height: 104,
        sx: 0,
        sy: 0,
        sw: 440,
        sh: 104,
        alpha: 0,
    }, {
        startX: 80*5,
        endX: 100*5,
        y: 360,
        alpha: 1,
    }, {
        startX: 200*5,
        endX: 220*5,
        y: 400,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img20,
        x: 800,
        y: 360,
        width: 243,
        height: 325,
        sx: 0,
        sy: 0,
        sw: 243,
        sh: 325,
        alpha: 0,
    }, {
        startX: 80*5,
        endX: 150*5,
        x: 480,
        alpha: 1,
    }, {
        startX: 200*5,
        endX: 220*5,
        x:-590,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img21,
        x: 420,
        y: 820,
        width: 173,
        height: 118,
        sx: 0,
        sy: 0,
        sw: 173,
        sh: 118,
        alpha: 0,
    }, {
        startX: 80*5,
        endX: 150*5,
        y: 620,
        alpha: 1,
    }, {
        startX: 200*5,
        endX: 220*5,
        y:420,
        alpha: 0,
    }]
},





{
    type: 'img',
    frames: [{
        img: manifest.img22,
        x: 550,
        y: 800,
        width: 203,
        height: 172,
        sx: 0,
        sy: 0,
        sw: 203,
        sh: 172,
        alpha: 0,
    }, {
        startX: 100*5,
        endX: 170*5,
        y: 600,
        alpha: 1,
    }, {
        startX: 200*5,
        endX: 220*5,
        y:400,
        alpha: 0,
    }]
},






// {
//     type: 'img',
//     frames: [{
//         img: manifest.dog2,
//         x: -550,
//         y: 800,
//         width: 432,
//         height: 262,
//         sx: 0,
//         sy: 0,
//         sw: 432,
//         sh: 262,
//     }, {
//         startX: 80,
//         endX: 150,
//         x: 50,
//         alpha: 1,
//     }, {
//         startX: 160,
//         endX: 220,
//         x:590,
//         alpha: 0,
//     }]
// },


{
    type: 'img',
    frames: [{
        img: manifest.cloud2,
        x: 720,
        y: 120,
        width: 152,
        height: 92,
        sx: 0,
        sy: 0,
        sw: 152,
        sh: 92,
    }, {
        startX: 80*5,
        endX: 150*5,
        x:620,
        alpha: 1,
    }, {
        startX: 160*5,
        endX: 220*5,
        x:-100,
        alpha: 0,
    }]
},


// 第三帧动画开始

{
    type: 'img',
    frames: [{
        img: manifest.img4,
        x: -800,
        y: 270,
        width: 750,
        height: 575,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 575,
    }, {
        startX: 230*5,
        endX: 270*5,
        x: 0,
        alpha: 1,
    }, {
        startX: 350*5,
        endX: 400*5,
        x:1590,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img3,
        x: 1800,
        y: 370,
        width: 750,
        height: 575,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 575,
    }, {
        startX: 230*5,
        endX: 270*5,
        x: 0,
        alpha: 1,
    }, {
        startX: 350*5,
        endX: 400*5,
        x:-800,
        alpha: 0,
    }]
},


{
    type: 'img',
    frames: [{
        img: manifest.img5,
        x: -300,
        y: 220,
        width: 284,
        height: 245,
        sx: 0,
        sy: 0,
        sw: 284,
        sh: 245,
    }, {
        startX: 230*5,
        endX: 330*5,
        x: 600,
        y:160,
        alpha: 1,
    }, {
        startX: 350*5,
        endX: 400*5,
        x:800,
        alpha: 0,
    }]
},


{
    type: 'img',
    frames: [{
        img: manifest.img6,
        x: 1200,
        y: 500,
        width: 250,
        height: 262,
        sx: 0,
        sy: 0,
        sw: 250,
        sh: 262,
    }, {
        startX: 230*5,
        endX: 330*5,
        x: 0,
        y: 700,
        alpha: 1,
    }, {
        startX: 350*5,
        endX: 400*5,
        x:-800,
        alpha: 0,
    }]
},


// {
//     type: 'img',
//     frames: [{
//         img: manifest.dog1,
//         x: -350,
//         y: 850,
//         width: 363,
//         height: 205,
//         sx: 0,
//         sy: 0,
//         sw: 363,
//         sh: 205,
//     }, {
//         startX: 230,
//         endX: 330,
//         x: -50,
//         alpha: 1,
//     }, {
//         startX: 350,
//         endX: 400,
//         x:590,
//         alpha: 0,
//     }]
// },





// 第四帧动画开始






{
    type: 'img',
    frames: [{
        img: manifest.img8,
        x: 1250,
        y: 300,
        width: 498,
        height: 129,
        sx: 0,
        sy: 0,
        sw: 498,
        sh: 129,
    }, {
        startX: 410*5,
        endX: 430*5,
        x: 300,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        x:-1590,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img10,
        x: -1200,
        y: 445,
        width: 750,
        height: 209,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 209,
    }, {
        startX: 450*5,
        endX: 470*5,
        x: 0,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        x:590,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img9,
        x: 1000,
        y: 373,
        width: 633,
        height: 150,
        sx: 0,
        sy: 0,
        sw: 633,
        sh: 145,
    }, {
        startX: 450*5,
        endX: 470*5,
        x: 120,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        x:-590,
        alpha: 0,
    }]
},


{
    type: 'img',
    frames: [{
        img: manifest.img11,
        x: 1000,
        y: 545,
        width: 633,
        height: 150,
        sx: 0,
        sy: 0,
        sw: 633,
        sh: 145,
    }, {
        startX: 460*5,
        endX: 480*5,
        x: 120,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        x:590,
        alpha: 0,
    }]
},

//狗头

{
    type: 'img',
    frames: [{
        img: manifest.img7,
        x: 0,
        y: 220,
        width: 274,
        height: 328,
        sx: 0,
        sy: 0,
        sw: 274,
        sh: 328,
        alpha: 0,
    }, {
        startX: 480*5,
        endX: 490*5,
        x: 0,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        x:590,
        alpha: 0,
    }]
},

//狗滑板


// {
//     type: 'img',
//     frames: [{
//         img: manifest.dog3,
//         x: -500,
//         y: 900,
//         width: 450,
//         height: 255,
//         sx: 0,
//         sy: 0,
//         sw: 450,
//         sh: 255,
//         alpha: 0,
//     }, {
//         startX: 410,
//         endX: 480,
//         x: 150,
//         alpha: 1,
//     }, {
//         startX: 510,
//         endX: 540,
//         x:790,
//         alpha: 0,
//     }]
// },


{
    type: 'img',
    frames: [{
        img: manifest.img23,
        x: 400,
        y: 790,
        width: 79,
        height: 68,
        sx: 0,
        sy: 0,
        sw: 79,
        sh: 68,
        alpha: 0,
    }, {
        startX: 520*5,
        endX: 540*5,
        y: 690,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        y:590,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img24,
        x: 600,
        y: 850,
        width: 52,
        height: 44,
        sx: 0,
        sy: 0,
        sw: 52,
        sh: 44,
        alpha: 0,
    }, {
        startX: 510*5,
        endX: 530*5,
        x:500,
        y: 750,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        y:600,
        alpha: 0,
    }]
},



{
    type: 'img',
    frames: [{
        img: manifest.img25,
        x: 400,
        y: 900,
        width: 241,
        height: 137,
        sx: 0,
        sy: 0,
        sw: 241,
        sh: 137,
        alpha: 0,
    }, {
        startX: 500*5,
        endX: 520*5,
        y: 800,
        alpha: 1,
    }, {
        startX: 560*5,
        endX: 580*5,
        y:700,
        alpha: 0,
    }]
},





// 第五帧动画


{
    type: 'img',
    frames: [{
        img: manifest.img13,
        x: 1200,
        y: 300,
        width: 0,
        height: 0,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 471,
        alpha: 1,
    }, {
        startX: 570*5,
        endX: 620*5,
        x:0,
        width: 750,
        height: 471,
        alpha: 1,
    }, {
        startX: 630*5,
        endX: 650*5,
        width: 0,
        height: 0,
        x:-1200,
        alpha: 0,
    }]
},

// 第六帧动画


{
    type: 'img',
    frames: [{
        img: manifest.img14,
        x: 1200,
        y: 300,
        width: 750,
        height: 348,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 348,
        alpha: 1,
    }, {
        startX: 660*5,
        endX: 670*5,
        x:0,
        alpha: 1,
    }, {
        startX: 670*5,
        endX: 670*5,
        x:0,
        alpha: 1,
    }]
},


{
    type: 'img',
    frames: [{
        img: manifest.img15,
        x: -1200,
        y: 400,
        width: 750,
        height: 399,
        sx: 0,
        sy: 0,
        sw: 750,
        sh: 399,
        alpha: 1,
    }, {
        startX: 660*5,
        endX: 670*5,
        x:0,
        alpha: 1,
    }, {
        startX: 670*5,
        endX: 670*5,
        x:0,
        alpha: 1,
    }]
},













];