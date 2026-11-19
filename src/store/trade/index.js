// trade模块的store
import { reqAddressInfo, reqOrderInfo } from "@/api/index";
const actions = {
    // 获取用户地址信息
    async getUserAddress({ commit }) {
        let result
        try {
            result = await reqAddressInfo()
        } catch (error) {
            return Promise.reject(new Error('收货地址获取失败，请重试'))
        }
        if (result.code == 200) {
            commit('GETUSERADDRESS', result.data)
            return 'ok'
        }
        return Promise.reject(new Error('收货地址获取失败，请重试'))
    },
    // 获取商品清单
    async getOrderInfo({ commit }) {
        let result
        try {
            result = await reqOrderInfo()
        } catch (error) {
            return Promise.reject(new Error('订单确认信息获取失败，请重试'))
        }
        if (result.code == 200) {
            commit('GETORDERINFO', result.data)
            return 'ok'
        }
        return Promise.reject(new Error('订单确认信息获取失败，请重试'))
    }
};
const mutations = {
    GETUSERADDRESS(state, address) {
        state.address = address
    },
    GETORDERINFO(state, orderInfo) {
        state.orderInfo = orderInfo
    }
};
const state = {
    address: [],
    orderInfo:{}
};
const getters = {

};

export default {
    actions,
    mutations,
    state,
    getters
}