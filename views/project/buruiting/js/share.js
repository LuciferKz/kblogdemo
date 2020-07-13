/**
 * Created by Mr.Seventh on 2017/10/20 0020.
 */
function share(appId,timestamp,nonceStr,signature,share_title,share_desc,share_link,share_imgUrl){
    wx.config({
        debug: false,
        appId: appId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
    wx.ready(function(){
        wx.onMenuShareTimeline({

            title: share_title,

            link: share_link,

            imgUrl: share_imgUrl,

            success: function () {
            },
            cancel: function () {
            }
        });
        wx.onMenuShareAppMessage({

            title: share_title,

            desc: share_desc,

            link: share_link,

            imgUrl: share_imgUrl,

            type: '',

            dataUrl: '',

            success: function () {
            },
            cancel: function () {
            }
        });
    });
    //    接口调用失败时触发，错误信息
    wx.error(function (res) {
        alert(res.errMsg);
    });
}