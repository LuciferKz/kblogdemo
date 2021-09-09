import Vue from 'vue/dist/vue.esm.js';
import App from './App.vue'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element);

// console.log(Element)

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});