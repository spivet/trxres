import { defineStore } from 'pinia'
import { apiGetBalance } from '@/api'
import { multiplied } from '@/utils/number'
import useConfigStore from './config'

interface IState {
  walletName: 'tronlink' | 'tokenpocket' | ''
  balance: API.IBalanceRes | null
}
const useAccountStore = defineStore('account', {
  // persist: true,
  state: (): IState => {
    return {
      walletName: '',
      balance: null,
    }
  },
  getters: {
    trxBalanceToUsdt(state): number {
      if (!state.balance)
        return 0

      const configStore = useConfigStore()
      return Number(multiplied(state.balance.trxBalance, configStore.config.price))
    },
  },
  actions: {
    setWalletName(walletName: 'tronlink' | 'tokenpocket' | '') {
      this.walletName = walletName
    },
    setBalance(balance: API.IBalanceRes | null) {
      this.balance = balance
    },
    // 获取钱包余额
    async queryBalance(address: string) {
      if (!address)
        return
      const res = await apiGetBalance(address)
      this.setBalance(res)
    },
  },
})

export default useAccountStore
