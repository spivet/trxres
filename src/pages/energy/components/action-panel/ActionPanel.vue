<script setup lang="ts">
import { ref } from 'vue'
import energyImg from '../../images/energy-icon.png'
import rentImg from '../../images/rent-icon.png'
import ActionButton from './ActionButton.vue'
import EnergyDialog from './EnergyDialog.vue'
import FastTradingDialog from './FastTradingDialog.vue'

const showEnergyDialog = ref(false)
const showFastTradingDialog = ref(false)
</script>

<template>
  <div class="flex-between gap-24px">
    <ActionButton :name="$t('app.energyPal')" :icon="energyImg" class="flex-1" @click="showEnergyDialog = true" />
    <ActionButton :name="$t('app.fastTrading')" :icon="rentImg" class="flex-1" @click="showFastTradingDialog = true" />

    <!-- 能量宝弹窗 -->
    <EnergyDialog v-model:visible="showEnergyDialog" />

    <!-- 快速租赁弹窗 -->
    <FastTradingDialog v-model:visible="showFastTradingDialog" />
  </div>
</template>

<style lang="less" scoped>
.step-suffix {
  display: flex;
  align-items: center;
  gap: 24px;
}
.step-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #F5F5F5;
}
</style>
