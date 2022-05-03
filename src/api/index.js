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

// 获取产品详情信息接口，地址/api/item/{skuId}, 请求方式get
export const reqGoodsInfo = (skuId) => {
    return requests({
        url: `/item/${skuId}`,
        method: 'get'
    })
}

// 将产品添加到购物车当中，地址/api/cart/addToCart/{skuId}/{skuNum} post
export const reqAddOrUpdateShopCart = (skuId, skuNum) => {
    return requests({
        url: `/cart/addToCart/${skuId}/${skuNum}`,
        method: 'post'
    })
}

// 获取购物车数据接口 地址/api/cart/cartList 请求方式get
export const reqCartList = () => {
    return requests({
        url: `/cart/cartList`,
        method:'get'
    })
}

// 删除购物车产品接口 地址/api/cart/deleteCart/{skuId}
export const reqDeleteCartById = (skuId) => {
    return requests({
        url: `/cart/deleteCart/${skuId}`,
        method:'delete'
    })

}

// 修改商品选中状态 /api/cart/checkCart/{skuId}/{ischecked}  method:get
export const reqUpdateCheckedById = (skuId, isChecked) => {
    return requests({
        url: `/cart/checkCart/${skuId}/${isChecked}`,
        method:'get'
    })
}