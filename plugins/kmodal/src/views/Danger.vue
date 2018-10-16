<template>
  <div>
    <button class="kmodal-test-btn" type="button" @click="showModal()">失败窗口</button>
  </div>
</template>
<script>
  export default {
    name: 'Danger',
    data () {
      return {
      }
    },
    methods: {
      showModal: function (type) {
        this.$kmodal.show({
          title: '失败窗口',
          message: 'kmodal 固定文字内容',
          type: 'danger', 
          duration: 300 
        }).then((res) => {
          console.log('失败窗口关闭后异步回调', res);
        })
      }
    },
  }
</script>
