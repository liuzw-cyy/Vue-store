// detail模块的store

import { reqGoodsInfo, reqAddOrUpdateShopCart } from '@/api'
// 封装游客身份模块uuid
import { getUUID } from '@/utils/uuid_token'

const actions = {
    // 获取产品详情
    async getGoodInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    // 将产品添加到购物车当中(无返回数据)
    async addAddOrUpdateShopCart({commit}, {skuId, skuNum}) {
        let result = await reqAddOrUpdateShopCart (skuId, skuNum)
        if (result.code == 200) {
            return 'success'
        } else {
            // 加入购物车失败
            return Promise.reject(new Error('faile'))
        }
    },
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const state = {
    goodInfo: {},
    uuid_token: getUUID()
}
const getters = {
    categoryView(state) {
        // 当没有数据时返回{}便面报错
        return state.goodInfo.categoryView || {}
    },
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    spuSaleAttrList() {
        return state.goodInfo.spuSaleAttrList || []
    }
}
export default {
    actions,
    mutations,
    state,
    getters
}
