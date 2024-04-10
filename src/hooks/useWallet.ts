import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import useAccountStore from '@/store/account'
import { StatusCodes, connectWallet } from '@/utils/wallet'

function useWallet() {
  const accountStore = useAccountStore()
  const { t } = useI18n()

  async function linkWallet() {
    const res = await connectWallet()
    if (res.code === StatusCodes.Success) {
      accountStore.setAddress(res.data!)
      return true
    }
    else if (res.code === StatusCodes.InvalidNetwork) {
      ElMessage.error(t('app.invalidNetwork'))
    }
    else if (res.code === StatusCodes.Unauthorized) {
      ElMessage.error(t('app.unauthorized'))
    }
    else if (res.code === StatusCodes.NoEnvironment) {
      accountStore.setNoWallet(true)
    }
    else { ElMessage.error(res.message) }
  }

  function unlinkWallet() {
    accountStore.setAddress('')
    accountStore.setSourceFlag('')
    accountStore.setBalance(null)
  }

  return {
    linkWallet,
    unlinkWallet,
  }
}

export default useWallet
