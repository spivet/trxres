<script setup>
import { ref } from 'vue'
import { TradeStuffTypes } from '@/constants'
import TradeBand from './TradeBand.vue'
import TradeEnergy from './TradeEnergy.vue'
import TradeTabs from './TradeTabs.vue'

const tradeStuffType = ref(TradeStuffTypes.ENERGY)
</script>

<template>
  <div class="trade">
    <TradeTabs v-model="tradeStuffType" />

    <div class="tab-content">
      <TradeEnergy v-if="tradeStuffType === TradeStuffTypes.ENERGY" />
      <TradeBand v-if="tradeStuffType === TradeStuffTypes.BAND" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.trade {
  height: 100%;
}

.tab-content {
  padding: 35px 30px;
  background-color: #fff;
  border-radius: 0 20px 20px 20px;
}
</style>
