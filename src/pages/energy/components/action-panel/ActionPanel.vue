<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import useWallet from '@/hooks/useWallet-old'
import useAccountStore from '@/store/account'
import energyImg from '../../images/energy-icon.png'
import rentImg from '../../images/rent-icon.png'
import ActionButton from './ActionButton.vue'
import EnergyDialog from './EnergyDialog.vue'
import FastTradingDialog from './FastTradingDialog.vue'

const { linkWallet } = useWallet()
const { address } = toRefs(useAccountStore())

const dialogVisible = reactive({
  energy: false,
  fastTrading: false,
})
// 是否销毁弹窗,用 dialogVisible 会丢失关闭弹窗时的动画效果
const dialogDestroy = reactive({
  energy: false,
  fastTrading: false,
})

function handleOpenDialog(dialogName: keyof typeof dialogVisible) {
  if (!address.value) {
    linkWallet()
    return
  }
  dialogVisible[dialogName] = true
  dialogDestroy[dialogName] = false
}
function onCloseDialog(dialogName: keyof typeof dialogVisible) {
  dialogDestroy[dialogName] = true
}
</script>

<template>
  <div class="flex-between gap-24px">
    <ActionButton :name="$t('app.energyPal')" :icon="energyImg" class="flex-1" @click="handleOpenDialog('energy')" />
    <ActionButton :name="$t('app.fastTrading')" :icon="rentImg" class="flex-1" @click="handleOpenDialog('fastTrading')" />

    <!-- 能量宝弹窗 -->
    <EnergyDialog
      v-if="!dialogDestroy.energy"
      v-model:visible="dialogVisible.energy"
      @closed="onCloseDialog('energy')"
    />

    <!-- 快速租赁弹窗 -->
    <FastTradingDialog
      v-if="!dialogDestroy.fastTrading"
      v-model:visible="dialogVisible.fastTrading"
      @closed="onCloseDialog('fastTrading')"
    />
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
