import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用router插件
Vue.use(VueRouter)

// 引入路由插件
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Search from '@/pages/Search'
import Register from '@/pages/Register'

// 重写push和replace方法解决使用路由编程式导航时控制台警告问题
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => {}, () => {})
    }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => {}, () => {})
    }
}

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
            // keyWords用于占位符声明接受params参数（在浏览器路径显示）
            path: "/search/:keyword?",
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