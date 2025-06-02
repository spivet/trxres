import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { apiGetOrderList } from '@/api'
import useAccountStore from '@/store/account'

const useOrderStore = defineStore('order', () => {
  const accountStore = useAccountStore()
  const latestHistory = ref<API.IOrderItem[]>([])
  const { loading, run: getHistory } = useRequest(apiGetOrderList, {
    manual: true,
    onSuccess: (res) => {
      latestHistory.value = res.data
    },
  })
  function getLatestHistory() {
    if (!accountStore.address)
      return
    getHistory({
      fromAddress: accountStore.address,
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
