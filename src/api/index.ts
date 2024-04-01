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
export function apiSubsidy(data: {
  fromAddress: string
  sourceFlag: string
  timeStamp: number
  signed: string
}) {
  return http.post<boolean>('/v1/subsidy', data)
}

// 查询账户余额能量等信息
export function apiGetBalance(account: string) {
  return http.get<API.IBalanceRes>('/v1/account', { account })
}
