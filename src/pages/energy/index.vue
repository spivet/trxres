<script setup lang="ts">
import { onMounted, toRefs, watch } from 'vue'
import PageHeader from './components/PageHeader.vue'
import NotifyPanel from './components/NotifyPanel.vue'
import AccountPanel from './components/AccountPanel.vue'
import BalancePanel from './components/BalancePanel.vue'
import ActionPanel from './components/action-panel/ActionPanel.vue'
import SubsidyPanel from './components/SubsidyPanel.vue'
import OrdersPanel from './components/orders-panel/OrdersPanel.vue'
import PageFooter from './components/PageFooter.vue'
import useConfigStore from '@/store/config'
import useAccountStore from '@/store/account'
import { apiGetBalance } from '@/api'
import { isTokenPocket } from '@/utils/wallet'

const accountStore = useAccountStore()
const { address } = toRefs(accountStore)
const configStore = useConfigStore()

const { runAsync: getBalance } = useRequest(apiGetBalance, {
  manual: true,
  pollingInterval: 5000,
  onSuccess(data) {
    accountStore.setBalance(data)
  },
})
watch(address, (newVal) => {
  if (!newVal)
    return
  configStore.getConfig(address.value, accountStore.sourceFlag)
  getBalance(address.value)
}, { immediate: true })

onMounted(() => {
  if (isTokenPocket())
    accountStore.setSourceFlag('tpnative')
})
</script>

<template>
  <div class="page-root">
    <PageHeader />
    <div class="page-main">
      <NotifyPanel />
      <AccountPanel />
      <BalancePanel />
      <ActionPanel />
      <SubsidyPanel />
      <OrdersPanel />
    </div>
    <PageFooter />
  </div>
</template>

<style scoped>
.page-root {
  min-height: 100%;
  background: url('./images/top-bg.png') top center/100% no-repeat var(--kele-color-bg-page);
}

.page-main {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 40px;
}
</style>
