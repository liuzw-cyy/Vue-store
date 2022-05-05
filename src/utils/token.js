// 本地存储Token
export const setToken = (token) => {
    localStorage.setItem('TOKEN', token)
};

// 清除本地存储Token
export const removeToken = () => {
    localStorage.removeItem('TOKEN')
}