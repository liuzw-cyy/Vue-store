// shopcart模块的store
import { reqCartList, reqDeleteCartById, reqUpdateCheckedById} from "@/api/index";

const actions = {
    // 获取购物车列表数据
    async getCartList({ commit }) {
        let result = await reqCartList()
        if (result.code == 200) {
            commit('GETCARTLIST', result.data)
        }
    },
    // 删除购物车的产品
    async deleteCartListBySkuId({ commit }, skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 修改购物车某一个产品选中状态
    async updateCheckedById({ commit }, { skuId, isChecked }) {
        let result = await reqUpdateCheckedById(skuId, isChecked)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 删除选中的商品
    deleteAllCheckedCart({ dispatch, getters }) {
        let PromiseAll = []
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
            // 将每一次返回的Promise天际到数组之中
            PromiseAll.push(promise)
        })
        // 当所有返回的promise均成功时返回成功结果
        return Promise.all(PromiseAll)
    },
    // 修改全部产品状态
    updateAllChecked({ dispatch, state }, isChecked) {
        let PromiseAll = []
        state.cartList[0].cartInfoList.forEach(item => {
            let promise = dispatch('updateCheckedById', {
                skuId: item.skuId,
                isChecked
            })
            PromiseAll.push(promise)
        })
        return Promise.all(PromiseAll)
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
    // 计算出来的购物车数据

}
export default {
    actions,
    mutations,
    state,
    getters
}
