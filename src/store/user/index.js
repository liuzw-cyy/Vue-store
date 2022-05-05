// 登录注册模块的store
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api/index';
import { setToken, removeToken } from "@/utils/token";

const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        // 模拟验证码获取接口
        let result = await reqGetCode(phone);
        if (result.code == 200) {
            commit('GETCODE', result.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户注册
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user);
        if (result.code == 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户登录
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data);
        // 服务器下发token（用户的唯一标识）
        if (result.code == 200) {
            commit('USERLOGIN', result.data.token)
            // 持久化存储token
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 获取用户信息
    async getUserInfo({ commit }, data) {
        let result = await reqUserInfo()
        if (result.code == 200) {
            commit('GETUSERINFO', result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 退出登录
    async userLogout({ commit }, data) {
        let result = await reqLogout()
        if (result.code == 200) {
            commit('USERLOGOUT')
            return 'ok'
        } else {
            return Promise.reject(new Error('f'))
        }
    }
};
const mutations = {
    GETCODE(state, code) {
        state.code = code;
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    // 清除本地的数据
    USERLOGOUT(state) {
        state.token = ''
        state.userInfo = {}
        // 清除本地存储Token
        removeToken()
    }
};
const state = {
    code: '',
    token: localStorage.getItem('TOKEN'),
    userInfo: {}
};
const getters = {

};

export default {
    actions,
    mutations,
    state,
    getters
};