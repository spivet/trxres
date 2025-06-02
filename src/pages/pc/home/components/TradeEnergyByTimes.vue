<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import usePayment from '@/hooks/usePayment'
import usePrice from '@/hooks/usePrice'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import { roundFloat } from '@/utils/number'
import AmountOfPay from './AmountOfPay.vue'
import ReceiveAddress from './ReceiveAddress.vue'
import TransferNumber from './TransferNumber.vue'

const { t } = useI18n()
const accountStore = useAccountStore()
const configStore = useConfigStore()

const { priceData, checkPriceLoading, checkPrice } = usePrice()
const { hasEnoughEnergy, pay, isPaying } = usePayment()

const { config } = storeToRefs(configStore)

// 转账笔数/单价/转账能量
const transferNum = ref(1)
const unitPriceType = ref('m10')
const transferTypeValue = ref()
// 计算租赁天数
const rentalDays = computed(() => {
  return unitPriceType.value.includes('day') ? +unitPriceType.value.replace('day', '') : 1
})
// 转账总能量
const totalEnergy = computed(() => {
  return transferTypeValue.value * transferNum.value || 0
})

// 接收地址
const receiverAddress = ref('')
watch(() => accountStore.address, (newAddress) => {
  receiverAddress.value = newAddress || ''
}, { immediate: true })

watch([transferNum, unitPriceType, transferTypeValue], ([newNum, newUnitPriceType, newTransferTypeValue]) => {
  if (!newNum || !newUnitPriceType || !newTransferTypeValue)
    return

  checkPrice({
    pledgeAddress: receiverAddress.value,
    pledgeTime: newUnitPriceType,
    pledgeNum: newTransferTypeValue,
  })
}, { immediate: true })

// TRX 烧毁原价
const originalTRXAmount = computed(() => {
  if (!totalEnergy.value || !config.value.burnEnergy)
    return 0

  return roundFloat(totalEnergy.value / config.value.burnEnergy * rentalDays.value, 2)
})

// 节省的TRX价格
const savedTRXAmount = computed(() => {
  if (totalEnergy.value < config.value.lowEnergyCanBuy)
    return 0

  return roundFloat(originalTRXAmount.value - priceData.value.actualPrice, 2)
})

// 约等于的美元价格
const savedUsdAmount = computed(() => {
  return roundFloat(savedTRXAmount.value * config.value.price, 2)
})
async function handlePay() {
  if (!accountStore.address || checkPriceLoading.value || isPaying.value) {
    return
  }
  if (!hasEnoughEnergy(priceData.value.actualPrice)) {
    ElMessage.error(t('energyPalDialog.notEnoughEnergy'))
    return
  }
  await pay({
    pledgeAddress: receiverAddress.value,
    pledgeNum: totalEnergy.value,
    pledgeTime: unitPriceType.value,
  })
}
</script>

<template>
  <!-- 按量租赁 -->
  <div class="trade-energy-by-amount">
    <TransferNumber
      v-model:transfer-num="transferNum"
      v-model:unit-price-type="unitPriceType"
      v-model:transfer-type-value="transferTypeValue"
      class="mb-20px"
    />

    <ReceiveAddress v-model="receiverAddress" class="mb-20px" />

    <AmountOfPay
      :price="priceData?.actualPrice"
      :loading="checkPriceLoading"
    />

    <p class="tips-box">
      <template v-if="totalEnergy < config.lowEnergyLimit">
        {{ $t('energyPalDialog.lowEnergyFee') }}
      </template>
      {{ $t('energyPalDialog.discountDesc') }}
      <span class="color-font-primary font-500">{{ savedTRXAmount }} TRX ≈ $ {{ savedUsdAmount }}</span>
    </p>

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
.tips-box {
  border-radius: 6px;
  padding: 10px;
  background: #f5f5f5;
  font-size: 12px;
  line-height: 24px;
  color: #1a1a1a;
}
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
