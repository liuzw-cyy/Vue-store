// 路由配置信息

// 引入路由插件
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Search from '@/pages/Search'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'

export default [
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
    {
        path: "/detail/:skuid",
        name:'Detail',
        component: Detail,
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