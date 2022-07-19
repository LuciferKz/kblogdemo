<style lang="less" scoped>
  @import './goodsBannerTem.less';

</style>

<template>
  <div class="goodsBanner diyitem" :style="{height:dot_title? '320px' : '280px'}">
      <div  v-if="colorGroup.length == 0">
        <div class="titleShow" v-if="dot_title">{{dot_title}}</div>
        <Carousel
            v-model="currentId"
            style="width:340px"
            dots="none"
            @on-change="changeSwiper"
            >
            <CarouselItem :style="{width:span_isshow == 'span_show'? '300px':'340px'}">
                <div :class="[choose == 'noauto_one'?'sl-item-one carousel':'sl-item carousel']" 
                :style="{margin:span_isshow == 'span_show'? '0px 20px':'0px 0px',boxShadow:shadow_isshow == 'shadow_show'? '0px 0px 10px #ccc':''}">
                    <div class="d-img">
                        <img src="../../static/img/default_onegoods.jpg" alt="">
                    </div>
                    <div class="d-detail">
                        <div class="name line-hide" v-if="goods.includes('goods_title')">这里是商品标题</div>
                        <div class="subtitle line-hide" v-if="goods.includes('goods_subtitle')">
                            这里是商品副标题
                        </div>
                        <div style="display: flex;">
                            <div style="flex: 1 1 0%;">
                                <div class="price"><span class="text" v-if="goods.includes('goods_price')">￥<span>20.00</span></span><span class="productprice" v-if="goods.includes('origin_price')">￥0.00</span></div>
                                <div class="sold" v-if="goods.includes('goods_sale')"><span>已售0</span></div>
                            </div> 
                            <span class="buy buybtn1" v-if="cart == 'cart_show'">购买</span>
                        </div>
                    </div>
                </div>
            </CarouselItem>
        </Carousel>
        <div class="dots" v-if="dot_isshow == 'dot_show'">
        <div
            :class="[dot_type]"
            :style="{background:index == currentId ? dot_color : 'rgba(0,0,0,0.2)',margin:'0px 6px'}"
            v-for="(item,index) in colorGroup"
            :key="index"
        ></div>
        </div>
        
        <div class="iconDot" v-if="dotIcon_isshow == 'dotIcon_show'">
        <span class="icon iconfont icon-right icon-right-show" :style="{color:dotIcon_color}"></span>
        <span class="icon iconfont icon-left icon-left-show" :style="{color:dotIcon_color}"></span>
        </div>
    
      </div>
      <div v-else>
        <div class="titleShow" v-if="dot_title" >{{dot_title}}</div>
        <Carousel
            v-model="currentId"
            style="width:340px"
            dots="none"
            @on-change="changeSwiper"
        >
            <CarouselItem v-for="(item,index) in colorGroup" :key="index" :style="{width:span_isshow == 'span_show'? '300px':'340px'}">
                <div v-if="choose == 'noauto_one'" class="sl-item-one"
                :style="{margin:span_isshow == 'span_show'? '0px 20px':'0px 0px',boxShadow:shadow_isshow == 'shadow_show'? '0px 0px 10px #ccc':''}">
                    <div class="d-img">
                        <img v-if="item.thumb" :src="item.thumb" alt="">
                        <img v-else src="../../static/img/default_onegoods.jpg" alt="">
                    </div>
                    <div class="d-detail">
                        <div class="name line-hide" v-if="goods.includes('goods_title')">{{item.title || '这里是商品标题'}}</div>
                        <div class="subtitle line-hide" v-if="goods.includes('goods_subtitle')">
                            {{item.subTitle || '这里是商品副标题'}}
                        </div>
                        <div style="display: flex;">
                            <div style="flex: 1 1 0%;">
                                <div class="price"><span class="text" v-if="goods.includes('goods_price')">￥<span>{{item.price || '20.00'}}</span></span><span class="productprice" v-if="goods.includes('origin_price')">￥0.00</span></div>
                                <div class="sold" v-if="goods.includes('goods_sale')"><span>已售{{item.isSales || 0}}</span></div>
                            </div> 
                            <span class="buy buybtn1" v-if="cart == 'cart_show'">购买</span>
                        </div>
                    </div>
                </div>
                <div  class="shuang" v-else
                :style="{margin:span_isshow == 'span_show'? '0px 20px':'0px 0px'}">
                    <div v-for="(item_two,index_two) in item" class="sl-item" :key="index_two"
                    :style="{boxShadow:shadow_isshow == 'shadow_show'? '0px 0px 10px #ccc':''}">
                        <div class="d-img">
                            <img v-if="item_two.thumb" :src="item_two.thumb" alt="">
                            <img v-else src="../../static/img/default_onegoods.jpg" alt="">
                        </div>
                        <div class="d-detail">
                            <div class="name line-hide" v-if="goods.includes('goods_title')">{{item_two.title || '这里是商品标题'}}</div>
                            <div class="subtitle line-hide" v-if="goods.includes('goods_subtitle')">
                                {{item_two.subTitle || '这里是商品副标题'}}
                            </div>
                            <div style="display: flex;">
                                <div style="flex: 1 1 0%;">
                                    <div class="price"><span class="text" v-if="goods.includes('goods_price')">￥<span>{{item_two.price || '20.00'}}</span></span><span class="productprice" v-if="goods.includes('origin_price')">￥0.00</span></div>
                                    <div class="sold" v-if="goods.includes('goods_sale')"><span>已售{{item_two.isSales || 0}}</span></div>
                                </div> 
                                <span class="buy buybtn1" v-if="cart == 'cart_show'">购买</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CarouselItem>
        </Carousel>
        <div class="dots" v-if="dot_isshow == 'dot_show'">
        <div
            :class="[dot_type]"
            :style="{background:index == currentId ? dot_color : 'rgba(0,0,0,0.2)',margin:'0px 6px'}"
            v-for="(item,index) in colorGroup"
            :key="index"
        ></div>
        </div>
        
        <div class="iconDot" v-if="dotIcon_isshow == 'dotIcon_show'">
        <span class="icon iconfont icon-right icon-right-show" :style="{color:dotIcon_color}"></span>
        <span class="icon iconfont icon-left icon-left-show" :style="{color:dotIcon_color}"></span>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    props:['options'],
    data() {
      return {
        choose: 'noauto_one',
        goods:['goods_title','goods_price','goods_subtitle'],
        cart:'cart_show',
        currentId: 0,
        dot_title: '轮播标题',
        dot_isshow: 'dot_show',
        colorGroup:[],
        span_isshow: 'span_hide',
        shadow_isshow: 'shadow_hide',
        dotIcon_isshow: 'dotIcon_hide',
        dotIcon_color: '#000',
        dot_type: 'dot_circle',
        dot_position: 'dot_inside',
        dot_color: "#000"
      }
    },
    watch:{
      options:{
        handler(oldValue,newValue){
          let _this = this
          _this.newOptions = _this.options
          _this.init(_this.newOptions)
        },
        deep:true
      }
    },
    created() {
      let _this = this
      _this.init(_this.options)
    },
    methods: {
      // 初始化
      init(options) {
        let _this = this
        console.log('初始化---',_this.colorGroup)
        if(JSON.stringify(options) == "{}"){
          _this.restore()
        }else{
            if(options.choose == 'noauto_two') {
                _this.colorGroup = _this.translateArray(options.colorGroup)
            } else {
                _this.colorGroup = options.colorGroup
            }
          _this.cart = options.cart
          _this.goods = options.goods
          _this.choose = options.choose
          _this.dot_isshow = options.dot_isshow
          _this.dot_title = options.dot_title
          _this.span_isshow = options.span_isshow
          _this.shadow_isshow = options.shadow_isshow
          _this.dotIcon_isshow = options.dotIcon_isshow
          _this.dotIcon_color = options.dotIcon_color
          _this.dot_type = options.dot_type
          _this.dot_position = options.dot_position
          _this.dot_color = options.dot_color
        }
      },
      restore(){
        let _this = this
        _this.cart = 'cart_show'
        _this.choose = 'noauto_one'
        _this.dot_isshow = 'dot_show'
        _this.goods = ['goods_title','goods_price','goods_subtitle']
        _this.colorGroup = []
        _this.dot_title = '轮播标题'
        _this.span_isshow = 'span_hide'
        _this.shadow_isshow = 'shadow_hide'
        _this.dotIcon_isshow = "dotIcon_hide"
        _this.dotIcon_color = '#000'
        _this.dot_type = 'dot_circle'
        _this.dot_position = 'dot_inside'
        _this.dot_color = '#000'
      },
        // 更换banner
      changeSwiper(oldvalue, value) {
        let _this = this;
        _this.currentId = value;
      },
      translateArray (array) {
        var res = [];
        for (var index = 0; index < array.length; index += 2) {
            if(array[index + 1]) {
                res.push([array[index], array[index + 1]]);
            } else {
                res.push([array[index]])
            }
        }
        console.log(res)
        return res
      }
    }
  }

</script>
