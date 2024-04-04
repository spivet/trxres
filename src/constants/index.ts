/**
 * 订单排序类型
 * 0：根据订单时间倒序 1：根据价格倒序 2：根据金额倒序 3：根据能量倒序 可选，默认 0
 */
export const SortType = {
  OrderTimeDesc: 0,
  PriceDesc: 1,
  AmountDesc: 2,
  EnergyDesc: 3,
}

/**
 * 订单状态枚举
 * 0:未支付 1:已支付 2:租赁中 3:赎回中 4:结束 5:无效
 */
export const OrderStatus = {
  Unpaid: 0,
  Paid: 1,
  Renting: 2,
  Redeeming: 3,
  Ended: 4,
  Invalid: 5,
}

/**
 * 订单类型枚举
 * 0:租赁订单 1:补贴订单
 */
export const OrderType = {
  RentOrder: 0,
  SubsidyOrder: 1,
}
