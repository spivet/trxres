<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import DialogTitle from '@/components/dialog-custom/DialogTitle.vue'
import KeleInput from '@/components/kele-input/index.vue'
import useConfigStore from '@/store/config'
import useAccountStore from '@/store/account'
import usePayment from '@/hooks/usePayment'

const visible = defineModel('visible', {
  type: Boolean,
  default: false,
})

const { t } = useI18n()
const accountStore = useAccountStore()
const configStore = useConfigStore()
const { pay, isPaying } = usePayment()

const { config } = storeToRefs(configStore)

// 租用量
const rentalOptions = [
  { name: '32,000', value: 32000 },
  { name: '100,000', value: 100000 },
  { name: '10,000,000', value: 10000000 },
]
const rentalAmount = ref(32000)

// 租用时间
const rentalTimeOptions = computed(() => [
  { name: `${t('energyPalDialog.m10')}`, value: 10, type: 'm10' },
  { name: `${t('energyPalDialog.h1')}`, value: 1, type: 'h1' },
  { name: `${t('energyPalDialog.h3')}`, value: 3, type: 'h3' },
  { name: `${t('energyPalDialog.day1')}`, value: 1, type: 'day1' },
  { name: `3 ${t('app.days')}`, value: 3, type: 'day3' },
])
const selectedRentalOption = ref(rentalTimeOptions.value[1])
const rentalTime = ref(1)
// 单价
const unitPriceType = ref('h1')
const unitPriceRtx = computed(() => {
  return getPrice(unitPriceType.value, rentalTime.value).priceRtx
})
const unitPriceSun = computed(() => {
  return getPrice(unitPriceType.value, rentalTime.value).priceSun
})
const unit = computed(() => {
  return unitPriceType.value.includes('day') ? t('app.days') : t(`energyPalDialog.${unitPriceType.value}`).replace(/\d/g, '')
})

function handleSelectRental(option: any) {
  selectedRentalOption.value = option
  unitPriceType.value = option.type
  rentalTime.value = option.value
}
function handleInputRental(value: number | string) {
  rentalTime.value = Number(value) || 1
  unitPriceType.value = `day${value}`
}
function changeRentalTime(step: number) {
  if (unitPriceType.value.includes('day')) {
    // 最小值为1，最大值为30
    if (rentalTime.value + step > 0 && rentalTime.value + step <= 30)
      rentalTime.value += step

    unitPriceType.value = `day${rentalTime.value}`
  }
  else {
    rentalTime.value = 1
    unitPriceType.value = `day1`
  }
}

// 转账能量
const actualPrice = computed(() => {
  const basePrice = unitPriceRtx.value
  const lowEnergyFee = rentalAmount.value < 65e3 ? config.value.lowEnergyFee : 0
  return +(basePrice + lowEnergyFee).toFixed(6) || 0
})

// 节省的RTX价格
const savedPrice = computed(() => {
  return +(rentalAmount.value / config.value.burnEnergy - actualPrice.value).toFixed(2)
})
// 约等于的美元价格
const savedUsdPrice = computed(() => {
  return +(savedPrice.value * config.value.price).toFixed(2)
})

function getPrice(type: string, t = 1) {
  let priceSun = 0
  let time = 1

  switch (type) {
    case 'm10':
      priceSun = config.value.sun_10m || 0
      break
    case 'h1':
      priceSun = config.value.sun_1h || 0
      break
    case 'h3':
      priceSun = config.value.sun_3h || 0
      break
    case 'day1':
      priceSun = config.value.sun_1d || 0
      break
    case 'day2':
      priceSun = config.value.sun_2d || 0
      time = 2
      break
    // day3及以后的价格
    default:
      priceSun = config.value.defaultEnergyPrice || 0
      time = t
  }

  return {
    priceSun,
    priceRtx: +(rentalAmount.value / 1e6 * priceSun * time).toFixed(6),
  }
}
async function handlePay() {
  await pay({
    pledgeAddress: accountStore.address,
    pledgeNum: rentalAmount.value,
    pledgeDay: unitPriceType.value.includes('day') ? rentalTime.value : 0,
    pledgeHour: unitPriceType.value === 'h1' ? 1 : unitPriceType.value === 'h3' ? 3 : 0,
    pledgeMinute: unitPriceType.value.includes('m') ? 10 : 0,
  })
  visible.value = false
}
</script>

<template>
  <van-popup
    v-model:show="visible"
    :show-confirm-button="false"
    round
    overlay-class="bg-[rgba(0,0,0,.5)]!"
    class="dialog-container"
  >
    <DialogTitle :title="$t('fastTradingDialog.title')" @close="visible = false" />
    <!-- 租用量 -->
    <section class="mb-20px">
      <div class="dialog-body__title">
        {{ $t('fastTradingDialog.rentalAmount') }}
      </div>
      <div class="dialog-body__content">
        <KeleInput
          v-model="rentalAmount"
          positive-only
          type="tel"
          :min="10000"
          :max="1000000000"
          :placeholder="$t('fastTradingDialog.rentalAmountPlace')"
          :options="rentalOptions"
          :suffix="$t('app.energy')"
        />
      </div>
    </section>
    <!-- 租用时间 -->
    <section class="mb-20px">
      <div class="dialog-body__title">
        {{ $t('fastTradingDialog.rentalDuration') }}
      </div>
      <div class="dialog-body__content">
        <KeleInput
          :model-value="rentalTime"
          positive-only
          :placeholder="$t('fastTradingDialog.rentalDurationPlace')"
          :options="rentalTimeOptions"
          :max="30"
          @select="handleSelectRental"
          @input="handleInputRental"
        >
          <template #suffix>
            <div class="step-suffix">
              <span class="text-22px whitespace-nowrap">
                {{ unit }}
              </span>
              <van-icon class="step-button" size="14px" name="minus" @click="changeRentalTime(-1)" />
              <van-icon class="step-button" size="14px" name="plus" @click="changeRentalTime(1)" />
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
        <KeleInput v-model="accountStore.address" :placeholder="$t('fastTradingDialog.receiverPlace')" />
      </div>
    </section>
    <!-- 支付金额 -->
    <section class="mb-20px">
      <div class="dialog-body__title justify-between">
        {{ $t('fastTradingDialog.money') }}
        <span class="">{{ actualPrice }} TRX</span>
      </div>
      <div class="dialog-body__desc">
        {{ $t('fastTradingDialog.moneyDesc', {
          unitPrice: unitPriceSun,
          lowFee: rentalAmount < 65e3 ? $t('energyPalDialog.lowEnergyFee') : '',
          savedPercent: '10%',
          savedPrice,
          savedUsdPrice,
        }) }}
      </div>
    </section>
    <!-- 填写需求 -->
    <p class="text-20px/32px color-#4F4F4F">
      {{ $t('energyPalDialog.note') }}
    </p>
    <van-button color="#4045D6" block round class="mt-32px! font-bold" :loading="isPaying" @click="handlePay">
      {{ $t('energyPalDialog.pay') }}
    </van-button>
  </van-popup>
</template>

<style lang="less" scoped>
@import './common.less';

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
