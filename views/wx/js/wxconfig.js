
var api = 'http://wx.zhangzhenkai.com/sign'

var getSDK = function(){
  let res = fetch(`${api}?url=${encodeURIComponent(location.href.split("#")[0])}`)
  .then(response => {
    console.log(response);
    return response.json();
  });
  console.log(res);
  return res;
}

var wxConfig  = function() {
  return new Promise((resolve,reject)=>{
    getSDK()
    .then(result => {
      console.log(result)
      wx.config({
        debug: false,
        appId: result.appId,
        timestamp: result.timestamp,
        nonceStr: result.nonceStr,
        signature: result.signature,
        jsApiList: jsApiList
      });
      wx.ready(res=>{
          wx.updateAppMessageShareData({
            title: '您的专属皮肤顾问始终在身边',
            desc: '随时享受一对一专属服务',
            link: 'https://da.larocheposay.com.cn/lrplbs/index.html',
            imgUrl: 'https://da.larocheposay.com.cn/lrplbs/img/tt.jpg',
            success: function () {
              // 设置成功
            }
          })
          wx.updateTimelineShareData({
            title: '您的专属皮肤顾问始终在身边',
            link: 'https://da.larocheposay.com.cn/lrplbs/index.html',
            imgUrl: 'https://da.larocheposay.com.cn/lrplbs/img/tt.jpg',
            success: function () {
              // 设置成功
            }
          })
        resolve(res)
      })
      wx.error(err=>{
        reject(err)
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
}

var getRequestParam = function(name){
  var url = decodeURI(window.location.search);
  url = url.substr(1, url.length);
  var paramArray = url.split("&");
  for(var i = 0; i < paramArray.length; i++){
    var key = paramArray[i].split("=")[0];
    var value = paramArray[i].split("=")[1];
    if(key == name){
      return value;
    }
  }
  return ;
}
