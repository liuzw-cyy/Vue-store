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

// 获取模拟验证码 /api/user/passport/sendCode/{phone} get
export const reqGetCode = (phone) => {
    return requests({
        url: `/user/passport/sendCode/${phone}`,
        method:'get'
    })
}

// 用户注册 /api/user/passport/register  method:post 参数：phone code password
export const reqUserRegister = (data) => {
    return requests({
        url: '/user/passport/register',
        method: 'post',
        data
    })
};

// 用户登录 /api/user/passport/login  method:post  参数：phone password
export const reqUserLogin = (data) => {
    return requests({
        url: '/user/passport/login',
        method: 'post',
        data
    })
};

// 获取用户信息（需要token）
// /api/user/passport/auth/getUserInfo  method:get
export const reqUserInfo = () => {
    return requests({
        url: '/user/passport/auth/getUserInfo',
        method:'get'
    })
};

// 退出登录 /api/user/passport/logout  method:get
export const reqLogout = () => {
    return requests({
        url: '/user/passport/logout',
        method:'get'
    })
};

// 获取用户付款地址信息
// /api/user/userAddress/auth/findUserAddressList method:get
export const reqAddressInfo = () => {
    return requests({
        url: '/user/userAddress/auth/findUserAddressList',
        method:'get'
    })
};

// 获取商品清单 /api/order/auth/trade method；get
export const reqOrderInfo = () => {
    return requests({
        url: '/order/auth/trade',
        method:'get'
    })
};

// 提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo} method:post
export const reqSubmitOrder = (tradeNo, data) => {
    return requests({
        url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
        data,
        method:'post'
    })
};

// 获取支付信息 /api/payment/weixin/createNative/{orderId}  method:get
export const reqPayInfo = (orderId) => {
    return requests({
        url: `/payment/weixin/createNative/${orderId}`,
        method:'get'
    })
};

// 查询支付订单状态
// /api/payment/weixin/queryPayStatus/{orderId} method:get
export const reqPayStatus = (orderId) => {
    return requests({
        url: `/payment/weixin/queryPayStatus/${orderId}`,
        method:'get'
    })
};

// 获取订单状态 /api/order/auth/{page}/{limit}  method:get
export const reqMyOrderList = (page, limit) => {
    return requests({
        url: `/order/auth/${page}/${limit}`,
        method:'get'
    })
}