import { defineStore } from 'pinia'
import { apiGetConfig } from '@/api'

const useConfigStore = defineStore('config', {
  state: () => ({
    config: {} as API.IConfigRes,
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
  },
})

export default useConfigStore
