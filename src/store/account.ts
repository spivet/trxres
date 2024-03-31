import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { WalletType } from '@/utils/wallet'
import { connectWallet } from '@/utils/wallet'

interface IState {
  type: `${WalletType}` | null
  address: string
  noExtension: boolean
}
const useAccountStore = defineStore('account', {
  persist: true,
  state: (): IState => {
    return {
      type: null,
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
    setType(type: `${WalletType}` | null) {
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
