
   /**
 * 图片列表预加载
 * @param {[Array]}               imgs          [图片地址数组]
 * @param {[String]}              eleid         [等待加载元素，只接收元素ID]
 *
 *  API:
 *  setCallback 设置回调函数
 *  @param [Object,String]        attr          [当参数类型为对象时，遍历对象数据。]
 *  @param [,Function]               value         [回调执行的函数]
 *  {
 *      finish      加载全部完成执行
 *      complete    每张图片加载完成执行
 *      fail        某张图片失败之后执行
 *  }
 *  回调返回值:
 *  returnvalue {
 *      element    图片加载中的内容遮罩层DOM对象
 *      percentage 图片加载进度
 *      length     目前加载完的图片数量
 *  }
 */

(function(window,document){
    var isFunc = function(obj){
        return Object.prototype.toString.call(obj) === "[object Function]";
    }

    var LoadingElement = function(type,src){
        var oNewDom;
        if(type === "img"){
            oNewDom = document.createElement("img");
            oNewDom.src = src;
        }
        this.element = oNewDom;
        return this;
    };

    LoadingElement.prototype = {
        load:function(fn){
            this.element.onload = fn;
        },
        error:function(fn){
            this.element.onerror = fn;
        }
    }

    var PreLoad = function(imgs,eleid){
        if(imgs instanceof Array){
            var arrImgs = imgs,
                nMaxCount = imgs.length;
        }else{
            throw Error("预加载图片必须为数组对象");
        }

        if(typeof eleid === "string"){
            var oDomLayerLoading = document.getElementById(eleid);
        }else{
            throw Error("等待加载元素只接收元素ID");
        }

        var nCount = 0;

        var callback = this.callback = {
            finish : null,
            complete : null,
            fail : null
        };

        var createImg = function(src){
            var oNewElm = new LoadingElement("img",src);
            oNewElm.load(success);
            oNewElm.error(fail);
        };

        var complete = function(){
            nCount++;

            callback.complete && callback.complete({
                length:nCount,
                element:oDomLayerLoading,
                percentage:(nCount / nMaxCount).toFixed(2)
            });

            if(nCount === nMaxCount){
                finish();
            }
        };

        var success = function(){
            complete();
        };

        var fail = function(){
            console.error("有图片加载出现错误，请查看图片地址是否正确。");
            callback.fail && callback.fail({
                length:nCount,
                element:oDomLayerLoading,
                percentage:(nCount / nMaxCount).toFixed(2)
            });
            complete();
        };

        var finish = function(){
            callback.finish && callback.finish({
                length:nCount,
                element:oDomLayerLoading,
                percentage:(nCount / nMaxCount).toFixed(2)
            });
        };

        this.getCallback = function(){
            console.log(callback);
        }

        this.start = function(){
            for(var i = 0;i < nMaxCount;i++){
                createImg(arrImgs[i]);
            }
        };
    };
    PreLoad.prototype = {
        setCallback:function(attr,value){
            if(typeof attr === "object"){
                for(var prop in attr){
                    if(!isFunc(attr[prop])){
                        console.error("callback "+ prop +" is not function");
                        return;
                    }
                    this.callback[prop] = attr[prop];
                }
            }else if(typeof attr === "string"){
                if(!isFunc(value)){
                    console.error("callback "+ attr +" is not function");
                    return;
                }
                this.callback[attr] = value;
            }
            return this;
        }
    };

    window.PreLoad = PreLoad;

}(window,document));