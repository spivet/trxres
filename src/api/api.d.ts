declare namespace API {
  interface IConfigRes {
    burnEnergy: number
    burnNet: number
    defaultEnergyPrice: number
    leftEnergy: number
    lowEnergyFee: number
    lowEnergyLimit: number
    pledgeEnergy: number
    pledgeNet: number
    price: number
    sun_10m: number
    sun_1d: number
    sun_1h: number
    sun_2d: number
    sun_3h: number
    treasureType: {
      type: 'transfer' | 'notUtransfer' | 'exchange'
      value: number
    }[]
  }

  interface ISubsidyReq {
    fromAddress: string
    sourceFlag: string
    timeStamp: number
    signed: string
  }
  interface ICheckSubsidyRes {
    totalReceivedLimit: number // 总次数
    remaining: number // 剩余次数
    isReceived: boolean // 今日是否已领取
    monthRemain: number // 用户本月剩余领取次数
    monthLimit: number // 用户每月领取限额
    monthIPRemain: number // 本月当前IP剩余领取次数
    monthIpLimit: number // 每月IP剩余领取次数
  }

  interface IBalanceRes {
    balance: number // 可用 TRX 余额，单位 SUN
    energyTotal: number // 总能量
    energyUsed: number // 已用能量
    bandWidthTotal: number // 总带宽
    bandWidthUsed: number // 已用带宽
  }

  interface IOrderListReq {
    /** 第三方标识，可选，默认查全部 */
    sourceFlag?: string
    /** 账户地址，可选，默认查全部 */
    fromAddress?: string
    /** 页码，可选，默认1 */
    page?: number
    /** 分页大小，可选，默认20，最大支持100 */
    pageSize?: number
    /** 排序类型，可选，默认0 */
    sort?: SortType
    /** 状态，可选，默认全部 */
    status?: OrderStatus
    /** 订单类型，可选，默认全部 */
    type?: OrderType
  }

  /** 排序类型枚举 */
  enum SortType {
    OrderTimeDesc = 0,
    PriceDesc = 1,
    AmountDesc = 2,
    EnergyDesc = 3,
  }

  /** 订单状态枚举 */
  enum OrderStatus {
    Unpaid = 0,
    Paid = 1,
    Renting = 2,
    Redeeming = 3,
    Ended = 4,
    Invalid = 5,
  }

  /** 订单类型枚举 */
  enum OrderType {
    RentOrder = 0,
    SubsidyOrder = 1,
  }

  interface IOrderItem {
    orderId: string // 订单ID
    fromAddress: string // 发起订单地址
    pledgeAddress: string // 租赁能量接收地址
    pledgeNum: number // 租用能量数量
    orderPrice: number // 能量单价 SUN
    pledgeDay: number // 租赁时长（天）
    pledgeHour: number // 租赁时长（小时）
    pledgeMinute: number // 租赁时长（分钟）
    source: string // 第三方标识
    status: OrderStatus // 状态 0:未支付 1:已支付 2:租赁中 3:赎回中 4:结束 5:无效
    startTime: number // 订单开始时间戳 单位秒
    endTime: number // 订单结束时间戳 单位秒
    pledgeHash?: string // 租赁操作hash
    reclaimHash?: string // 回收操作hash
  }

  interface IPagination {
    total: number
    pageSize: number
    page: number
  }

  interface IOrderListRes {
    data: IOrderItem[]
    pagination: IPagination
  }
}
