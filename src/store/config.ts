import { defineStore } from 'pinia'
import { apiGetConfig, apiGetokens } from '@/api'

const useConfigStore = defineStore('config', {
  state: () => ({
    config: {} as API.IConfigRes,
    // 每笔转账需要燃烧的能量
    perCostRTX: 0,
    // 每笔转账需要的能量
    perCostPledge: 0,
    // 计算每笔转账能量消耗的trx节省的trx
    perSaved: 0,
    // 代币信息
    tokens: [] as API.IGetTokenItem[],
  }),
  getters: {
    treasureType(state) {
      return state.config.treasureType || []
    },
  },
  actions: {
    async getConfig(fromAddress: string, sourceFlag?: string) {
      const config = await apiGetConfig(fromAddress, sourceFlag)
      this.config = config
    },
    // 获取代币信息
    async getTokens() {
      const tokens = await apiGetokens()
      this.tokens = tokens
    },
  },
})

export default useConfigStore
