import { defineStore } from 'pinia'
import { apiGetConfig, apiGetokens } from '@/api'

const useConfigStore = defineStore('config', {
  state: () => ({
    config: {} as API.IConfigRes,
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
