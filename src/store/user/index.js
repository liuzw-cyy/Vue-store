// 登录注册模块的store
import {reqGetCode, reqUserRegister } from '@/api/index'
const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        // 模拟验证码获取接口
        let result = await reqGetCode(phone)
        if (result.code == 200) {
            commit('GETCODE', result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 用户注册
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
};
const mutations = {
    GETCODE(state, code) {
        state.code = code
    }
};
const state = {
    code:''
};
const getters = {

};

export default {
    actions,
    mutations,
    state,
    getters
}