<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TrxInput from '@/components/trx-input/index.vue'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import { toThousands } from '@/utils/utils'

const rentalAmount = defineModel<number>()

const configStore = useConfigStore()
const accountStore = useAccountStore()
const { config } = storeToRefs(configStore)
const { t } = useI18n()

const rentalAmountInputRef = ref<typeof TrxInput | null>(null)
const rentalOptions = computed(() => {
  return [
    { name: t('app.65k'), value: 65000 },
    { name: t('app.100k'), value: 130000 },
    { name: t('app.1m'), value: 100000 },
    { name: t('app.1m'), value: 1000000 },
  ]
})

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
      :min="0"
      :max="config.topEnergyCanBuy"
      :placeholder="$t('fastTradingDialog.rentalAmountPlace')"
      :suffix="$t('app.energy')"
      :rule="{
        validator: validateRentalAmount,
        message: $t('fastTradingDialog.rentalAmountRule', {
          min: toThousands(config.lowEnergyCanBuy),
          max: toThousands(config.topEnergyCanBuy),
        }),
      }"
    />
    <div class="flex mt-10px">
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
  width: 80px;
  height: 40px;
  margin-right: 20px;
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
