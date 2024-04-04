import http from '@/utils/http'

// 查询配置
export function apiGetConfig(fromAddress: string, sourceFlag?: string) {
  return http.post<API.IConfigRes>('/v1/config', {
    fromAddress,
    sourceFlag,
  })
}

// 查询账户每日补贴限额
export function apiCheckSubsidy(fromAddress: string, sourceFlag?: string) {
  return http.post<API.ICheckSubsidyRes>('/v1/checkSubsidy', {
    fromAddress,
    sourceFlag,
  })
}

// 查询账户每日补贴限额
export function apiSubsidy(data: API.ISubsidyReq, successMsg: string) {
  return http.post<boolean>('/v1/subsidy', data, {
    successMsg,
  })
}

// 查询账户余额能量等信息
export function apiGetBalance(fromAddress: string) {
  return http.get<API.IBalanceRes>('/v1/account', { fromAddress })
}

// 查询订单列表
export function apiGetOrderList(params: API.IOrderListReq) {
  return http.get<API.IOrderListRes>('/v1/order/history', params)
}

// 查询订单详情
export function apiGetOrderDetail(id: string) {
  return http.get<API.IOrderItem>('/v1/order/info', { id })
}
