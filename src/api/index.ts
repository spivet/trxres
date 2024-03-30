import http from '@/utils/http'

export function apiGetConfig(fromAddress: string, sourceFlag?: string) {
  return http.post<API.IConfigRes>('/v1/config', {
    fromAddress,
    sourceFlag,
  })
}
