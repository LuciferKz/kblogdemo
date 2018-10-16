<template>
  <div>
    <button class="kmodal-test-btn" type="button" @click="showModal()">默认窗口</button>
  </div>
</template>
<script>
  export default {
    name: 'Info',
    data () {
      return {
      }
    },
    methods: {
      showModal: function (type) {
        this.$kmodal.show({
          title: '默认窗口',
          message: 'kmodal 固定文字内容',
          type: 'info', 
          duration: 300 
        }).then((res) => {
          console.log('默认窗口关闭后异步回调', res);
        })
      }
    },
  }
</script>
