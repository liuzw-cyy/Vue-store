// 利用mockjs模拟数据接口
import Mock from 'mockjs'
import banners from './banners.json'
import floors from './floors.json'

// 提供轮播数据接口
Mock.mock('/mock/banners', {
    code: 200,
    data:banners
})

// 提供floor数据接口
Mock.mock('/mock/floors', {
    code: 200,
    data:floors
})