<script setup lang="ts">
import { toThousands } from '@/utils/utils'

defineProps({
  originalTrxAmount: {
    type: Number,
    default: 0,
  },
  originalUsdAmount: {
    type: Number,
    default: 0,
  },
  unitPriceSun: {
    type: Number,
    default: 0,
  },
  savedTrxPercent: {
    type: Number,
    default: 0,
  },
  savedTrxAmount: {
    type: Number,
    default: 0,
  },
  savedUsdAmount: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="tips-box">
    <i18n-t keypath="fastTradingDialog.moneyDesc" tag="p">
      <template #unitPrice>
        <span class="font-bold color-#000">{{ unitPriceSun }}</span>
      </template>
      <template #savedTrxPercent>
        <span class="font-bold color-#000">{{ savedTrxPercent }}</span>
      </template>
      <template #savedTrxAmount>
        <span class="font-bold color-#000">{{ savedTrxAmount }} TRX</span>
      </template>
      <template #savedUsdAmount>
        <span class="font-bold color-#000">{{ savedUsdAmount }}</span>
      </template>
    </i18n-t>
    <i18n-t keypath="fastTradingDialog.equalEnergyPledgeAmount" tag="p">
      <template #originalTrxAmount>
        <span class="font-bold color-#000">{{ toThousands(originalTrxAmount) }} TRX</span>
      </template>
      <template #originalUsdAmount>
        <span class="font-bold color-#000">{{ toThousands(originalUsdAmount) }}</span>
      </template>
    </i18n-t>
  </div>
</template>

<style scoped>
.tips-box {
  border-radius: 6px;
  padding: 10px;
  background: #f5f5f5;
  font-size: 12px;
  line-height: 24px;
  color: #1a1a1a;
}
</style>
