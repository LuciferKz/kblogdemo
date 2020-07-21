/**
 * 图片列表预加载
 * @param {[Array]}               imgs          [图片地址数组]
 * @param {[String]}              eleid         [等待加载元素，只接收元素ID]
 *
 *  API:
 *  setCallback 设置回调函数
 *  @param [Object,String]        attr          [当参数类型为对象时，遍历对象数据。]
 *  @param [,Function]            value         [回调执行的函数]
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

    var isDom = function (obj) {
        return typeof HTMLElement === 'object' ? obj instanceof HTMLElement : (typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string');
    }

    var LoadingElement = function(type, elm, ispreload){
        var element;
        if(type === "img" && typeof elm === 'string'){
            element = document.createElement("img");
            element.src = elm;
        } else if (isDom(elm)) {
            element = elm
        }
        this.element = element;
        return this;
    };

    LoadingElement.prototype = {
        load:function(fn){
            var self = this;
            self.element.dataset.preload && (self.element.src = self.element.dataset.preload);
            self.element.onload = function () {
                fn();
            };
        },
        error:function(fn){
            var self = this;
            self.element.onerror = function () {
                console.error("有图片加载出现错误，请查看图片地址是否正确。");
                console.error("error src: " + self.src);
                fn();
            };
        }
    }

    var PreLoad = function(imgs){
        if(!imgs instanceof Array) throw Error("预加载图片必须为数组对象");

        var nCount = 0, nMaxCount, oDomPreloadImgs;

        var status = 1;

        var callback = this.callback = {
            finish : null,
            complete : null,
            fail : null
        };

        var createImg = function(elm){
            var oNewElm = new LoadingElement("img", elm);
            oNewElm.load(success);
            oNewElm.error(fail);
        };

        var complete = function(){
            nCount++;
            callback.complete && callback.complete({
                length:nCount,
                percentage:(nCount / nMaxCount).toFixed(2)
            });

            if(nCount === nMaxCount){
                finish();
            }
        };

        var success = function(){
            if (status) return;
            complete();
        };

        var fail = function(elm) {
            if (status) return;
            callback.fail && callback.fail({
                length:nCount,
                percentage:(nCount / nMaxCount).toFixed(2)
            });
            complete();
        };

        var finish = function(){
            status = 1;
            callback.finish && callback.finish({
                length:nCount,
                percentage:(nCount / nMaxCount).toFixed(2)
            });
        };

        this.getCallback = function(){
            console.log(callback);
        }
        this.start = function(cfg = {}){
            var arrImgs = imgs || [];
            oDomPreloadImgs = document.querySelectorAll('img[data-preload]');
            nMaxCount = arrImgs.length + oDomPreloadImgs.length;

            status = 0;

            for(var i = 0, len = arrImgs.length; i < len; i++){
                createImg(arrImgs[i]);
            }
            for (var i = 0, len = oDomPreloadImgs.length; i < len; i++) {
                createImg(oDomPreloadImgs[i])
            }

            setTimeout(() => {
                finish();
            }, cfg.waiting || 30000)
        };
    };
    PreLoad.prototype = {
        setCallback:function(attr, value){
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