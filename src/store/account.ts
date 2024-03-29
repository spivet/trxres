import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { WalletType } from '@/utils/wallet'
import { connectWallet } from '@/utils/wallet'

const useAccountStore = defineStore('account', () => {
  const type = ref('')
  const address = ref('')
  const noExtension = ref(false)

  async function connect(walletType: `${WalletType}`) {
    type.value = walletType
    const res = await connectWallet(walletType)
    if (res.code === 200)
      address.value = res.data as string
    else if (res.code === 400)
      noExtension.value = true
    else
      ElMessage.error(res.message)
  }

  return {
    type,
    address,
    noExtension,
    connect,
  }
}, {
  persist: true,
})

export default useAccountStore
