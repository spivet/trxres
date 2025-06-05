<script lang="ts" setup>
import { useWallet } from '@tronweb3/tronwallet-adapter-vue-hooks'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import usePayment from '@/hooks/usePayment'
import usePrice from '@/hooks/usePrice'
import useConfigStore from '@/store/config'
import { roundFloat } from '@/utils/number'
import AmountOfPay from './AmountOfPay.vue'
import ReceiveAddress from './ReceiveAddress.vue'
import RentEnergyAmount from './RentEnergyAmount.vue'
import RentTime from './RentTime.vue'
import ResultOfEnergyAmount from './ResultOfEnergyAmount.vue'

const { t } = useI18n()

const { address } = useWallet()

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const { priceData, checkPriceLoading, checkPrice } = usePrice()
const { pay, isPaying, hasEnoughEnergy } = usePayment()

// 接收地址
const receiverAddress = ref('')
watch(address, (newAddress) => {
  receiverAddress.value = newAddress || ''
}, { immediate: true })

// 租赁数量
const rentalAmount = ref()
// 租赁时长
const rentalTime = ref('h1')
// 监听数量和时长变化，获取价格
watch([rentalAmount, rentalTime], ([newAmount, newUnitPriceType]) => {
  if (!newAmount || !newUnitPriceType)
    return

  checkPrice({
    pledgeAddress: receiverAddress.value,
    pledgeTime: newUnitPriceType,
    pledgeNum: newAmount,
  })
})

// 计算租赁天数
const rentalDays = computed(() => {
  return rentalTime.value.includes('day')
    ? +rentalTime.value.replace('day', '')
    : 1
})

// 获取单价（SUN）
const unitPriceSun = computed(() => {
  return getPrice(rentalTime.value).priceSun
})

function getPrice(u: string) {
  let priceSun = 0
  let time = 1

  switch (u) {
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
      time = Number(u.replace('day', '')) || 1
  }

  return {
    priceSun,
    priceRtx: rentalAmount.value ? +(rentalAmount.value / 1e6 * priceSun * time).toFixed(6) : 0,
  }
}

// TRX 烧毁原价
const originalTRXAmount = computed(() => {
  if (!rentalAmount.value || !config.value.burnEnergy)
    return 0

  return roundFloat(rentalAmount.value / config.value.burnEnergy * rentalDays.value, 2)
})

// TRX 烧毁原价约等于的美元价格
const orginalUsdAmount = computed(() => {
  return roundFloat(originalTRXAmount.value * config.value.price, 2)
})

// 节省的TRX价格
const savedTRXAmount = computed(() => {
  if (rentalAmount.value < config.value.lowEnergyCanBuy)
    return 0

  return roundFloat(originalTRXAmount.value - Number(priceData.value.actualPrice), 2)
})

// 节省的 TRX 百分比
const savedTRXPercent = computed(() => {
  if (rentalAmount.value < config.value.lowEnergyCanBuy)
    return 0

  return roundFloat((savedTRXAmount.value / originalTRXAmount.value) * 100, 0)
})

// 约等于的美元价格
const savedUsdAmount = computed(() => {
  return roundFloat(savedTRXAmount.value * config.value.price, 2)
})

// 开始支付
const rentalAmountRef = ref()
async function handlePay() {
  const pass = rentalAmountRef.value?.validate()
  if (!pass) {
    return
  }

  if (checkPriceLoading.value) {
    return
  }

  if (!hasEnoughEnergy(priceData.value.actualPrice)) {
    ElMessage.error(t('energyPalDialog.notEnoughEnergy'))
    return
  }

  await pay({
    pledgeAddress: receiverAddress.value,
    pledgeNum: rentalAmount.value,
    pledgeTime: rentalTime.value,
  })
}
</script>

<template>
  <!-- 按量租赁 -->
  <div class="trade-energy-by-amount">
    <RentEnergyAmount ref="rentalAmountRef" v-model="rentalAmount" class="mb-20px" />
    <RentTime v-model:time-type="rentalTime" class="mb-20px" />
    <ReceiveAddress v-model="receiverAddress" class="mb-20px" />

    <AmountOfPay
      :price="priceData?.actualPrice"
      :loading="checkPriceLoading"
    />

    <ResultOfEnergyAmount
      :original-trx-amount="originalTRXAmount"
      :original-usd-amount="orginalUsdAmount"
      :unit-price-sun="unitPriceSun"
      :saved-trx-percent="savedTRXPercent"
      :saved-trx-amount="savedTRXAmount"
      :saved-usd-amount="savedUsdAmount"
    />

    <el-button
      :loading="isPaying"
      :disabled="isPaying"
      class="btn-pay"
      size="large"
      type="success"
      style="width: 100%"
      @click="handlePay"
    >
      {{ $t('energyPalDialog.pay') }}
    </el-button>
  </div>
</template>

<style lang="less" scoped>
.btn-pay {
  height: 54px !important;
  margin-top: 60px;
  background-color: #05E18C;
  border: none;
  border-radius: 10px;
  font-size: 18px;

  &:hover {
    background-color: #16ec99;
  }
}
</style>
