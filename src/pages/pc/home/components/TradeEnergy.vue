<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TrxTabs from '@/components/trx-tabs/index.vue'
import { EnergyTradeTypes } from '@/constants'
import TradeEnergyByAmount from './TradeEnergyByAmount.vue'
import TradeEnergyByTimes from './TradeEnergyByTimes.vue'

const { t } = useI18n()

const tabs = computed(() => {
  return [
    { key: EnergyTradeTypes.AMOUNT, label: t('fastTradingDialog.tabTitle1') },
    { key: EnergyTradeTypes.TIMES, label: t('fastTradingDialog.tabTitle2') },
  ]
})
const rentType = ref(EnergyTradeTypes.AMOUNT)
</script>

<template>
  <div class="energy-container">
    <div class="flex-center mb-24px">
      <TrxTabs v-model="rentType" :tabs="tabs" />
    </div>

    <!-- 按量租赁 -->
    <TradeEnergyByAmount v-if="rentType === EnergyTradeTypes.AMOUNT" />

    <!-- 按笔租赁 -->
    <TradeEnergyByTimes v-if="rentType === EnergyTradeTypes.TIMES" />
  </div>
</template>

<style lang="less" scoped>
</style>
