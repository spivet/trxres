import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { StatusMessages } from './code'

interface IAPIRes<T> {
  resCode: keyof typeof StatusMessages
  resMsg: string
  data: T
}

// 创建axios实例对象
const instance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

// 响应拦截器
instance.interceptors.response.use((response: AxiosResponse<IAPIRes<any>>) => {
  const { resCode, data } = response.data
  if (resCode === 100) {
    return data
  }
  else {
    const { locale } = useI18n()
    ElMessage.error(StatusMessages[resCode][locale.value as 'zh' | 'en'])
    return Promise.reject(new Error(data))
  }
}, (error: AxiosError<any>) => {
  const { message = '系统繁忙' } = error?.response!.data
  ElMessage.error(message)
  return Promise.reject(error)
})

const http = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig) {
    return instance.get<T, T>(url, {
      params,
      ...config,
    })
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post<T, T>(url, data, config)
  },
}

export default http
