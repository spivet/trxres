<script setup lang="ts">
import PageHeader from './components/PageHeader.vue'
import NotifyPanel from './components/NotifyPanel.vue'
import AccountPanel from './components/AccountPanel.vue'
import BalancePanel from './components/BalancePanel.vue'
import ActionButton from './components/ActionButton.vue'
import energyImg from './images/energy-icon.png'
import rentImg from './images/rent-icon.png'
import SubsidyPanel from './components/SubsidyPanel.vue'
import OrdersPanel from './components/OrdersPanel.vue'
import PageFooter from './components/PageFooter.vue'
</script>

<template>
  <div class="page-root">
    <PageHeader />
    <div class="page-main">
      <NotifyPanel />
      <AccountPanel />
      <BalancePanel />
      <div class="flex-between gap-24px">
        <ActionButton :name="$t('app.energyPal')" :icon="energyImg" class="flex-1" />
        <ActionButton :name="$t('app.fastTrading')" :icon="rentImg" class="flex-1" />
      </div>
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
