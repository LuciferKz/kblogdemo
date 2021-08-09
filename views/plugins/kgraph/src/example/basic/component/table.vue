<template>
  <div class="test-container">
    <ul class="test-ul">
        <li class="test-li" v-for="v in value">
          <span @mousedown = "handleMousedown" @mouseup = "handleMouseup(v)"></span>
          {{ v.a }}
        </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      value: Array
    },

    methods: {
      handleMousedown (e) {
        console.log(e)

      },

      handleMouseup (v) {
        this.$emit('connect', v)
      }
    }
  }
</script>
<style scoped>
  .test-container {
    height: 100%;
    padding: 5px 10px 5px 10px;
    box-sizing: border-box;
    background: #FFF;
    /* border: 1px solid #EEE; */
  }
  .test-content {
    overflow: auto;
    height: 100%;
  }


  .test-ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  .test-li {
    display: flex;
    height: 32px;
    line-height: 32px;
    cursor: auto;
    align-items: center;
  }

  .test-li span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #F00;
    margin-right: 10px;
  }

</style>