import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { apiGetOrderList } from '@/api'

const useOrderStore = defineStore('order', () => {
  const latestHistory = ref<API.IOrderItem[]>([])
  const { loading, run: getHistory } = useRequest(apiGetOrderList, {
    manual: true,
    onSuccess: (res) => {
      latestHistory.value = res.data
    },
  })
  function getLatestHistory(address: string) {
    if (!address)
      return
    getHistory({
      fromAddress: address,
      pageSize: 5,
      page: 1,
    })
  }

  return {
    latestHistory,
    loading,
    getLatestHistory,
  }
})

export default useOrderStore
