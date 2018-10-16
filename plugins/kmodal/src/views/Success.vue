<template>
  <div>
    <button class="kmodal-test-btn" type="button" @click="showModal()">成功窗口</button>
  </div>
</template>
<script>
  export default {
    name: 'Success',
    data () {
      return {
      }
    },
    methods: {
      showModal: function (type) {
        this.$kmodal.show({
          title: '成功窗口',
          message: 'kmodal 固定文字内容',
          type: 'success', 
          duration: 300 
        }).then((res) => {
          console.log('成功窗口关闭后异步回调', res);
        })
      }
    },
  }
</script>
