import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { apiCreateOrder, apiUploadOrder } from '@/api'
import useAccountStore from '@/store/account'

function usePayment() {
  const { t } = useI18n()
  const { address, sourceFlag, balance } = storeToRefs(useAccountStore())
  const isPaying = ref(false)

  const hasEnoughEnergy = (price: number) => {
    return Number(balance.value?.trxBalance) >= price
  }

  async function pay(payload: {
    pledgeAddress: string
    extraTrxNum?: number
    pledgeNum: number
    pledgeDay?: number
    pledgeHour?: number
    pledgeMinute?: number
  }) {
    isPaying.value = true
    try {
      const res = await apiCreateOrder({
        ...payload,
        sourceFlag: sourceFlag.value,
        fromAddress: address.value,
        extraTrxNum: payload.extraTrxNum ?? 0,
      })
      const signedTx = await window.tronWeb?.trx.sign(res.transaction)
      // eslint-disable-next-line no-console
      console.log('签名结果', signedTx)
      await apiUploadOrder({
        orderId: res.orderId,
        fromHash: signedTx.txID,
        signedData: signedTx,
      })
      ElMessage.success(t('energyPalDialog.paySuccessMsg'))
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
