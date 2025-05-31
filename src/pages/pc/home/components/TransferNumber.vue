<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ArrowDown from '@/assets/svg/arrow-down.svg'
import { rentalTimeList } from '@/config'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import { toThousands } from '@/utils/utils'

const configStore = useConfigStore()
const accountStore = useAccountStore()
const { config, treasureType } = storeToRefs(configStore)
const { t } = useI18n()

// 转账笔数
const transferNum = defineModel<number>('transferNum')

// 单价
const unitPriceType = defineModel<string>('unitPriceType', { default: 'm10' })
const unitPriceOptions = computed(() => {
  return rentalTimeList.map((item) => {
    const { priceRtx, priceSun } = getUnitPrice(item.value, item.time)
    const unit = item.time ? `${item.time} ${t('app.days')}` : t(`energyPalDialog.${item.label}`)
    return {
      name: `${t('app.unitPrice')} ${priceRtx}TRX / ${unit}`,
      value: item.value,
      priceRtx,
      priceSun,
    }
  })
})

// 转账类型
const transferTypeValue = defineModel<number>('transferTypeValue', { default: 0 })
watch(treasureType, (newTreasure) => {
  if (newTreasure)
    transferTypeValue.value = newTreasure[0]?.value ?? 0
}, { immediate: true })
const transferTypeOptions = computed(() => {
  return treasureType.value.map((item) => {
    return {
      name: t(`energyPalDialog.${item.type}`),
      value: item.value,
    }
  })
})

function getUnitPrice(u: string, t = 1) {
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
      time = t
  }

  return {
    priceSun,
    priceRtx: +(transferTypeValue.value / 1e6 * priceSun * time).toFixed(6) || 0,
  }
}
</script>

<template>
  <div class="form-line-group">
    <div class="input-label">
      <strong>{{ $t('energyPalDialog.transTimes') }}</strong>
      <span>
        {{ $t('app.balance') }}：
        <strong>
          {{ accountStore.balance ? toThousands(accountStore.balance.trxBalance) : 0 }} RTX
        </strong>
      </span>
    </div>

    <div class="flex-between">
      <el-input-number
        v-model="transferNum"
        :min="1"
        size="large"
        :controls="false"
        class="w-100px! rounded-6px!"
      />
      <span class="mx-10px text-18px font-500 color-#000">{{ $t("energyPalDialog.times") }} x</span>
      <el-select
        v-model="unitPriceType"
        size="large"
        class="flex-1 rounded-6px!"
        placeholder="Select"
        :suffix-icon="ArrowDown"
      >
        <el-option v-for="item in unitPriceOptions" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
    </div>
    <div class="mt-20px">
      <el-select
        v-model="transferTypeValue"
        size="large"
        placeholder="Select"
        :suffix-icon="ArrowDown"
        style="width: 100%"
      >
        <el-option v-for="item in transferTypeOptions" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>

      <p class="text-12px color-#767676 mt-10px">
        {{ $t("energyPalDialog.transResult", { result: transferTypeValue }) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
