import Vue from 'vue'
import App from './App.vue'

// 引入三级联动组件（全局组件）
import TypeNav from '@/components/TypeNav'
Vue.component('TypeNav', TypeNav)
// 引入轮播图全局组件
import Carousel from '@/components/Carousel'
Vue.component('Carousel', Carousel)
// 引入分页器全局组件
import Pagination from '@/components/Pagination'
Vue.component('Pagination', Pagination)

// 引入路由
import router from '@/router'

// 引入store
import store from '@/store'

// 引入mockServer.js模块
import '@/mock/mockServer'

// 引入swiper样式
import 'swiper/css/swiper.css'

// 统一接口api文件里面的所有请求函数 统一引入
import * as API from '@/api'

// 懒加载
import VueLazyload from 'vue-lazyload'
import load from '@/assets/load.gif'
Vue.use(VueLazyload, {
  loading: load
})

// 引入表单验证插件
import '@/plugins/validate'

import { Button, MessageBox } from 'element-ui';
Vue.component(Button.name, Button);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 注册路由
  router,
  store,
  // 配置全局事件总线
  beforeCreate() {
    Vue.prototype.$API = API;
    Vue.prototype.$bus = this;
  },
  devtools: true
}).$mount('#app')
