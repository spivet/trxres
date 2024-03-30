import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { WalletType } from '@/utils/wallet'
import { connectWallet } from '@/utils/wallet'

const useAccountStore = defineStore('account', {
  persist: true,
  state: () => {
    return {
      type: '',
      address: '',
      noExtension: false,
    }
  },
  actions: {
    setNoExtension(noExtension: boolean) {
      this.noExtension = noExtension
    },
    setAddress(address: string) {
      this.address = address
    },
    setType(type: `${WalletType}`) {
      this.type = type
    },
    async connect(walletType: `${WalletType}`) {
      this.setType(walletType)
      const res = await connectWallet(walletType)
      if (res.code === 200)
        this.setAddress(res.data)

      else if (res.code === 400)
        this.setNoExtension(true)
      else ElMessage.error(res.message)
    },
  },
})

export default useAccountStore
