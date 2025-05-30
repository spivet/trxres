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
    <p>
      {{ $t('fastTradingDialog.moneyDesc',
            {
              unitPrice: unitPriceSun,
              savedTrxPercent,
              savedTrxAmount,
              savedUsdAmount,
              // Only highlight specific values
              unitPrice_highlight: true,
              savedTrxPercent_highlight: true,
              savedTrxAmount_highlight: true,
              savedUsdAmount_highlight: true,
            },
      ) }}
    </p>
    <p>
      {{ $t('fastTradingDialog.equalEnergyPledgeAmount',
            {
              originalTrxAmount: toThousands(originalTrxAmount),
              originalTrxAmount_highlight: true,
              originalUsdAmount: toThousands(originalUsdAmount),
              originalUsdAmount_highlight: true,
            },
      ) }}
    </p>
  </div>
</template>

<style scoped>
.tips-box {
  border-radius: 6px;
  padding: 10px;
  background: #f5f5f5;
  font-size: 12px;
  font-weight: bold;
  line-height: 24px;
  color: #1a1a1a;
}
</style>
