<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TrxInput from '@/components/trx-input/index.vue'
import usePayment from '@/hooks/usePayment'
import usePrice from '@/hooks/usePrice'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import { roundFloat } from '@/utils/number'
import { toThousands } from '@/utils/utils'
import AmountOfPay from './AmountOfPay.vue'
import ReceiveAddress from './ReceiveAddress.vue'
import RentTime from './RentTime.vue'

const MinBandWidth = 1000
const MaxBandWidth = 10000000

const { t } = useI18n()

const accountStore = useAccountStore()

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const { priceData, checkPriceLoading, checkPrice } = usePrice()
const { pay, isPaying, hasEnoughEnergy } = usePayment()

// 接收地址
const receiverAddress = ref('')
watch(() => accountStore.address, (newAddress) => {
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
    pledgeBandwidthNum: newAmount,
    pledgeNum: config.value.lowEnergyCanBuy,
  })
})

// 计算租赁天数
const rentalDays = computed(() => {
  return rentalTime.value.includes('day')
    ? +rentalTime.value.replace('day', '')
    : 1
})

// TRX 烧毁原价
const originalTRXAmount = computed(() => {
  if (!rentalAmount.value || !config.value.netPrice)
    return 0

  return roundFloat(rentalAmount.value * config.value.netPrice * rentalDays.value / 1e6, 2)
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
const rentalAmountInputRef = ref<typeof TrxInput | null>(null)
async function handlePay() {
  const pass = rentalAmountInputRef.value?.validate()
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
    pledgeBandwidthNum: rentalAmount.value,
    pledgeNum: config.value.lowEnergyCanBuy,
    pledgeTime: rentalTime.value,
  })
}

function validateRentalAmount(value: string | number | undefined) {
  if (!value)
    return false
  const num = Number(value)
  if (num < 0 || num > config.value.topEnergyCanBuy)
    return false
  return true
}
</script>

<template>
  <!-- 按量租赁 -->
  <div class="trade-energy-by-amount">
    <div class="flex-between text-14px mb-10px">
      <strong>{{ $t('fastTradingDialog.rentalAmount') }}</strong>
      <span>
        {{ $t('app.balance') }}：
        <strong>
          {{ accountStore.balance ? toThousands(accountStore.balance.trxBalance) : 0 }} RTX
        </strong>
      </span>
    </div>

    <TrxInput
      ref="rentalAmountInputRef"
      v-model="rentalAmount"
      positive-only
      type="tel"
      :min="0"
      :max="MaxBandWidth"
      :placeholder="$t('bandwidth.rentalAmountPlace')"
      :suffix="$t('app.bandwidth')"
      :rule="{
        validator: validateRentalAmount,
        message: $t('bandwidth.rentalAmountRule', {
          min: toThousands(MinBandWidth),
          max: toThousands(MaxBandWidth),
        }),
      }"
    />
    <RentTime v-model:time-type="rentalTime" class="my-20px" />
    <ReceiveAddress v-model="receiverAddress" class="mb-20px" />

    <AmountOfPay
      :price="priceData?.actualPrice"
      :loading="checkPriceLoading"
    />

    <div class="tips-box">
      <p>{{ t('app.note') }}</p>
      <p>{{ $t('bandwidth.bandwidthNote') }}</p>
    </div>

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

.tips-box {
  border-radius: 6px;
  padding: 10px;
  background: #f5f5f5;
  font-size: 12px;
  line-height: 20px;
  color: #767676;
}
</style>
