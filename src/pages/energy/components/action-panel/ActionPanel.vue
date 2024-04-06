<script setup lang="ts">
import { ref } from 'vue'
import energyImg from '../../images/energy-icon.png'
import rentImg from '../../images/rent-icon.png'
import ActionButton from './ActionButton.vue'
import EnergyDialog from './EnergyDialog.vue'
import DialogTitle from '@/components/dialog-custom/DialogTitle.vue'
import KeleInput from '@/components/kele-input/index.vue'

const showEnergyDialog = ref(false)

const transTimes = ref(0)
const showFastTradingDialog = ref(false)
</script>

<template>
  <div class="flex-between gap-24px">
    <ActionButton :name="$t('app.energyPal')" :icon="energyImg" class="flex-1" @click="showEnergyDialog = true" />
    <ActionButton :name="$t('app.fastTrading')" :icon="rentImg" class="flex-1" @click="showFastTradingDialog = true" />

    <!-- 能量宝弹窗 -->
    <EnergyDialog v-model:visible="showEnergyDialog" />

    <!-- 快速租赁弹窗 -->
    <van-popup
      v-model:show="showFastTradingDialog"
      :show-confirm-button="false"
      round
      overlay-class="bg-[rgba(0,0,0,.5)]!"
      class="dialog-container"
    >
      <DialogTitle :title="$t('fastTradingDialog.title')" @close="showFastTradingDialog = false" />
      <!-- 租用量 -->
      <section class="mb-20px">
        <div class="dialog-body__title">
          {{ $t('fastTradingDialog.rentalAmount') }}
        </div>
        <div class="dialog-body__content">
          <KeleInput v-model="transTimes" positive-only :options="[145, 2323, 3424]" :suffix="$t('app.energy')" />
        </div>
      </section>
      <!-- 租用时间 -->
      <section class="mb-20px">
        <div class="dialog-body__title">
          {{ $t('fastTradingDialog.rentalDuration') }}
        </div>
        <div class="dialog-body__content">
          <KeleInput v-model="transTimes" positive-only :options="[145, 2323, 3424]">
            <template #suffix>
              <div class="step-suffix">
                <van-icon class="step-button" size="14px" name="minus" />
                <van-icon class="step-button" size="14px" name="plus" />
              </div>
            </template>
          </KeleInput>
        </div>
      </section>
      <!-- 接收方 -->
      <section class="mb-20px">
        <div class="dialog-body__title">
          {{ $t('app.receiver') }}
        </div>
        <div class="dialog-body__content">
          <KeleInput v-model="transTimes" :placeholder="$t('fastTradingDialog.receiverPlace')" />
        </div>
      </section>
      <!-- 支付金额 -->
      <section class="mb-20px">
        <div class="dialog-body__title">
          {{ $t('fastTradingDialog.money') }}
        </div>
        <div class="dialog-body__desc">
          {{ $t('fastTradingDialog.moneyDesc') }}
        </div>
      </section>
      <!-- 填写需求 -->
      <p class="text-20px/32px color-#4F4F4F">
        {{ $t('energyPalDialog.note') }}
      </p>
      <van-button color="#4045D6" block round class="mt-32px! font-bold">
        {{ $t('energyPalDialog.pay') }}
      </van-button>
    </van-popup>
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
