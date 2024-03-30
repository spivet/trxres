export const StatusCodes = {
  SUCCESS: 100,
  NO_PARAMS: 101,
  INVALID_ADDRESS: 102,
  DAILY_LIMIT_REACHED: 103,
  ORDER_NOT_EXIST: 105,
  MONTHLY_LIMIT_EXCEEDED: 106,
  OUT_OF_EXCHANGE_RANGE: 107,
  TOKENPOCKET_REQUIRED: 108,
  DAILY_LIMIT_CLAIMED: 109,
  ALREADY_RECEIVED: 110,
  NO_DELEGATION_AUTHORITY: 111,
  ENERGY_STAKING_AMOUNT: 112,
  PRICE_RANGE_EXCEEDED: 113,
  PARAMETER_ERROR: 114,
  TIMEOUT: 115,
  WITHDRAWAL_OPERATION_EXIST: 116,
  ORDER_EXCEPTION: 117,
  USER_ALREADY_EXISTS: 118,
  ACCOUNT_ALREADY_EXISTS: 119,
  INVALID_SIGNATURE: 120,
  INACTIVE_ADDRESS: 121,
  CONTRACT_ADDRESS: 122,
  EXCEEDED_ADDRESS_LIMIT: 123,
  INSUFFICIENT_BALANCE: 124,
  INSUFFICIENT_QUANTITY: 125,
  MINIMUM_ENERGY_REQUIREMENT: 126,
  USDT_PURCHASE_MAINTENANCE: 127,
  INSUFFICIENT_ENERGY: 128,
  UNAUTHORIZED: 501,
  ACCESS_RESTRICTION: 502,
  FREQUENT_OPERATIONS: 777,
  INTERNAL_ERROR: 999,
}

export const StatusMessages = {
  [StatusCodes.SUCCESS]: {
    zh: '成功',
    en: 'Success',
  },
  [StatusCodes.NO_PARAMS]: {
    zh: '所需参数为空',
    en: 'Required parameter is empty',
  },
  [StatusCodes.INVALID_ADDRESS]: {
    zh: '地址无效',
    en: 'Invalid address',
  },
  [StatusCodes.DAILY_LIMIT_REACHED]: {
    zh: '您已达到今日领取限制',
    en: 'You have already reached the daily limit',
  },
  [StatusCodes.ORDER_NOT_EXIST]: {
    zh: '订单不存在',
    en: 'The order does not exist',
  },
  [StatusCodes.MONTHLY_LIMIT_EXCEEDED]: {
    zh: '本月免费额度已用完',
    en: 'The monthly claim limit has been exceeded',
  },
  [StatusCodes.OUT_OF_EXCHANGE_RANGE]: {
    zh: '超出交换范围',
    en: 'Out of exchange range',
  },
  [StatusCodes.TOKENPOCKET_REQUIRED]: {
    zh: '您需要在TokenPocket钱包中使用此功能',
    en: 'You need use this function in the TokenPocket wallet',
  },
  [StatusCodes.DAILY_LIMIT_CLAIMED]: {
    zh: '今日领取额度已用完',
    en: 'The subsidy has been claimed out',
  },
  [StatusCodes.ALREADY_RECEIVED]: {
    zh: '24小时内已领取过了',
    en: 'Received',
  },
  [StatusCodes.NO_DELEGATION_AUTHORITY]: {
    zh: '未找到委托权限',
    en: 'No delegation authority found',
  },
  [StatusCodes.ENERGY_STAKING_AMOUNT]: {
    zh: '要成为能源供应商，能源抵押的TRX金额必须超过一定数量',
    en: 'To become an energy supplier, the energy staking TRX amount must be over',
  },
  [StatusCodes.PRICE_RANGE_EXCEEDED]: {
    zh: '超过了最高允许的价格设置',
    en: 'Exceeded the price range allowed for setting',
  },
  [StatusCodes.PARAMETER_ERROR]: {
    zh: '参数错误',
    en: 'Parameter error',
  },
  [StatusCodes.TIMEOUT]: {
    zh: '超时',
    en: 'Timeout',
  },
  [StatusCodes.WITHDRAWAL_OPERATION_EXIST]: {
    zh: '当前用户存在取款操作，请稍后再试!',
    en: 'There is a withdrawal operation for the current user, please try again later!',
  },
  [StatusCodes.ORDER_EXCEPTION]: {
    zh: '订单存在异常，请联系客服人员帮助解决。',
    en: 'There is an exception in the order, please contact the customer service staff to help solve it.',
  },
  [StatusCodes.USER_ALREADY_EXISTS]: {
    zh: '该用户已存在',
    en: 'The user already exists.',
  },
  [StatusCodes.ACCOUNT_ALREADY_EXISTS]: {
    zh: '该账户已存在。请前往 tronify.io 上的买家管理平台绑定您的 TG ID',
    en: 'The account already exists. Please go to the buyer management platform on tronify.io and bind your TG ID.',
  },
  [StatusCodes.INVALID_SIGNATURE]: {
    zh: '无效的签名',
    en: 'Invalid signature',
  },
  [StatusCodes.INACTIVE_ADDRESS]: {
    zh: '地址未激活，请替换',
    en: 'The address is not activated, please activate it',
  },
  [StatusCodes.CONTRACT_ADDRESS]: {
    zh: '该地址是合约地址，请替换',
    en: 'The address is a contract address, please replace it',
  },
  [StatusCodes.EXCEEDED_ADDRESS_LIMIT]: {
    zh: '地址数量超过1000个',
    en: 'The number of addresses exceeds 1000',
  },
  [StatusCodes.INSUFFICIENT_BALANCE]: {
    zh: '账户余额不足',
    en: 'Insufficient account balance',
  },
  [StatusCodes.INSUFFICIENT_QUANTITY]: {
    zh: '剩余数量不足',
    en: 'Insufficient remaining quantity',
  },
  [StatusCodes.MINIMUM_ENERGY_REQUIREMENT]: {
    zh: '剩余能量必须大于最小能量',
    en: 'The remaining energy must be greater than the minimum energy',
  },
  [StatusCodes.USDT_PURCHASE_MAINTENANCE]: {
    zh: 'USDT购买能量正在维护中',
    en: 'USDT purchased energy is under maintenance',
  },
  [StatusCodes.INSUFFICIENT_ENERGY]: {
    zh: '目前能量不足，请稍后重试',
    en: 'Insufficient energy at the moment, please try again later',
  },
  [StatusCodes.UNAUTHORIZED]: {
    zh: '未授权',
    en: 'Not author',
  },
  [StatusCodes.ACCESS_RESTRICTION]: {
    zh: '访问限制',
    en: 'Access restriction',
  },
  [StatusCodes.FREQUENT_OPERATIONS]: {
    zh: '操作频繁，请稍后重试',
    en: 'Frequent operations, please try again later',
  },
  [StatusCodes.INTERNAL_ERROR]: {
    zh: '内部错误',
    en: 'Service Internal Error',
  },
}
