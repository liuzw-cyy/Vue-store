<template>
    <div class="outer">
        <!-- 头部 -->
        <header class="header">
            <!-- 头部的第一行 -->
            <div class="top">
                <div class="container">
                    <div class="loginList">
                        <p>京东欢迎您！</p>
                        <!-- 未登录时显示 -->
                        <p v-if="!userName">
                            <span>请</span>
                            <router-link to="/login">登录</router-link>
                            <router-link to="/register" class="register">免费注册</router-link>
                        </p>
                        <!-- 已登录时显示 -->
                        <p v-else>
                            <a href="">{{userName}}</a>
                            <a herf="" class="register" @click="logout">退出登录</a>
                        </p>
                    </div>
                    <div class="typeList">
                        <router-link to="/center">我的订单</router-link>
                        <router-link to="/shopcart">我的购物车</router-link>
                        <a href="###">我的京东</a>
                        <a href="###">京东会员</a>
                        <a href="###">企业采购</a>
                        <a href="###">客户服务</a>
                        <a href="###">合作招商</a>
                        <a href="###">商家后台</a>
                    </div>
                </div>
            </div>
            <!--头部第二行 搜索区域-->
            <div class="bottom">
                <h1 class="logoArea">
                    <router-link class="logo" to="/home">
                        <img src="./images/logo.jpg" alt="">
                    </router-link >
                </h1>
                <div class="searchArea">
                    <form action="###" class="searchForm">
                        <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword"/>
                        <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
                    </form>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
import {mapState} from 'vuex'
    export default {
      name: 'Header',
      data() {
          return {
              keyword:''
          }
      },
      methods: {
          // 编程式路由导航传递参数
          goSearch(){
              let location = {
                      name:'Search',
                      params:{
                          keyword:this.keyword || undefined}
                  }
              //如果存在query参数，添加至location
              if(this.$route.query) {
                  location.query = this.$route.query
              }
              this.$router.push(location)
          },
          // 退出登录
          async logout(){
            // 1发请求通知服务器退出登录
            // 2清除项目当中的数据
            try {
                await this.$store.dispatch('userLogout')
                this.$router.push('/home')
            } catch (error) {
                alert(error.message)
            }
          },

      },
      // 通过全局事件总线清除关键字
      mounted() {
          this.$bus.$on("clear", () => {
              this.keyword = ''
          })
      },
      computed:{
          // 用户信息
          ...mapState({
              userName:(state) => {
                return state.user.userInfo.name
            }
          })
      }
    }
</script>

<style lang="less">
    .outer {
    .header {
        &>.top {
            background-color: #eaeaea;
            height: 30px;
            line-height: 30px;

            .container {
                width: 1200px;
                margin: 0 auto;
                overflow: hidden;

                .loginList {
                    float: left;

                    p {
                        float: left;
                        margin-right: 10px;

                        .register {
                            border-left: 1px solid #b3aeae;
                            padding: 0 5px;
                            margin-left: 5px;
                        }
                    }
                }

                .typeList {
                    float: right;

                    a {
                        padding: 0 10px;

                        &+a {
                            border-left: 1px solid #b3aeae;
                        }
                    }

                }

            }
        }

        &>.bottom {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .logoArea {
                float: left;

                .logo {
                    img {
                        width: 160px;
                        height: 56px;
                        margin: 15px 35px;
                    }
                }
            }

            .searchArea {
                float: right;
                margin-top: 35px;

                .searchForm {
                    overflow: hidden;

                    input {
                        box-sizing: border-box;
                        width: 490px;
                        height: 32px;
                        padding: 0px 4px;
                        border: 2px solid #ea4a36;
                        float: left;

                        &:focus {
                            outline: none;
                        }
                    }

                    button {
                        height: 32px;
                        width: 68px;
                        background-color: #ea4a36;
                        border: none;
                        color: #fff;
                        float: left;
                        cursor: pointer;

                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
        }
    }
    }
</style>