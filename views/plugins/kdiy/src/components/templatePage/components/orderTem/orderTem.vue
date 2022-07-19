<style lang="less" scoped>
@import "./orderTem.less";
</style>

<template>
  <div class="order diyitem">
    <div class="order-title">订单中心</div>
    <div class="order-group" :style="{background: options.order_bg}">
      <div class="order-item" v-for="(item,index) in options.colorGroup" :key="index">
        <div class="iconImg">
          <div class="badge" :style="{background: options.order_badgecolor,color: options.order_textcolor}">1</div>
          <span :class="['icon iconfont', item.adImg]" :style="{color: options.order_iconcolor,fontSize:'20px'}"></span>
        </div>
        <div class="iconText" :style="{color: options.order_textcolor}">{{item.adText}}</div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: ["options"],
};
</script>
