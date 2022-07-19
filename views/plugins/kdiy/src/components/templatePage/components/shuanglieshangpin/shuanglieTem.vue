<style lang="less" scoped>
  @import './shuanglieTem.less';

</style>

<template>
  <div class="shuanglieshangpin diyitem">
    <div class="shuang">
      <div class="sl-item" v-for="(item,index) in products" :key="index">
        <div class="d-img">
          <img v-if="item.firstImage" :src="item.firstImage" alt="">
          <img v-else src="../../static/img/default_onegoods.jpg" alt="">
        </div>
        <div class="d-detail">
            <div class="name line-hide" v-if="options.goods.includes('goods_title')">{{ item.title || '这里是商品标题' }}</div>
            <div class="subtitle line-hide" v-if="options.goods.includes('goods_subtitle')">
                {{item.subTitle || '这里是商品副标题'}}
            </div>
            <div style="display: flex;">
                <div style="flex: 1 1 0%;">
                    <div class="price">
                      <span class="text" v-if="options.goods.includes('goods_price')">￥<span>{{ item.price || '20.00' }}</span></span>
                      <span class="productprice" v-if="options.goods.includes('origin_price')">￥{{ item.originPrice || 0.00 }}</span>
                    </div>
                    <div class="sold" v-if="options.goods.includes('goods_sale')"><span>已售{{ item.isSales || 0 }}</span></div>
                </div> 
                <span class="icon-cart" v-if="options.cart == 'cart_show'">
                  <img class="icon-cart-img" src="../../static/img/cart.png" />
                </span>
                <!-- <span class="buy buybtn1" v-if="options.cart == 'cart_show'">购买</span> -->
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:['options'],
    data() {
      return {
        goods: ['goods_title','goods_price','goods_subtitle'],
        cart: 'cart_show',
        colorGroup: []
      }
    },
    computed: {
      products () {
        return this.options.colorGroup.length ? this.options.colorGroup : [{}];
      }
    }
  }

</script>
