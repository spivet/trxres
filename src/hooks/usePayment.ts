import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiCreateOrder, apiUploadOrder } from '@/api'
import useWallet from '@/hooks/useWallet'
import useAccountStore from '@/store/account'
import useOrderStore from '@/store/orders'
import { getRentalTime } from '@/utils/utils'

function usePayment() {
  const { t } = useI18n()
  const { signTransaction } = useWallet()

  const { address, sourceFlag, balance } = storeToRefs(useAccountStore())
  const orderStore = useOrderStore()
  const isPaying = ref(false)

  const hasEnoughEnergy = (price: number) => {
    return Number(balance.value?.trxBalance) >= price
  }

  async function pay(payload: {
    pledgeAddress: string
    extraTrxNum?: number
    pledgeNum: number
    pledgeTime?: string
    pledgeBandwidthNum?: number
  }) {
    if (!address.value)
      return

    isPaying.value = true
    try {
      const { pledgeDay, pledgeHour, pledgeMinute } = getRentalTime(payload.pledgeTime || '')
      const res = await apiCreateOrder({
        ...payload,
        sourceFlag: sourceFlag.value,
        fromAddress: address.value,
        extraTrxNum: payload.extraTrxNum,
        pledgeDay,
        pledgeHour,
        pledgeMinute,
      })
      const signedTx = await signTransaction(res.transaction)
      await apiUploadOrder({
        orderId: res.orderId,
        fromHash: signedTx.txID,
        signedData: signedTx,
      })
      ElMessage.success(t('energyPalDialog.paySuccessMsg'))
      orderStore.getLatestHistory()
    }
    catch (error) {
      if (typeof error === 'string') {
        ElMessage.error({
          message: error,
          customClass: 'whitespace-nowrap',
        })
      }

      console.error('支付失败', error)
    }
    isPaying.value = false
  }

  return {
    hasEnoughEnergy,
    pay,
    isPaying,
  }
}

export default usePayment
