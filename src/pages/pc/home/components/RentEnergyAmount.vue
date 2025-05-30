<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import { toThousands } from '@/utils/utils'
import TrxInput from '@/components/trx-input/index.vue'

const rentalAmount = defineModel<number>()

const configStore = useConfigStore()
const accountStore = useAccountStore()
const { config } = storeToRefs(configStore)

const rentalAmountInputRef = ref<typeof TrxInput | null>(null)
const rentalOptions = [
  { name: '65,000', value: 65000 },
  { name: '100,000', value: 100000 },
  { name: '10,000,000', value: 10000000 },
  { name: '100,000,000', value: 100000000 },
]

function validateRentalAmount(value: string | number | undefined) {
  if (!value)
    return false
  const num = Number(value)
  if (num < 0 || num > config.value.topEnergyCanBuy)
    return false
  return true
}
function handleAddRental(value: number) {
  // 在原有值的基础上增加
  // 但是不能超过最大值
  rentalAmount.value = Math.min(config.value.topEnergyCanBuy || 1000000000, (rentalAmount.value || 0) + value)
}

defineExpose({
  validate: () => rentalAmountInputRef.value?.validate(),
})
</script>

<template>
  <div>
    <div class="input-label">
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
      :min="config.lowEnergyCanBuy"
      :max="config.topEnergyCanBuy"
      :placeholder="$t('fastTradingDialog.rentalAmountPlace')"
      :suffix="$t('app.energy')"
      :rule="{
        validator: validateRentalAmount,
        message: $t('fastTradingDialog.rentalAmountRule', {
          min: toThousands(65000),
          max: toThousands(config.topEnergyCanBuy),
        }),
      }"
    />
    <div class="flex-between mt-10px">
      <span
        v-for="i in rentalOptions"
        :key="i.value"
        class="option-button"
        @click="handleAddRental(i.value)"
      >
        +{{ i.name }}
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
}
.option-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 8px;
  background-color: #000;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #333;
  }
}
</style>
