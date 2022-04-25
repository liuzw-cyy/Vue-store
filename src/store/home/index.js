import { reqCategoryList, reqGetBannerList, reqGetFloorList } from '@/api/index'
// home模块的store
const actions = {
    // 通过API里面的接口函数调用，向服务器发请求拿到数据
    async categoryList({ commit }) {
        let result = await reqCategoryList()
        if (result.code === 200) {
            commit('CATEGORYLIST', result.data)
        }
    },

    // 获取首页轮播图数据
    async getBannerList({commit}) {
        let result = await reqGetBannerList()
        if (result.code == 200) {
            commit('GETBANNERLIST', result.data)
        }
    },

    // 获取floor数据
    async getFloorList({ commit }) {
        let result = await reqGetFloorList()
        if (result.code == 200) {
            commit('GETFLOORLIST', result.data)
        }
    }
};
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList
    }
};
const state = {
    categoryList: [],
    bannerList: [],
    floorList: []


};
const getters = {};

export default {
    actions,
    mutations,
    state,
    getters
}