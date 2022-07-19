<style lang="less" scoped>
@import "./videoTem.less";
</style>

<template>
  <div class="video diyitem">
    <div class="videoContent" :style="videoContentStyle">
      <div v-if="options.video_link" class="videoImg">
        <video :poster="options.video_img" :src="options.video_link" style="width:100%; height:100%;"></video>
      </div>
      <div v-else>
        <img class="videoImg" src="../../assets/images/default_video.png" alt="">
      </div>
      <img class="videoplay" src="../../assets/images/video_play.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  computed: {
    videoContentStyle () {
      const options = this.options;
      return {
        height: {'1': '211px', '2': '281px', '3': '375px' }[options.video_style]
      }
    }
  }
};
</script>
