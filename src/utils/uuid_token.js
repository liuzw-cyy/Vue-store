import { v4 as uuidv4 } from 'uuid'
// 生成随机字符串表示游客身份id，且持久存储
export const getUUID = () => {
    // 检查本地存储中是否存在ID
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    if (!uuid_token) {
        // 生成游客临时身份
        uuid_token = uuidv4()
        localStorage.setItem('UUIDTOKEN', uuid_token)
    }
    return uuid_token
}