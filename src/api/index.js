// 对API进行统一管理
import requests from './request'
import mockRequests from './mockRequest'

// 三级联动接口
// ‘/api/product/getBaseCategoryList’ get 无参数
// axios发请求返回Promise对象
export const reqCategoryList = () => {
    return requests({
        url: '/product/getBaseCategoryList',
        method: 'get'
    })
}

// 获取banner（Home首页轮播图接口）
export const reqGetBannerList = () => {
    return mockRequests({
        url: '/banners',
        method: 'get'
    })
}

// 获取floor数据
export const reqGetFloorList = () => {
    return mockRequests({
        url: '/floors',
        method:'get'
    })
}

// 获取搜索模块数据，地址/api/list 请求方式post 需参数
// 此接口给服务器传递的默认参数至少是一个空对象
export const reqGetSearchInfo = (params) => {
    return requests({
        url: '/list',
        method: 'post',
        data:params
    })
}
