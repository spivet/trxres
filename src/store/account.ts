import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { CoinTypes } from '@/constants'
import { multiplied } from '@/utils/number'
import { connectWallet, StatusCodes } from '@/utils/wallet'
import { apiGetOrderList, apiGetBalance } from "@/api";
import useConfigStore from './config'

interface IState {
  sourceFlag: string
  address: string | null
  noWallet: boolean
  balance: API.IBalanceRes | null
  // 订单数据
  loadingHistory: boolean
  history: API.IOrderItem[]
}
const useAccountStore = defineStore('account', {
  // persist: true,
  state: (): IState => {
    return {
      sourceFlag: '',
      address: null,
      noWallet: false,
      balance: null,
      loadingHistory: false,
      history: [],
    }
  },
  getters: {
    shortAddress(state) {
      return state.address ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}` : null
    },
    trxBalanceToUsdt(state) {
      const configStore = useConfigStore()
      const rtx = configStore.tokens.find(item => item.symbol === CoinTypes.TRX)
      if (!state.balance?.trxBalance || !rtx)
        return 0
      return multiplied(state.balance.trxBalance, rtx.usdPrice)
    },
  },
  actions: {
    setNoWallet(noWallet: boolean) {
      this.noWallet = noWallet
    },
    setAddress(address: string | null) {
      this.address = address
    },
    setSourceFlag(type: string) {
      this.sourceFlag = type
    },
    setBalance(balance: API.IBalanceRes | null) {
      this.balance = balance
    },
    // 获取订单列表
    async getHistory() {
      if (!this.address) return;
      this.loadingHistory = true;
      const res = await apiGetOrderList({
        fromAddress: this.address,
        pageSize: 6,
        page: 1,
      }).finally(() => {
        this.loadingHistory = false;
      });
      this.history = res.data;
    },
    // 获取钱包余额
    async queryBalance() {
      if (!this.address) return;
      const res = await apiGetBalance(this.address);
      this.setBalance(res);
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
