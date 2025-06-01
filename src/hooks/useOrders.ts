import { apiGetOrderList } from '@/api'

function useOrders() {
  const { data: history, loading, run: getHistory } = useRequest(apiGetOrderList, {
    manual: true,
  })

  return {
    history,
    loading,
    getHistory,
  }
}

export default useOrders
