import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { StatusMessages } from './code'
import { i18n } from '@/i18n'

interface IAPIRes<T> {
  resCode: keyof typeof StatusMessages
  resMsg: string
  data: T
}
interface IRequestConfig extends AxiosRequestConfig {
  successMsg?: string
}

// 创建axios实例对象
const instance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

// 响应拦截器
instance.interceptors.response.use((response: AxiosResponse<IAPIRes<any>>) => {
  const { resCode, resMsg, data } = response.data
  const config = response.config as IRequestConfig
  const lang = i18n.global.locale.value || 'zh'
  if (resCode === 100) {
    config.successMsg && ElMessage.success(config.successMsg)
    return data
  }
  else {
    ElMessage.error(StatusMessages[resCode][lang as 'zh' | 'en'])
    return Promise.reject({
      resCode,
      resMsg,
      data,
    })
  }
}, (error: AxiosError<any>) => {
  const { message } = error
  ElMessage.error(message)
  return Promise.reject(error)
})

const http = {
  get<T = any>(url: string, params?: any, config?: IRequestConfig) {
    return instance.get<T, T>(url, {
      params,
      ...config,
    })
  },
  post<T = any>(url: string, data?: any, config?: IRequestConfig) {
    return instance.post<T, T>(url, data, config)
  },
}

export default http
