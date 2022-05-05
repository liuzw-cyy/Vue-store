<template>
    <div>
        <!-- TypeNav已经是全局组件，无需引入 -->
        <TypeNav/>
        <ListContainear/>
        <TodayRecommend/>
        <Rank/>
        <Like/>
        <Floor v-for="floor in floorList" :key="floor.id" :list="floor"/>
        <Brand/>
    </div>
</template>

<script>
import ListContainear from './ListContainer'
import TodayRecommend from './TodayRecommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
import Brand from './Brand'
import {mapState} from 'vuex'
    export default {
        name:'Home',
        components:{
            ListContainear,
            TodayRecommend,
            Rank,
            Like,
            Floor,
            Brand
        },
        mounted() {
            this.$store.dispatch('getFloorList')
            // 获取用户信息在首页进行展示
            this.$store.dispatch('getUserInfo')
        },
        computed:{
            ...mapState({floorList:(state) => {
                return state.home.floorList
            }}),
        }
    }
</script>

<style lang="less" scoped>

</style>

