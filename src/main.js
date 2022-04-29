import Vue from 'vue'
import App from './App.vue'

// 引入三级联动组件（全局组件）
import TypeNav from '@/components/TypeNav'
Vue.component('TypeNav', TypeNav)
// 引入轮播图全局组件
import Carousel from '@/components/Carousel'
Vue.component('Carousel', Carousel)

// 引入路由
import router from '@/router'

// 引入store
import store from '@/store'

// 引入mockServer.js模块
import '@/mock/mockServer'

// 引入swiper样式
import 'swiper/css/swiper.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 注册路由
  router,
  store,
  // 配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  devtools: true
}).$mount('#app')
