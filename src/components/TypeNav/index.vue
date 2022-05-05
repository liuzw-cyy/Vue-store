<template>
    <div class="type-nav">
            <div class="container">
                <div @mouseleave="leaveIndex">
                    <h2 class="all" @mouseenter="enterShow">全部商品分类</h2>
                    <!-- 三级联动 -->
                    <transition name="sort">
                        <!-- 过渡动画 -->
                        <div class="sort" v-show="show" @mouseleave="leaveShow">
                        <div class="all-sort-list2">
                            <div class="item"
                            v-for="(c1, index) in categoryList"
                            :key="c1.categoryId"
                            :class="{cur:currentIndex==index}">
                                <h3 @mouseenter="changeIndex(index)" @click="goSearch1(c1)">
                                    <a >{{c1.categoryName}}</a>
                                </h3>
                                <div class="item-list clearfix">
                                    <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a @click="goSearch2(c2)">{{c2.categoryName}}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                                    <a @click="goSearch3(c3)">{{c3.categoryName}}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </transition>
                </div>
                <nav class="nav">
                    <a href="###">服装城</a>
                    <a href="###">美妆馆</a>
                    <a href="###">尚品汇超市</a>
                    <a href="###">全球购</a>
                    <a href="###">闪购</a>
                    <a href="###">团购</a>
                    <a href="###">有趣</a>
                    <a href="###">秒杀</a>
                </nav>
            </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    // 防抖和节流(引入lodash，按需引入)
    import throttle from 'lodash/throttle'
    export default {
        name:'TypeNav',
        data() {
            return {
                currentIndex:-1,
                show:true
            }
        },
        // 组件挂载完毕：向服务器发请求
        mounted() {
            // 通知vuex发请求获取数据，存储在对应的仓库之中
            // 基于优化性能考虑，下面的网络请求代码可以放在APP组件中
            // this.$store.dispatch('categoryList')

            // 当路由跳转至Search模块时组件重新挂载并隐藏
            if(this.$route.path != '/home') {
                this.show = false
            }
        },
        computed:{
            // 拿到数据
            ...mapState({
                categoryList:(state) => {
                    return state.home.categoryList
            }
            })
        },
        methods: {
            // 节流操作
            changeIndex:throttle(function(index) {
                this.currentIndex = index
            }, 50),
            leaveIndex(){
                this.currentIndex = -1
            },
            // p27编程式路由出现bug，暂未完成，使用路由跳转完成
            goSearch1(c1){
                let categoryname = c1.categoryName
                let category1id = c1.categoryId

                // 准备路由跳转的参数
                let location = {name:'Search'}
                let query = {categoryname:categoryname, category1id:category1id}

                // 判断如果路由跳转时带有params参数，添加到location中
                if(this.$route.params) {
                    location.params = this.$route.params
                    //动态给location配置对象添加query属性
                    location.query = query
                    // 路由跳转
                    this.$router.push(location)
                }

            },
            goSearch2(c2){
                let categoryname = c2.categoryName
                let category2id = c2.categoryId

                let location = {name:'Search'}
                let query = {categoryname:categoryname, category2id:category2id}
                if(this.$route.params) {
                    location.params = this.$route.params
                    location.query = query
                    this.$router.push(location)
                }
            },
            goSearch3(c3){
                let categoryname = c3.categoryName
                let category3id = c3.categoryId

                let location = {name:'Search'}
                let query = {categoryname:categoryname, category3id :category3id }
                if(this.$route.params) {
                    location.params = this.$route.params
                    location.query = query
                    this.$router.push(location)
                }

            },

            // typeNav展示或者隐藏
            enterShow(){
                this.show = true
            },
            leaveShow(){
                // 判断是否处于search模块
                if (this.$route.path != '/home') {
                    this.show = false
                }
            }
        },

    }
</script>

<style lang="less" scoped>
    .type-nav {
        border-bottom: 2px solid #e1251b;

        .container {
            width: 1200px;
            margin: 0 auto;
            display: flex;
            position: relative;

            .all {
                width: 210px;
                height: 45px;
                background-color: #e1251b;
                line-height: 45px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
            }

            .nav {
                a {
                    height: 45px;
                    margin: 0 22px;
                    line-height: 45px;
                    font-size: 16px;
                    color: #333;
                }
            }

            .sort {
                position: absolute;
                left: 0;
                top: 45px;
                width: 210px;
                height: 461px;
                position: absolute;
                background: #fafafa;
                z-index: 999;

                .all-sort-list2 {
                    .item {
                        h3 {
                            line-height: 30px;
                            font-size: 14px;
                            font-weight: 400;
                            overflow: hidden;
                            padding: 0 20px;
                            margin: 0;

                            a {
                                color: #333;
                            }
                        }

                        .item-list {
                            display: none;
                            position: absolute;
                            width: 734px;
                            min-height: 460px;
                            background: #f7f7f7;
                            left: 210px;
                            border: 1px solid #ddd;
                            top: 0;
                            z-index: 9999 !important;

                            .subitem {
                                float: left;
                                width: 650px;
                                padding: 0 4px 0 8px;

                                dl {
                                    border-top: 1px solid #eee;
                                    padding: 6px 0;
                                    overflow: hidden;
                                    zoom: 1;

                                    &.fore {
                                        border-top: 0;
                                    }

                                    dt {
                                        float: left;
                                        width: 54px;
                                        line-height: 22px;
                                        text-align: right;
                                        padding: 3px 6px 0 0;
                                        font-weight: 700;
                                    }

                                    dd {
                                        float: left;
                                        width: 415px;
                                        padding: 3px 0 0;
                                        overflow: hidden;

                                        em {
                                            float: left;
                                            height: 14px;
                                            line-height: 14px;
                                            padding: 0 8px;
                                            margin-top: 5px;
                                            border-left: 1px solid #ccc;
                                        }
                                    }
                                }
                            }
                        }

                        &:hover {
                            .item-list {
                                display: block;
                            }
                        }
                    }
                    .cur {
                        background-color: skyblue;
                    }
                }
            }

            // 过渡动画的样式
            // 开始进入
            .sort-enter {
                height: 0px;
            }
            // 结束状态
            .sort-ento-to {
                height: 461px;
            }
            // 定义动画时间和速率
            .sort-enter-active {
                transition: all 0.3s linear;
            }
        }
    }
</style>