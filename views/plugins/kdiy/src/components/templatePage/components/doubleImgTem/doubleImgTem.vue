<style lang="less" scoped>
@import "./doubleImgTem.less";
</style>

<template>
  <div class="imgContent diyitem" :style="{ background: options.backColor }">
    <div class="imgGroup" v-for="(item,index) in options.colorGroup" :key="index" :style="imgGroupStyle">
      <img v-if="item.adImg" :src="item.adImg" alt>
      <img v-else src="../../static/img/default_onegoods.jpg" alt>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  computed: {
    imgGroupStyle () {
      const options = this.options;
      return {
        width: 100 / options.girdnum + '%',
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
