<style lang="less" scoped>
@import "./imgTem.less";
</style>

<template>
  <div class="imgContent diyitem" :style="{ background: options.backColor }">
    <div class="imgGroup" v-for="(item,index) in options.colorGroup" :key="index" :style="imageGroupStyle">
      <img v-if="item.adImg" :src="item.adImg" alt>
      <img v-else src="../../static/img/default_onegoods.jpg" alt>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  computed: {
    imageGroupStyle () {
      const options = this.options;
      return {
        boxSizing: 'border-box',
        paddingTop: options.udPadding+'px',
        paddingBottom: options.udPadding+'px',
        paddingLeft: options.lrPadding+'px',
        paddingRight: options.lrPadding+'px'
      }
    }
  }
};
</script>
