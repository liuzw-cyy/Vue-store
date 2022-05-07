import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用router插件
Vue.use(VueRouter);

// 引入路由配置文件
import routes from './routes';
// 引入store
import store from '@/store';

// 重写push和replace方法解决使用路由编程式导航时控制台警告问题
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { });
    }
};

VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { });
    }
};

// 配置路由
let router = new VueRouter({
    // 配置路由（由于代码太多，将路由配置文件分离）
    routes,
    // 路由滚动行为
    scrollBehavior(to, from, savePosition) {
        // 返回y的高度，为0代表滚动条在最上方
        return { y: 0 };
    }
});

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
    let token = store.state.user.token;
    let name = store.state.user.userInfo.name;
    // token存在表示已登录，全局放行
    if (token) {
        // 登录之后不允许前往登录界面
        if (to.path == '/login') {
            next('/home');
        } else {
            // store中的token通过localStorage获取，token有存放在本地
            // 当页面刷新时token不会消失但是store里面其余数据会清空
            // 不仅要判断token， 还要判断用户信息

            if (name) {
                next();
            } else {
                // 如果没有用户信息，请求服务器
                try {
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    // 请求失败（token过期），清除前后端token，跳转到登录界面
                    await store.dispatch('logout');
                    next('/login');
                }
            }
        }
    } else {
        // 未登录，部分页面可以正常防伪
        let toPath = to.path;
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1 || toPath.indexOf('/shopcart') != -1) {
            //把未登录的时候向去而没有去成的信息，使用query参数存储于地址栏中[由路由传递]
            next('/login?redirect=' + toPath);
        } else {
            next();
        }
    }
});

export default router;