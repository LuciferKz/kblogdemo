<style lang="less" scoped>
@import "./listTem.less";
</style>

<template>
  <div class="list diyitem">
    <div class="list-group">
      <div class="list-item" v-for="(item,index) in options.colorGroup" :key="index">
        <div class="iconImg">
          <span v-if="String(item.adImg).indexOf('http') == -1" :class="['icon iconfont colorIcon',item.adImg]" :style="{ fontSize:'20px' }" :src="item.adImg"></span>
          <img v-else class="colorIcon" style="width:20px;"  :src="item.adImg" alt>
        </div>
        <div class="iconText">{{ item.adText }}<span class="remark">{{ item.adRemark }}</span></div>
        <span class="el-icon-arrow-right"></span>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: ["options"],
};
</script>
