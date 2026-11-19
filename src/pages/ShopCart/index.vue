<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <div class="cart-state" v-if="listLoading">正在获取购物车…</div>
        <div class="cart-state" v-else-if="listError">
          {{ listError }}
          <a href="javascript:void(0)" @click="fetchInitialList">重试</a>
        </div>
        <div class="cart-state" v-else-if="cartInfoList.length === 0">购物车还是空的，快去挑选心仪的商品吧</div>
        <template v-else>
          <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked==1" :disabled="updating"
            :ref="'chk_' + cart.skuId" :aria-label="'选择 ' + cart.skuName" @change="updateChecked(cart, $event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" :alt="cart.skuName">
            <div class="item-msg">{{cart.skuName}}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{cart.skuPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('minus', -1, cart)">-</a>
            <input autocomplete="off" type="text" :value="cart.skuNum" minnum="1" class="itxt"
            @change="handler('change', $event.target.value*1, cart, $event.target)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', +1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{subtotal(cart)}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="javascript:void(0)" class="sindelet" @click="deleteCartbyId(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
          </ul>
        </template>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllCheck" :disabled="updating" ref="chooseAll" aria-label="全选" @change="updateAllChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:void(0)" :class="{disabled: !canBatchDelete}" :aria-disabled="!canBatchDelete"
        @click="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{selectedCount}}</span>件商品</div>
        <div class="sumprice">
          <em>总价：¥{{totalPrice}}</em>
        </div>
        <div class="sumbtn">
          <a href="javascript:void(0)" class="sum-btn" :class="{disabled: !canSettle}" :aria-disabled="!canSettle"
          @click="goSettle">结算</a>
          <span class="settle-tip" v-show="showSettleTip">请先勾选商品</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 防抖和节流(引入lodash，按需引入)
import throttle from 'lodash/throttle'
// 汇总与勾选集合口径统一来自 cartCalc，页面展示与结算校验共用同一份选中集合
import { filterSelected, countSelected, amountInCents, formatYuan, isAllChecked } from '@/utils/cartCalc'

  export default {
    name: 'ShopCart',
    data() {
      return {
        // 任一变更操作进行期间为 true：禁用全部变更入口，避免重复提交
        updating: false,
        listLoading: false,
        listError: ''
      }
    },
    mounted() {
      this.fetchInitialList()
    },
    methods: {
      // 首次进入与手动重试：此时无数据可展示，需要显式加载/错误态
      async fetchInitialList() {
        this.listLoading = true
        this.listError = ''
        try {
          await this.$store.dispatch('getCartList')
        } catch (error) {
          this.listError = error.message || '购物车列表获取失败，请重试'
        } finally {
          this.listLoading = false
        }
      },
      // 操作成功或失败后都重拉服务端列表纠正页面，不沿用本地汇总
      async reloadList() {
        try {
          await this.$store.dispatch('getCartList')
          this.listError = ''
        } catch (error) {
          // 已有展示数据时不重复弹窗（操作失败已提示），仅无数据时降级为列表错误态
          if (this.cartInfoList.length === 0) {
            this.listError = error.message || '购物车列表获取失败，请重试'
          }
        }
        // 用户点击会直接改写勾选框 DOM，而数据未变时 Vue diff 不会回写，需按服务端状态强制纠正一次
        this.$nextTick(() => {
          this.cartInfoList.forEach(item => {
            const box = this.$refs['chk_' + item.skuId]
            const el = Array.isArray(box) ? box[0] : box
            if (el && el.checked !== (item.isChecked == 1)) {
              el.checked = item.isChecked == 1
            }
          })
          const all = this.$refs.chooseAll
          if (all && all.checked !== this.isAllCheck) {
            all.checked = this.isAllCheck
          }
        })
      },
      // 统一执行变更操作：防重复提交，结束后以服务端最新列表重算；失败时回滚控件本地状态
      async mutate(actionType, payload, onFail) {
        if (this.updating) return
        this.updating = true
        try {
          await this.$store.dispatch(actionType, payload)
        } catch (error) {
          this.$alert(error.message, '提示')
          if (onFail) onFail()
        }
        await this.reloadList()
        this.updating = false
      },
      // 节流
      handler:throttle(async function(type, disNum, cart, inputEl) {
        switch (type) {
          case 'add':
            disNum = 1
            break;
          case 'minus':
            // 产品个数大于1才可以传递给服务器
            disNum = cart.skuNum > 1? -1 : 0
            break;
            case 'change':
              if(isNaN(disNum) || disNum < 1) {
                disNum = 0
              } else {
                disNum = parseInt(disNum) - cart.skuNum
              }
        }
        // 数量无变化时不发请求
        if (disNum === 0) return
        await this.mutate('updateSkuNum', {
          skuId: cart.skuId,
          skuNum: disNum
        }, () => {
          // 修改失败：输入框回滚为服务端数量，避免展示未生效的值
          if (inputEl) inputEl.value = cart.skuNum
        })
      }, 700),
      // 删除购物车产品（节流 + 二次确认）
      deleteCartbyId:throttle(async function(cart) {
        try {
          await this.$confirm(`确定删除「${cart.skuName}」吗？`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } catch (error) {
          return
        }
        await this.mutate('deleteCartListBySkuId', cart.skuId)
      }),
      // 修改某一个产品的勾选状态
      updateChecked(cart, event) {
        // 带给服务器参数isChecked是0|1
        let isChecked = event.target.checked ? '1' : '0'
        return this.mutate('updateCheckedById', {
          skuId: cart.skuId,
          isChecked
        }, () => {
          // 失败时勾选框回滚为服务端状态，避免勾选框与汇总不一致
          event.target.checked = cart.isChecked == 1
        })
      },
      // 删除选中的商品（二次确认，选中集合为空时不可触发）
      async deleteAllChecked(){
        if (!this.canBatchDelete) return
        try {
          await this.$confirm(`确定删除已选的 ${this.selectedCount} 件商品吗？`, '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } catch (error) {
          return
        }
        await this.mutate('deleteAllCheckedCart')
      },
      // 修改全选状态
      updateAllChecked(event) {
        let isChecked = event.target.checked ? '1' : '0'
        return this.mutate('updateAllChecked', isChecked, () => {
          // 失败时全选框回滚为服务端状态
          event.target.checked = this.isAllCheck
        })
      },
      // 去结算：仅选中集合非空且数据已确认时可进入
      goSettle() {
        if (!this.canSettle) return
        this.$router.push('/trade')
      },
      // 行内小计与底部合计同口径：以分计算后格式化
      subtotal(cart) {
        return formatYuan(Math.round(cart.skuPrice * 100) * cart.skuNum)
      }
    },
    computed:{
      ...mapGetters(['cartList']),
      // 购物车数据
      cartInfoList(){
        return this.cartList.cartInfoList || []
      },
      // 唯一选中集合：件数、金额、全选状态、结算与批量删除入口均派生自它
      selectedCartInfoList(){
        return filterSelected(this.cartInfoList)
      },
      selectedCount(){
        return countSelected(this.selectedCartInfoList)
      },
      // 合计金额：以分累加后格式化为两位小数
      totalPrice(){
        return formatYuan(amountInCents(this.selectedCartInfoList))
      },
      // 判断底部复选框是否勾选
      isAllCheck(){
        return isAllChecked(this.cartInfoList)
      },
      canSettle(){
        return this.selectedCount > 0 && !this.updating
      },
      canBatchDelete(){
        return this.selectedCount > 0 && !this.updating
      },
      showSettleTip(){
        return this.cartInfoList.length > 0 && this.selectedCount === 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-state {
          padding: 40px 10px;
          text-align: center;
          color: #666;

          a {
            color: #e1251b;
            margin-left: 10px;
          }
        }

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }

          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;

          &.disabled {
            opacity: .5;
            cursor: not-allowed;
          }
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          position: relative;
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;

            &.disabled {
              opacity: .5;
              cursor: not-allowed;
            }
          }

          .settle-tip {
            position: absolute;
            right: 0;
            top: 52px;
            font-size: 12px;
            color: #666;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>