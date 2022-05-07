// 路由配置信息

export default [
    {
        path: "/home",
        name: 'Home',
        // 路由懒加载
        component: () => import('@/pages/Home'),
        meta: {
            showFooter:true
        }
    },
    {
        path: "/login",
        name:'Login',
        component: () => import('@/pages/Login'),
        meta: {
            showFooter:false
        }
    },
    {
        // keyWords用于占位符声明接受params参数（在浏览器路径显示）
        path: "/search/:keyword?",
        name:'Search',
        component: () => import('@/pages/Search'),
        meta: {
            showFooter:true
        }
    },
    {
        path: "/register",
        name:'Register',
        component: () => import('@/pages/Register'),
        meta: {
            showFooter:false
        }
    },
    {
        path: "/detail/:skuid",
        name:'Detail',
        component: () => import('@/pages/Detail'),
        meta: {
            showFooter:true
        }
    },
    {
        path: "/addcartsuccess",
        name:'AddCartSuccess',
        component: () => import('@/pages/AddCartSuccess'),
        meta: {
            showFooter:true
        }
    },
    {
        path: "/shopcart",
        name:'ShopCart',
        component: () => import('@/pages/ShopCart'),
        meta: {
            showFooter:true
        }
    },
    {
        path: "/trade",
        name:'Trade',
        component: () => import('@/pages/Trade'),
        meta: {
            showFooter:true
        },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/shopcart') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: "/pay",
        name:'Pay',
        component: () => import('@/pages/Pay'),
        meta: {
            showFooter:true
        },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: "/paysuccess",
        name:'PaySuccess',
        component: () => import('@/pages/PaySuccess'),
        meta: {
            showFooter:true
        }
    },
    {
        path: "/center",
        name:'Center',
        component: () => import('@/pages/Center'),
        meta: {
            showFooter:true
        }
    },
    // 重定向，项目初始定位到home
    {
        path: '/',
        redirect:'/home'
    }
]