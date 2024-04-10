import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { StatusCodes, connectWallet } from '@/utils/wallet'

interface IState {
  sourceFlag: string | null
  address: string
  noWallet: boolean
  balance: API.IBalanceRes | null
}
const useAccountStore = defineStore('account', {
  persist: true,
  state: (): IState => {
    return {
      sourceFlag: null,
      address: '',
      noWallet: false,
      balance: null,
    }
  },
  actions: {
    setNoWallet(noWallet: boolean) {
      this.noWallet = noWallet
    },
    setAddress(address: string) {
      this.address = address
    },
    setSourceFlag(type: string | null) {
      this.sourceFlag = type
    },
    setBalance(balance: API.IBalanceRes | null) {
      this.balance = balance
    },
    async connect() {
      const res = await connectWallet()
      if (res.code === StatusCodes.Success)
        this.setAddress(res.data!)
      else if (res.code === StatusCodes.InvalidNetwork)
        ElMessage.error(res.message)
      else if (res.code === StatusCodes.Unauthorized)
        ElMessage.error(res.message)
      else if (res.code === StatusCodes.NoEnvironment)
        this.setNoWallet(true)
      else ElMessage.error(res.message)
    },
  },
})

export default useAccountStore
