<template>
    <div>
        <!-- TypeNav已经是全局组件，无需引入 -->
        <TypeNav/>
        <ListContainear/>
        <TodayRecommend/>
        <Rank/>
        <Like/>
        <Floor/>
        <Floor/>
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
    export default {
        name:'Home',
        components:{
            ListContainear,
            TodayRecommend,
            Rank,
            Like,
            Floor,
            Brand
        }
    }
</script>

<style lang="less" scoped>

</style>

