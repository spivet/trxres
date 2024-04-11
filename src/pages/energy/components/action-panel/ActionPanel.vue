<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import energyImg from '../../images/energy-icon.png'
import rentImg from '../../images/rent-icon.png'
import ActionButton from './ActionButton.vue'
import EnergyDialog from './EnergyDialog.vue'
import FastTradingDialog from './FastTradingDialog.vue'
import useWallet from '@/hooks/useWallet'
import useAccountStore from '@/store/account'

const { linkWallet } = useWallet()
const { address } = toRefs(useAccountStore())

const dialogVisible = reactive({
  energy: false,
  fastTrading: false,
})

function handleOpenDialog(dialogName: keyof typeof dialogVisible) {
  if (!address.value) {
    linkWallet()
    return
  }
  dialogVisible[dialogName] = true
}
</script>

<template>
  <div class="flex-between gap-24px">
    <ActionButton :name="$t('app.energyPal')" :icon="energyImg" class="flex-1" @click="handleOpenDialog('energy')" />
    <ActionButton :name="$t('app.fastTrading')" :icon="rentImg" class="flex-1" @click="handleOpenDialog('fastTrading')" />

    <!-- 能量宝弹窗 -->
    <EnergyDialog v-model:visible="dialogVisible.energy" />

    <!-- 快速租赁弹窗 -->
    <FastTradingDialog v-model:visible="dialogVisible.fastTrading" />
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
