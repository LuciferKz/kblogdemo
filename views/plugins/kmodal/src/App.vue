<template>
  <div>
    <!-- <div class="kmodal-btns">
      <button type="button" v-for="btn in buttons" :key="btn.index" @click="showModal(btn.type)">{{ btn.text }}</button>
    </div> -->
    <div class="kmodal-links">
      <router-link v-for="link in links" :key="link.id" :to="{ path: link.path }">{{ link.text }}</router-link>
    </div>
    <k-modal ref="kmodal">
      <p>kmodal 自定义内容</p>
    </k-modal>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'App',
    data () {
      return {
        buttons: [
          { text: 'default', type: 'info' },
          { text: 'info', type: 'info' },
          { text: 'danger', type: 'danger' },
          { text: 'warning', type: 'warning' },
          { text: 'success', type: 'success' },
        ],
        links: [
          { text: 'info', path: 'info' },
          { text: 'danger', path: 'danger' },
          { text: 'warning', path: 'warning' },
          { text: 'success', path: 'success' },
        ],
      }
    },
    mounted () {
      this.$kmodal.init(this.$refs.kmodal)
    },
    methods: {
      showModal: function (type) {
        let titles = { info: '默认提示', danger: '错误提示', warning: '警告提示', success: '成功提示' };
        this.$kmodal.show({
          title: titles[type],
          message: 'kmodal 固定文字内容',
          type: type, 
          duration: 300 
        }).then((res) => {
          console.log('窗口关闭后异步回调', res);
        })
      }
    },
  }
</script>

<style lang="css">
.kmodal-btns {
  display: flex;
  width: 400px;
  height: 40px;
}
.kmodal-btns button {
  flex: 1;
}

.kmodal-links {
  display: flex;
  width: 400px;
  height: 40px;
  margin: 10px 0;
  border-top: 1px solid #DDD;
  border-right: 1px solid #DDD;
  border-bottom: 1px solid #DDD;
}

.kmodal-links a {
  flex: 1;
  text-decoration: none;
  color: #000;
  text-align: center;
  line-height: 40px;
  border-left: 1px solid #DDD;
}

.kmodal-links a:hover {
  background-color: #EEE;
}

.kmodal-test-btn {
  width: 400px;
  height: 40px;
  line-height: 34px;
  cursor: pointer;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 4px;
}
</style>
