<style lang="less" scoped>
@import "./searchTem.less";
</style>

<template>
  <div class="search diyitem" :style="searchStyle">
    <div class="searchContent" :style="searchContentStyle">
      <i class="el-icon-search iconsearch" :style="{ color: options.search_icon }"></i>
      <div class="searchBorder" :style="searchBorderStyle">{{ searchTips }}</div>
    </div>
    <div class="search-key" v-if="options.key_show == '1'" :style="searchKeyStyle">
      <div class="search-item" v-for="(item,index) in searchKeys" :key="index">{{item}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  computed: {
    searchKeys () {
      const options = this.options;
      return options.search_key ? options.search_key.split(';') : ['新品', '热销'];
    },
    searchTips () {
      const options = this.options;
      return options.search_tips ? options.search_tips : '请输入关键字进行搜索'
    },
    searchContentStyle () {
      const options = this.options;
      return {
        border: '1px solid ' + options.search_border,
        background: options.search_img ? 'rgba(0,0,0,0)' : options.search_bg,
        borderRadius: { '1': '0px', '2': '6px', '3': '50px' }[options.search_style]
      }
    },
    searchStyle () {
      const options = this.options;
      return { 
        padding: options.udPadding + 'px ' + options.lrPadding + 'px',
        background: options.search_img ? 'url('+ options.search_img +')' : '#fff',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    },
    searchKeyStyle () {
      const options = this.options;
      return {
        justifyContent: { '1': 'flex-start', '2': 'center', '3': 'flex-end' }[options.search_keyalign]
      };
    },
    searchBorderStyle () {
      const options = this.options;
      return {
        color: options.textColor,
        textAlign: {'1': 'left', '2': 'center', '3': 'right'}[options.search_align],
        padding: { '1': '0px 0px 0px 30px', '2': '0px', '3': '0px 6px 0px 0px' }[options.search_align]
      }
    }
  },
};
</script>
