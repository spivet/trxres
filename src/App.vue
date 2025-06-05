<script setup lang=ts>
import { WalletConnectionError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter'
import { WalletProvider } from '@tronweb3/tronwallet-adapter-vue-hooks'
import { TokenPocketAdapter, TronLinkAdapter } from '@tronweb3/tronwallet-adapters'
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import PCEntry from './pages/pc/index.vue'

const adapters = [new TronLinkAdapter({
  checkTimeout: 3000,
}), new TokenPocketAdapter()]

const { t } = useI18n()
const accountStore = useAccountStore()
const configStore = useConfigStore()

function onAdapterChanged(adapter: TronLinkAdapter | TokenPocketAdapter) {
  console.log('Adapter changed:', adapter)
}

function onReadyStateChanged(ready: boolean) {
  console.log('Ready state changed:', ready)
}

function onConnect(address: string) {
  console.log('Connected', address)
}

function onDisconnect() {
  accountStore.setBalance(null)
  console.log('Disconnected')
}

function onChainChanged(chainId: string) {
  console.log('Chain changed:', chainId)
}

function onAccountsChanged(newAddress: string) {
  console.log('Accounts changed:', newAddress)
}

function onError(error: any) {
  if (error instanceof WalletConnectionError || error.code === 4001) {
    ElMessage.error(t('app.walletConnectionError'))
  }
  else if (error instanceof WalletNotFoundError) {
    ElMessage.error(t('app.noWallet'))
  }
  else {
    ElMessage.error(error.message)
  }
}

onMounted(() => {
  configStore.getConfig()
  configStore.getTokens()
})
</script>

<template>
  <WalletProvider
    :adapters="adapters"
    :auto-connect="false"
    @adapter-changed="onAdapterChanged"
    @ready-state-changed="onReadyStateChanged"
    @connect="onConnect"
    @disconnect="onDisconnect"
    @chain-changed="onChainChanged"
    @accounts-changed="onAccountsChanged"
    @error="onError"
  >
    <PCEntry />
  </WalletProvider>
</template>

<style scoped>
</style>
