// cartCalc 纯函数单元测试：对应需求 BR-01/02/03/04 与 AC-03/AC-04
// 运行：npm test（Node 内置 test runner，不依赖第三方库）
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  filterSelected,
  countSelected,
  amountInCents,
  formatYuan,
  isAllChecked
} from '../src/utils/cartCalc.js'

const item = (overrides = {}) => ({
  skuId: 1,
  skuName: '测试商品',
  skuPrice: 10.5,
  skuNum: 2,
  isChecked: 1,
  ...overrides
})

test('选中集合只保留 isChecked=1 且 skuNum>=1 的商品（BR-01 正常流）', () => {
  const list = [
    item({ skuId: 1, isChecked: 1, skuNum: 2 }),
    item({ skuId: 2, isChecked: 0, skuNum: 3 }),
    item({ skuId: 3, isChecked: 1, skuNum: 0 })
  ]
  assert.deepEqual(
    filterSelected(list).map(i => i.skuId),
    [1]
  )
})

test('选中集合：skuNum 为 0 的已勾选商品被排除（BR-01 边界）', () => {
  assert.equal(filterSelected([item({ skuNum: 0 })]).length, 0)
  assert.equal(filterSelected([item({ skuNum: 1 })]).length, 1)
})

test('选中集合：空列表与空值返回空数组（BR-01 边界）', () => {
  assert.deepEqual(filterSelected([]), [])
  assert.deepEqual(filterSelected(null), [])
  assert.deepEqual(filterSelected(undefined), [])
})

test('已选件数按 skuNum 求和而非 SKU 行数（BR-02）', () => {
  const selected = [
    item({ skuId: 1, skuNum: 2 }),
    item({ skuId: 2, skuNum: 1 })
  ]
  assert.equal(countSelected(selected), 3)
})

test('已选件数：空集合为 0（BR-02 边界）', () => {
  assert.equal(countSelected([]), 0)
  assert.equal(countSelected(null), 0)
})

test('合计金额以分累加：10.50 元 × 2 = ¥21.00（BR-03 / AC-03）', () => {
  const cents = amountInCents([item({ skuPrice: 10.5, skuNum: 2 })])
  assert.equal(cents, 2100)
  assert.equal(formatYuan(cents), '21.00')
})

test('合计金额：三位小数价格逐行取整为分，无浮点误差（BR-03 / AC-04）', () => {
  const cents = amountInCents([
    item({ skuId: 1, skuPrice: 10.5, skuNum: 2 }),
    item({ skuId: 2, skuPrice: 3.333, skuNum: 1 })
  ])
  assert.equal(cents, 2433)
  assert.equal(formatYuan(cents), '24.33')
})

test('合计金额：0.1 类浮点价格累加不失真（BR-03 边界）', () => {
  const cents = amountInCents([
    item({ skuPrice: 0.1, skuNum: 1 }),
    item({ skuPrice: 0.2, skuNum: 1 })
  ])
  assert.equal(cents, 30)
  assert.equal(formatYuan(cents), '0.30')
})

test('合计金额：空集合为 0 分，展示 ¥0.00（BR-03 / AC-01）', () => {
  assert.equal(amountInCents([]), 0)
  assert.equal(formatYuan(0), '0.00')
})

test('全选状态：列表非空且全部勾选才为全选（BR-04 正常流）', () => {
  const list = [item({ isChecked: 1 }), item({ isChecked: 1 })]
  assert.equal(isAllChecked(list), true)
})

test('全选状态：部分勾选不为全选（BR-04 / AC-05）', () => {
  const list = [item({ isChecked: 1 }), item({ isChecked: 0 })]
  assert.equal(isAllChecked(list), false)
})

test('全选状态：全部未勾选不为全选（BR-04 边界）', () => {
  const list = [item({ isChecked: 0 }), item({ isChecked: 0 })]
  assert.equal(isAllChecked(list), false)
})

test('全选状态：空购物车固定为未全选（BR-04 / AC-01）', () => {
  assert.equal(isAllChecked([]), false)
  assert.equal(isAllChecked(null), false)
})
