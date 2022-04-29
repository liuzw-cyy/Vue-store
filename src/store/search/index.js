// search模块的store
import {reqGetSearchInfo} from '@/api/index'
const actions = {
    // 获取search模块数据
    async getSearchList({ commit }, params={}) {
        // params形参:当用户派发action时由第二个参数传递而来，至少是一个空对象
        let result = await reqGetSearchInfo(params)
        if (result.code == 200) {
            commit('GETSEARCHINFO', result.data)
        }
    }
};
const mutations = {
    GETSEARCHINFO(state, searchList) {
        state.searchList = searchList
    }
};
const state = {
    searchList:{}
};
const getters = {
    // 简化仓库数据
    attrsList(state) {
        return state.searchList.attrsList || []
    },
    goodsList(state) {
        return state.searchList.goodsList || []
    },
    trademarkList(state) {
        return state.searchList.trademarkList || []
    }

};

export default {
    actions,
    mutations,
    state,
    getters
}