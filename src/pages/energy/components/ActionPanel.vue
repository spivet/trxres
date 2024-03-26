<script setup lang="ts">
import { ref } from 'vue'
import energyImg from '../images/energy-icon.png'
import rentImg from '../images/rent-icon.png'
import ActionButton from './ActionButton.vue'
import DialogTitle from '@/components/dialog-custom/DialogTitle.vue'
import KeleInput from '@/components/kele-input/index.vue'
import PopoverSelect from '@/components/popover-select/index.vue'

const showEnergyDialog = ref(false)
const transTimes = ref('')
const unitPrice = ref('')
const priceList = [
  {
    name: '1',
    value: '1',
  },
  {
    name: '2',
    value: '2',
  },
  {
    name: '3',
    value: '3',
  },
]
const result = ref(0)
</script>

<template>
  <div class="flex-between gap-24px">
    <ActionButton :name="$t('app.energyPal')" :icon="energyImg" class="flex-1" @click="showEnergyDialog = true" />
    <ActionButton :name="$t('app.fastTrading')" :icon="rentImg" class="flex-1" />

    <!-- 能量宝弹窗 -->
    <van-popup
      v-model:show="showEnergyDialog"
      :show-confirm-button="false"
      round
      overlay-class="bg-[rgba(0,0,0,.5)]!"
      class="dialog-container"
    >
      <DialogTitle title="能量宝" @close="showEnergyDialog = false" />
      <!-- 购买需求 -->
      <section class="mb-20px">
        <div class="dialog-body__title">
          {{ $t('energyPalDialog.buy') }}
        </div>
        <div class="dialog-body__content">
          <div class="dialog-body__desc">
            {{ $t('energyPalDialog.buyDesc') }}
          </div>
          <!-- 转账笔数 -->
          <div class="dialog-body__title-sub">
            {{ $t('energyPalDialog.transTimes') }}
            <el-tooltip effect="dark" placement="bottom">
              <i class="i-icon:question-outline ml-8px" />
              <template #content>
                <div class="text-22px w-380px">
                  {{ $t('energyPalDialog.transDesc') }}
                </div>
              </template>
            </el-tooltip>
          </div>
          <div class="flex items-center">
            <KeleInput v-model="transTimes" positive-only class="w-160px" />
            <span class="mx-16px text-24px">{{ $t('energyPalDialog.times') }} x</span>
            <PopoverSelect v-model="unitPrice" :options="priceList" custom-select-class="w-350px" />
          </div>
          <PopoverSelect v-model="unitPrice" :options="priceList" />
          <i18n-t keypath="energyPalDialog.transResult" tag="div" class="text-24px/38px color-font-second">
            <template #result>
              <span class="color-function-danger">{{ result }}</span>
            </template>
          </i18n-t>
          <!-- 接收地址 -->
          <div class="dialog-body__title-sub">
            {{ $t('app.receiver') }}
          </div>
          <KeleInput v-model="transTimes" placeholder="Please enter the receiver" />
        </div>
      </section>
      <!-- 支付 -->
      <section class="mb-20px">
        <div class="dialog-body__title">
          {{ $t('energyPalDialog.pay') }}
        </div>
        <div class="dialog-body__content">
          <div class="dialog-body__title-sub">
            {{ $t('energyPalDialog.needPay') }}
          </div>
          <div class="flex items-center h-60px text-32px font-bold">
            <span class="color-function-danger mr-12px">{{ 0 }}</span>
            TRX
            <van-tag plain color="#EB5757" class="ml-24px leading-47px! rounded-16px!">
              {{ $t('energyPalDialog.discountTag') }}
            </van-tag>
          </div>
          <p class="m-0 text-24px/38px color-font-second">
            {{ $t('energyPalDialog.discountDesc') }}
            <span class="color-font-primary font-500">{{ 0 }} TRX ≈ $ {{ 0 }}</span>
          </p>
        </div>
      </section>
      <!-- 注意说明 -->
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
.dialog-container {
  width: 686px;
  padding: 32px 32px 48px;
  background-color: #FCFCFD;
  box-shadow: 0px 128px 128px -96px rgba(31, 47, 70, 0.12);
}
.dialog-body__title {
  margin-bottom: 12px;
  font-size: 26px;
  line-height: 42px;
  font-weight: 500;
}
.dialog-body__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  gap: 16px;
  border-radius: 24px;
  background: #F2F3F5;
}
.dialog-body__desc {
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid #FF8B20;
  background: #FFF6ED;
  font-size: 22px;
  line-height: normal;
  color: #FF8B20;
}
.dialog-body__title-sub {
  display: flex;
  align-items: center;
  font-size: 24px;
  line-height: 38px;
}
</style>
