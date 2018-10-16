/*
    组件 prop 属性

    type:Number, // 属性类型
    default:1, // 默认值
    required:true, // 是否必须
    validator:function(value){
        return value < 3;
    } // 验证数据回调函数

    驼峰命名的属性名，在调用组件填写的时候需要改成短横线隔开方式。

    props:{navIndex:Number}

    <component :nav-index='1'></component>

    prop传入数据如果为对象或数组，如果修改会影响父级组件的状态
 */

//页面标题
Vue.component("main-title",{
    props:{
        id:Number,
        title:String
    },
    computed:{
        normalizeId:function(){
            return this.id + 100000;
        }
    },
    template:"<h1 :id='normalizeId'>{{title}}</h1>",
});

Vue.component("main-content",{
    props:{
        data:[{
            id:1,
            name:"page1"
        },{
            id:2,
            name:"page2"
        },{
            id:3,
            name:"page3"
        }]
    },
    template:"<div><slot>暂无内容!</slot></div>"
})

Vue.component("my-article",{
    template:`
        <div class="article-container">
            <slot name="article-title">文章标题</slot>
            <div class="article-content">
                <slot>文章内容</slot>
            </div>
            <slot name="article-signature">署名</slot>
        </div>
    `
})

//局部组件
var mainNav = {
    template:"<nav class='nav'><a href='page1.html' :class='{ active : navIndex == 1}'>菜单一</a><a href='page2.html' :class='{ active : navIndex == 2}'>菜单二</a><a href='#'>菜单三</a></nav>",
    props:{
        navIndex:{
            type:Number,
            default:1,
            required:true,
            validator:function(value){
                return value < 3;
            }
        }
    },
    computed:{
    }
}

var mixinFoot = {
    template:`
        <div class="common-foot" :class="clsFootStatus">

        </div>
    `,
    data:function(){
        return {
            clsFootStatus:"shrink"
        }
    },
    created : function(){
        this.expand();
    },
    method : {
        expand : function(){
            this.clsFootStatus = "expand";
        }
    }
};

Vue.component('img-item', {
    props: ['vsrc'],
    template: '<img :src="vsrc ? vsrc + \'abc\' : \'sss\'" />'
})

var commonFoot = Vue.extend(mixinFoot);

Vue.component("common-foot",commonFoot);
