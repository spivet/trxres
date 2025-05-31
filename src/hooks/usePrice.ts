import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { apiCheckPrice } from '@/api'
import useAccountStore from '@/store/account'
import { roundFloat } from '@/utils/number'
import { getRentalTime } from '@/utils/utils'

function usePrice() {
  const { address, sourceFlag } = storeToRefs(useAccountStore())

  const { data, loading: checkPriceLoading, run } = useRequest(apiCheckPrice, {
    manual: true,
  })
  const priceData = computed(() => {
    if (!data.value) {
      return {
        actualPrice: 0,
      }
    }
    return {
      ...data.value,
      actualPrice: roundFloat(data.value.pledgeTrxNum, 2),
    }
  })

  async function checkPrice(payload: {
    pledgeAddress: string
    pledgeTime?: string // 'm10' | 'h1' | 'h3' | 'day1'-'day30'
    pledgeNum?: number
    extraTrxNum?: number
    pledgeBandwidthNum?: number
    payToken?: string
  }) {
    if (!address.value)
      return

    const { pledgeDay, pledgeHour, pledgeMinute } = getRentalTime(payload.pledgeTime)

    const params = {
      fromAddress: address.value,
      sourceFlag: sourceFlag.value,
      pledgeAddress: payload.pledgeAddress,
      pledgeDay,
      pledgeHour,
      pledgeMinute,
      pledgeNum: payload.pledgeNum,
      extraTrxNum: payload.extraTrxNum,
      pledgeBandwidthNum: payload.pledgeBandwidthNum,
      payToken: payload.payToken,
    }

    run(params)
  }

  return {
    priceData,
    checkPriceLoading,
    checkPrice: debounce(checkPrice, 500),
  }
}

export default usePrice
