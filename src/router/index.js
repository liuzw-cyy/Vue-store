import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用router插件
Vue.use(VueRouter)

// 引入路由配置文件
import routes from './routes'

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
    // 配置路由（由于代码太多，将路由配置文件分离）
    routes,
    // 路由滚动行为
    scrollBehavior(to, from, savePosition) {
        // 返回y的高度，为0代表滚动条在最上方
        return {y:0}
    }
})