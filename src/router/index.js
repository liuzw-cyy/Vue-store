import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用router插件
Vue.use(VueRouter)

// 引入路由插件
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Search from '@/pages/Search'
import Register from '@/pages/Register'

// 配置路由
export default new VueRouter({
    // 配置路由
    routes: [
        {
            path: "/home",
            name:'Home',
            component: Home,
            meta: {
                showFooter:true
            }
        },
        {
            path: "/login",
            name:'Login',
            component: Login,
            meta: {
                showFooter:false
            }
        },
        {
            path: "/search",
            name:'Search',
            component: Search,
            meta: {
                showFooter:true
            }
        },
        {
            path: "/register",
            name:'Register',
            component: Register,
            meta: {
                showFooter:false
            }
        },
        // 重定向，项目初始定位到home
        {
            path: '/',
            redirect:'/home'
        }
    ]
})