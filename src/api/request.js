// 对axios进行二次封装
import axios from 'axios'
// 引入进度条
import nprogress from 'nprogress'

// 创建一个axios实例
const requests = axios.create({
    // 配置对象
    // 基础路径，发起请求时路径中会出现api
    baseURL: "/api",
    timeout: 5000
})

// 请求拦截器
requests.interceptors.request.use((config) => {
    // 进度条开始
    nprogress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 进度条结束
    nprogress.done()
    return res.data
}, (error) => {
    // 响应失败的回调函数
    return Promise.reject(new Error('false'))
})

export default requests;