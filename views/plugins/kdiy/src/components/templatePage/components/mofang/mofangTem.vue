<style lang="less" scoped>
@import "./mofangTem.less";
</style>

<template>
  <div class="mofang" ref="mofang">
    <div class="mofang-item" v-for="(item,index) in options.combineLists" :key="index" :style="mofangItemStyle(item)">
      <img v-if="item.imageUrl" class="mofang-item-img" :src="item.imageUrl" alt>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  computed: {
    mofangItemStyle () {
      return function (cell) {
        return {
          width:cell.width + 'px',
          height:cell.height + 'px',
          left:cell.left + 'px',
          top:cell.top + 'px'
        }
      }
    }
  }
};
</script>
