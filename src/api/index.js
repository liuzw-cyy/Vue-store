// 对API进行统一管理
import requests from './request'
import mockRequests from './mockRequest'

// 三级联动接口
// ‘/api/product/getBaseCategoryList’ get 无参数
// axios发请求返回Promise对象
export const reqCategoryList = () => {
    return requests({
        url: '/product/getBaseCategoryList',
        methods: 'get'
    })
}

// 获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => {
    return mockRequests({
        url: '/banners',
        methods: 'get'
    })
}

// 获取floor数据
export const reqGetFloorList = () => {
    return mockRequests({
        url: '/floors',
        methods:'get'
    })
}