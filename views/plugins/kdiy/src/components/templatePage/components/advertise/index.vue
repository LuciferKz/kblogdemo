<style lang="less" scoped>
  @import './index.less';
</style>

<template>
  <div :style="adverStyle">
    <div class="carousel">
      <div class="carousel-item" v-for="(item, index) in options.advertImages" :key="index">
        <div>
          <img v-if="item.imgAddress" :src="item.imgAddress"  alt>
        </div>
      </div>
      <div class="dots">
        <div
          class="dot-item"
          v-for="(item, index) in options.advertImages"
          :style="dotItemStyle(index)"
          :key="index"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['options'],
    
    computed: {
      adverStyle () {
        const options = this.options;
        return {
          width: '375px',
          height: '650px',
          background: options.advertBackground,
          borderTop: '1px solid #CCC',
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
  }

</script>

<style scoped>
</style>