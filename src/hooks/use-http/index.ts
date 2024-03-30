import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import type { StrictUseAxiosReturn } from '@vueuse/integrations/useAxios'
import { useAxios } from '@vueuse/integrations/useAxios'
import type { UseAxiosOptions } from '@vueuse/integrations'

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

function useHttp<T = any, D = any>(
  url: string,
  config: AxiosRequestConfig<D>,
  options?: UseAxiosOptions,
): StrictUseAxiosReturn<T, AxiosResponse<T>, D> & Promise<StrictUseAxiosReturn<T, AxiosResponse<T>, D>> {
  return useAxios(url, config, instance, options)
}

export default useHttp
