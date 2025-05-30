declare namespace API {
  interface IConfigRes {
    defaultEnergyPrice: number // 默认购买能量价格 单位 SUN
    sun_1d: number // 租赁1天能量单价 单位 SUN
    sun_1h: number // 租赁1小时能量单价 单位 SUN
    sun_2d: number // 租赁2天能量单价 单位 SUN
    sun_3h: number // 租赁3小时能量单价 单位 SUN
    sun_10m: number // 租赁10分钟能量单价 单位 SUN
    lowEnergyFee: number // 租赁低能量手续费 单位 TRX
    lowEnergyLimit: number // 租赁低能量限制值，低于该值认为是租赁低能量
    leftEnergy: number // 平台剩余可租赁能量
    leftNet: number // 平台剩余可租赁带宽
    pledgeEnergy: number // 质押1TRX可获得的能量
    pledgeNet: number // 质押1TRX可获得的带宽
    burnEnergy: number // 燃烧1TRX可获得的能量
    burnNet: number // 燃烧1TRX可获得的带宽
    price: number // 1 TRX 兑换 USDT 价格
    lowEnergyCanBuy: number // 最小租赁能量
    topEnergyCanBuy: number // 最大租赁能量
    netPrice: number // 带宽单价 单位 SUN
    createFee: number // 激活账户费用 单位 TRX
    // 能量宝选项类型对应的能量
    // transfer - 对方账户有USDT
    // notUtransfer - 对方账户没有USDT
    // exchange - 合约兑换
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
    address: string // 地址
    energyTotal: number // 总能量
    energyUsed: number // 已用能量
    netTotal: number // 总带宽
    netUsed: number // 已用带宽
    isActived: boolean // 是否已激活
    trxBalance: number // TRX 余额，为防止精度丢失，所以使用字符串
    usdtBalance: number // USDT 余额，为防止精度丢失，所以使用字符串
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

  interface ICheckPriceReq {
    fromAddress: string // 发起操作地址
    pledgeAddress: string // 能量接收地址
    // pledgeDay、pledgeHour和pledgeMinute，任选其一提交即可
    // 如果同时存在则按 pledgeDay - pledgeHour - pledgeMinute 顺序优先选择第一个有值的
    pledgeDay?: number // 租赁天数 取值范围[1 - 30] 整数
    pledgeHour?: number // 租赁小时数 取值范围[1, 3] 整数
    pledgeMinute?: number // 租赁分钟数 取值范围[10] 整数
    pledgeNum?: number // 租赁能量数量
    extraTrxNum?: number // 需要兑换的trx数量, 传大于等于0或空字符串认为是TRC20支付 取值范围[0-30]; 不传则为TRX支付
    sourceFlag: string // 第三方来源
    pledgeBandwidthNum?: number // 租赁带宽数量
    payToken?: string // TRC20支付币种（可选），通过"查询币种"接口查询，传币种的symbol；仅在TRC20支付时有效，默认值为USDT
  }
  interface ICheckPriceRes {
    fromAddress: string // 发起操作地址
    pledgeAddress: string // 接收能量地址
    pledgeDay: number // 租赁天数 pledgeDay,pledgeHour,pledgeMinute 仅会有一个有值，按顺序优先选择第一个有值的使用
    pledgeHour: number // 租赁小时数 pledgeDay,pledgeHour,pledgeMinute 仅会有一个有值，按顺序优先选择第一个有值的使用
    pledgeMinute: number // 租赁分钟数 pledgeDay,pledgeHour,pledgeMinute 仅会有一个有值，按顺序优先选择第一个有值的使用
    source: string // 第三方来源
    orderType: 'ENERGY' // 资源类型
    orderPrice: number // 单价 SUN
    pledgeNum: number // 租赁数量
    pledgeTrxNum: number // 支付所需的TRX 含低能量租赁手续费 和 激活账号费用
    payCoinCode: string // 支付所需币种
    payCoinAmt: number // 支付币种数量 单位与 payCoinCode 一致
    extraTrxNum: number // // 需要兑换的TRX数量（范围限制在 大于1，小于等于30 整数），该参数用于确认是否用TRC20支付
    activeAccountFee: number // 激活账号费用 单位与 payCoinCode 一致
    lowEnergyFee: number // 低能量手续费 单位与 payCoinCode 一致
    purchaseTRXFee: number // 购买trx费用 单位与 payCoinCode 一致
    purchaseEnergyFee: number // 购买能量费用 含手续费 单位与 payCoinCode 一致
    purchaseBandwidthFee: number // 购买带宽费用 单位与 payCoinCode 一致
    pledgeBandwidthNum: number // 租赁带宽数量
    ratio: string // TRX 对当前支付币种汇率
    usdtModeAvailable: boolean // TRC20 兑换是否可用
  }

  interface ICreateOrderReq {
    fromAddress: string // 发起操作地址
    pledgeAddress: string // 能量接收地址
    // 为适配原api pledgeDay、pledgeHour和pledgeMinute，任选其一提交即可
    // 如果同时存在则按 pledgeDay - pledgeHour - pledgeMinute 顺序优先选择第一个有值的
    pledgeDay?: number // 租赁天数 取值范围[1 - 30] 整数
    pledgeHour?: number // 租赁小时数 取值范围[1, 3] 整数
    pledgeMinute?: number // 租赁分钟数 取值范围[10] 整数
    pledgeNum: number // 租赁数量
    extraTrxNum?: number // 需要的trx数量（范围限制在 大于1.5，小于等于30），该参数用于确认是否用USDT支付
    sourceFlag?: string // 第三方来源
    pledgeBandwidthNum?: number // 租赁带宽数量
    isDapp?: boolean // 订单来源
    ip?: string // ip地址 不指定默认使用header中获取的ip，可选
    port?: string // 端口，可选
    payToken?: string // TRC20支付币种（可选），通过"查询币种"接口查询，传币种的symbol；仅在TRC20支付时有效，默认值为USDT
  }
  interface ICreateOrderRes {
    orderId: string // 订单ID
    fromAddress: string // 发起操作地址
    pledgeAddress: string // 接收能量地址
    pledgeDay: number // 租赁天数 pledgeDay,pledgeHour,pledgeMinute 仅会有一个有值，按顺序优先选择第一个有值的使用
    pledgeHour: number // 租赁小时数 pledgeDay,pledgeHour,pledgeMinute 仅会有一个有值，按顺序优先选择第一个有值的使用
    pledgeMinute: number // 租赁分钟数 pledgeDay,pledgeHour,pledgeMinute 仅会有一个有值，按顺序优先选择第一个有值的使用
    source: string // 第三方来源
    orderType: 'ENERGY' // 资源类型
    orderPrice: number // 单价 SUN
    pledgeNum: number // 租赁数量
    pledgeTrxNum: number // 支付所需的 TRX 含低能量租赁手续费 和 激活账号费用
    payCoinCode: string // 支付所需币种
    payCoinAmt: number // 支付币种数量 单位与 payCoinCode 一致
    extraTrxNum: number // 需要兑换的trx数量, 传大于等于0或空字符串认为是TRC20支付 取值范围[0-30]; 不传则为TRX支付
    activeAccountFee: number // 激活账号费用 单位与 payCoinCode 一致
    lowEnergyFee: number // 低能量手续费 单位与 payCoinCode 一致
    purchaseTRXFee: number // 购买trx费用 单位与 payCoinCode 一致
    purchaseEnergyFee: number // 购买能量费用 含手续费 单位与 payCoinCode 一致
    purchaseBandwidthFee: number // 购买带宽费用 单位与 payCoinCode 一致
    pledgeBandwidthNum: number // 租赁带宽数量
    ratio: string // TRX 对当前支付币种汇率
    usdtModeAvailable: boolean // TRC20 兑换是否可用
    transaction: Record<string, never> // 未签名交易
  }

  interface IUploadOrderReq {
    orderId: string // 订单ID
    fromHash: string // 买单地址
    signedData: any // 签名数据
  }

  interface IGetTokenItem {
    address: string // 地址
    decimals: number // 代币精度
    id: number // 代币ID
    price: string // 代币价格
    symbol: string // 代币名称
    usdPrice: string // 代币美元价格
  }
}
