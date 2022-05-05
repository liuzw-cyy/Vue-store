<template>
    <div>
    <TypeNav/>
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <!-- 面包屑结构 -->
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryname" >{{searchParams.categoryname}}<i @click="removeCategoryname">×</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword" >{{searchParams.keyword}}<i @click="removeKeyword">×</i></li>
            <!-- 品牌面的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark" >{{searchParams.trademark.split(":")[1]}}<i @click="removeTrademark">×</i></li>
            <!-- 平台售卖属性的面包屑 -->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index" >{{attrValue.split(":")[1]}}<i @click="removeAttr(index)">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click="changeOrder('1')">
                  <a href="#">综合<span v-show="isOne" class="iconfont" :class="{'icon-up':isUp,'icon-todown':isDown}"></span></a>
                </li>
                <li :class="{active:isTwo}" @click="changeOrder('2')">
                  <a href="#">价格<span v-show="isTwo" class="iconfont" :class="{'icon-up':isUp,'icon-todown':isDown}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id" >
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to=" `/detail/${good.id}` " target="_self"><img :src="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{good.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Pagination
          :pageNo="searchParams.pageNo"
          :pageSize="searchParams.pageSize"
          :totalPage="total"
          :continues="5"
          @getPageNo="getPageNo"/>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
    import SearchSelector from './SearchSelector/SearchSelector'
    import {mapGetters, mapState} from 'vuex'

    export default {
        name: 'Search',
        components: {
            SearchSelector
        },
        data() {
          // 带给服务器的数据
            return {
                searchParams:{
                    // 一级分类ID
                    category1id:"",
                    // 二级分类ID
                    category2id:"",
                    // 三级分类ID
                    category3id: "",
                    // 分类名字
                    categoryname: "",
                    // 关键字
                    keyword: "",
                    // 排序
                    order: "1:desc",
                    // 当前页数
                    pageNo: 1,
                    // 展示数据个数
                    pageSize: 10,
                    // 平台售卖属性参数
                    props: [],
                    trademark: ""
                }
            }
        },
        beforeMount() {
            // 合并对象
            Object.assign(this.searchParams, this.$route.query, this.$route.params)
        },
        mounted() {
            this.getData()
        },
        computed:{
            ...mapGetters(['goodsList']),
            // 判断order参数渲染界面
            isOne(){
                return this.searchParams.order.indexOf('1') != -1
            },
            isTwo(){
                return this.searchParams.order.indexOf('2') != -1
            },
            // 判断箭头方向
            isUp(){
                return this.searchParams.order.indexOf('asc') != -1
            },
            isDown(){
                return this.searchParams.order.indexOf('desc') != -1
            },
            ...mapState({
                total:(state) => state.search.searchList.total
            })
        },
        methods: {
          getData(){
              this.$store.dispatch('getSearchList', this.searchParams)
          },
          removeCategoryname(){
              this.searchParams.categoryname = undefined
              // 删除面包屑之后将所有的id置空再请求服务器数据
              // 将参数变为undefined则当前参数不会带给服务器以优化性能(下面同理)
              this.searchParams.category1id = undefined
              this.searchParams.category2id = undefined
              this.searchParams.category3id = undefined
              this.getData()
              // 修改地址栏（路由跳转）
              if(this.$route.params) {
                  this.$router.push({
                    name:"Search",
                    params:this.$route.params
                  })
              }
          },
          removeKeyword(){
              this.searchParams.keyword = undefined
              this.getData()
              // 通知Header删除keyword
              this.$bus.$emit("clear")
              // 修改地址栏
              if(this.$route.query) {
                this.$router.push({
                  name:"Search",
                  query:this.$route.query
                })
              }
          },
          // 自定义事件回调
          trademarkInfo(trademark){
              // 整理参数
              this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
              this.getData()

          },
          // 删除品牌面包屑
          removeTrademark(){
              this.searchParams.trademark = undefined
              this.getData()
          },
          // 平台售卖属性自定义事件
          attrInfo(attr, attrValue){
              //整理参数格式--["属性ID：属性值：属性名"]
              let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
              // 数组去重
              if(this.searchParams.props.indexOf(props) == -1) {
                  this.searchParams.props.push(props)
                  this.getData()
              }

          },
          // 删除平台售卖属性面包屑
          removeAttr(index){
              this.searchParams.props.splice(index, 1)
              this.getData()
          },
          // 排序操作
          changeOrder(flag){
              let originOrder = this.searchParams.order
              // 获取最开始的状态
              let originFlag = this.searchParams.order.split(":")[0]
              let originSort = this.searchParams.order.split(":")[1]
              // 准备一个新的order属性值
              let newOrder = ""
              if(flag == originFlag) {
                  newOrder = `${originFlag}:${originSort == 'desc' ? 'asc' : 'desc'}`
              } else {
                  newOrder = `${flag}:${'desc'}`
              }
              // 更新searchParams参数
              this.searchParams.order = newOrder
              this.getData()
          },
          // 获取当前第几页
          getPageNo(pageNo){
              // 整理参数，请求服务器数据
              this.searchParams.pageNo = pageNo
              this.getData()
          }
        },
        watch:{
            // 监听路由信息是否发生变化，如变化再次发起请求
            $route(newValue, oldValue){
                // 再次发起请求之前整理带给服务器的参数
                Object.assign(this.searchParams, this.$route.query, this.$route.params)
                // 再次发起ajax请求
                this.getData()
                // 每一次请求完毕，把分级ID置空，方便其接收下一次相应的ID
                this.searchParams.category1id = undefined
                this.searchParams.category2id = undefined
                this.searchParams.category3id = undefined
            }
        }
    }
</script>

<style lang="less" scoped>
    .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    }
</style>