// 购物车汇总计算：ShopCart 页面与 Trade 订单范围复核共用本模块，保证同一选中集合口径
export function filterSelected(cartInfoList) {
  return (cartInfoList || []).filter(item => item.isChecked == 1 && item.skuNum >= 1)
}

export function countSelected(selectedList) {
  return (selectedList || []).reduce((sum, item) => sum + item.skuNum, 0)
}

// 金额以「分」为最小单位累加，skuPrice 先取整为分，避免浮点误差（如 3.333 元）
export function amountInCents(selectedList) {
  return (selectedList || []).reduce((sum, item) => sum + Math.round(item.skuPrice * 100) * item.skuNum, 0)
}

export function formatYuan(cents) {
  return (cents / 100).toFixed(2)
}

// 全选：列表非空且每一行 isChecked=1；空列表固定为未全选
export function isAllChecked(cartInfoList) {
  const list = cartInfoList || []
  return list.length > 0 && list.every(item => item.isChecked == 1)
}
