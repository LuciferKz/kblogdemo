# **kmodal**
<br />

这是vue使用的一个弹层消息全局组件
<br />

**目前有5种已存在的消息模板**

默认: default
信息: info
危险: danger
警告: warning
成功: success

<br />

**安装**

    npm i kmodal

**使用方式**（目前只支持vue.use使用）

    import vue from 'vue.js'
    import kmodal from 'kmodal.js'

    vue.use(kmodal)

    使用组件
    <k-modal ref="kmodal"></k-modal>

    在App组件内加载完成后初始化一次
    this.$kmodal.init(this.$refs.kmodal)

<br />

更新:
1. show新增异步回调
2. 默认主题样式 kmodal-theme-default 例:
```html
    <k-modal class="kmodal-theme-default"></k-modal>
```
3. 切换效果自定义 通过animType配合@keyframes
4. 自定义modal内容

<br />

**打开kmodal**

弹出消息

    this.$kmodal.show({
      type: 'success',   // 消息类型
      duration: 500,     // 过渡时长(毫秒单位)
      timingFn: 'linear' // 速度曲线，可以使用所有css3 transition中的速度曲线
      message: 'message content' // 设置弹出消息的文字内容
      animType: 'fade' // 目前已定义过渡动画方式 fade
    }).then(function (res) {
        // 取消 false 确定 true
    })

**关闭kmodal**

隐藏消息

    this.$kmodal.hide({
      duration: 500,     // 过渡时长(毫秒单位)
      timingFn: 'linear' // 过渡函数
    })

**提供slot自定义kmodal中的内容**

    <k-modal>
        <p>kmodal 自定义内容</p>
    </k-modal>

**切换效果自定义 通过animType配合@keyframes**

<br />

    /** 
    可以定制的切换效果
    fade为可变的值, 以传入的animType为准
    animType: fade
    **/
    
    @keyframes kcoverFadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes kcoverFadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translate(-50%, 80px)
        }
        100% {
            opacity: 1;
            transform: translate(-50%, 100px)
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: translate(-50%, 100px)
        }
        100% {
            opacity: 0;
            transform: translate(-50%, 80px)
        }
    }

[演示地址](http://demo.zhangzhenkai.com/plugins/kmodal/dist/index.html)
[git地址](https://github.com/LuciferKz/kblogdemo/tree/master/plugins/kmodal)