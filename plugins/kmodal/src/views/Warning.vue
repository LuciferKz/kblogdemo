<template>
  <div>
    <button class="kmodal-test-btn" type="button" @click="showModal()">警告窗口</button>
  </div>
</template>
<script>
  export default {
    name: 'Warning',
    data () {
      return {
      }
    },
    methods: {
      showModal: function (type) {
        this.$kmodal.show({
          title: '警告窗口',
          message: 'kmodal 固定文字内容',
          type: 'warning', 
          duration: 300 
        }).then((res) => {
          console.log('警告窗口关闭后异步回调', res);
        })
      }
    },
  }
</script>
