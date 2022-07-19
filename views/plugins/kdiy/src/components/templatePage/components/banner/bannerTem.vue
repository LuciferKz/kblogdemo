<style lang="less" scoped>
@import "./bannerTem.less";
</style>

<template>
  <div class="banner diyitem" :style="bannerStyle">
    <div class="titleShow">{{ options.dot_title || '轮播标题' }}</div>
    <div class="carousel">
      <div class="carousel-item" :style="carouselItemStyle" v-for="(item, index) in options.colorGroup" :key="index">
        <div :style="carouselImageStyle">
          <img v-if="item.adImg" :src="item.adImg"  alt>
          <img v-else src="../../static/img/default_onegoods.jpg" alt>
        </div>
      </div>
      <div class="dots" v-if="options.dot_isshow == 'dot_show'">
        <div
          class="dot-item"
          v-for="(item, index) in options.colorGroup"
          :class="[options.dot_type]"
          :style="dotItemStyle(index)"
          :key="index"
        ></div>
      </div>
      <div class="iconDot" v-if="options.dotIcon_isshow == 'dotIcon_show'">
        <span class="icon iconfont icon-right icon-right-show el-icon-arrow-right" :style="{color: options.dotIcon_color}"></span>
        <span class="icon iconfont icon-left icon-left-show el-icon-arrow-left" :style="{color: options.dotIcon_color}"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  computed: {
    bannerStyle () {
      const options = this.options;
      return { minHeight: options.dot_position == 'dot_inside' ? '210px' : '240px' }
    },
    carouseClass () {
      const options = this.options;
      return options.dot_title ? 'showTitle' : '';
    },
    carouselItemStyle () {
      const options = this.options;
      return { width: options.span_isshow === 'span_show' ? '330px' : '371px' };
    },
    carouselImageStyle () {
      const options = this.options;
      return {
        margin: options.span_isshow === 'span_show' ? '0px 20px' : '0px 0px',
        boxShadow: options.shadow_isshow === 'shadow_show' ? '0px 0px 10px #ccc' : ''
      }
    },
    dotItemStyle () {
      const options = this.options;
      return function (index) {
        return {
          background: index == 0 ? options.dot_color : 'rgba(0,0,0,0.2)',
          margin:'0px 6px'
        }
      }
    }
  }
};
</script>
