import vue from 'vue'
import VueRouter from 'vue-router'
import kmodal from './kmodal'
import App from './App'
import Info from './views/Info'
import Danger from './views/Danger'
import Warning from './views/Warning'
import Success from './views/Success'

vue.use(kmodal)
vue.use(VueRouter)

var routes = [
  {
    path: '/info',
    name: 'Info',
    component: Info
  },
  {
    path: '/danger',
    name: 'Danger',
    component: Danger
  },
  {
    path: '/warning',
    name: 'Warning',
    component: Warning
  },
  {
    path: '/success',
    name: 'Success',
    component: Success
  },
]

var router = new VueRouter({
  routes
})

new vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})