// shopcart模块的store
import { reqCartList, reqDeleteCartById, reqUpdateCheckedById, reqAddOrUpdateShopCart } from "@/api/index";

// 列表拉取序号：仅最新一次拉取允许写入 state，旧响应不覆盖新操作（异步竞态防护）
let fetchSeq = 0

const actions = {
    // 获取购物车列表数据
    async getCartList({ commit }) {
        const seq = ++fetchSeq
        let result
        try {
            result = await reqCartList()
        } catch (error) {
            return Promise.reject(new Error('购物车列表获取失败，请重试'))
        }
        // 已有更新的拉取发出，本次结果作废，不写入也不视为失败
        if (seq !== fetchSeq) {
            return 'stale'
        }
        if (result.code == 200) {
            commit('GETCARTLIST', result.data)
            return 'ok'
        }
        return Promise.reject(new Error('购物车列表获取失败，请重试'))
    },
    // 删除购物车的产品
    async deleteCartListBySkuId(context, skuId) {
        let result
        try {
            result = await reqDeleteCartById(skuId)
        } catch (error) {
            return Promise.reject(new Error('删除失败，请重试'))
        }
        if (result.code == 200) {
            return 'ok'
        }
        return Promise.reject(new Error('删除失败，请重试'))
    },
    // 修改购物车某一个产品选中状态
    async updateCheckedById(context, { skuId, isChecked }) {
        let result
        try {
            result = await reqUpdateCheckedById(skuId, isChecked)
        } catch (error) {
            return Promise.reject(new Error('勾选状态更新失败，请重试'))
        }
        if (result.code == 200) {
            return 'ok'
        }
        return Promise.reject(new Error('勾选状态更新失败，请重试'))
    },
    // 修改购物车商品数量（数量加减/输入，传给服务端的是增量）
    async updateSkuNum(context, { skuId, skuNum }) {
        let result
        try {
            result = await reqAddOrUpdateShopCart(skuId, skuNum)
        } catch (error) {
            return Promise.reject(new Error('数量修改失败，请重试'))
        }
        if (result.code == 200) {
            return 'ok'
        }
        return Promise.reject(new Error('数量修改失败，请重试'))
    },
    // 删除选中的商品：聚合全部子请求结果，部分失败可感知，全部结束后由页面重拉列表
    async deleteAllCheckedCart({ dispatch, getters }) {
        const checkedItems = (getters.cartList.cartInfoList || []).filter(item => item.isChecked == 1)
        const results = await Promise.all(checkedItems.map(item =>
            dispatch('deleteCartListBySkuId', item.skuId).then(() => true).catch(() => false)
        ))
        if (results.some(success => !success)) {
            return Promise.reject(new Error('部分商品删除失败，请重试'))
        }
        return 'ok'
    },
    // 修改全部产品状态：聚合全部子请求结果，存在失败时由页面提示部分更新失败
    async updateAllChecked({ dispatch, getters }, isChecked) {
        const targets = (getters.cartList.cartInfoList || []).map(item => ({ skuId: item.skuId, isChecked }))
        const results = await Promise.all(targets.map(target =>
            dispatch('updateCheckedById', target).then(() => true).catch(() => false)
        ))
        if (results.some(success => !success)) {
            return Promise.reject(new Error('部分商品勾选状态更新失败，请重试'))
        }
        return 'ok'
    }
}
const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList
    }
}
const state = {
    cartList:[]
}
const getters = {
    cartList(state) {
        return state.cartList[0] || {}
    }
}
export default {
    actions,
    mutations,
    state,
    getters
}
