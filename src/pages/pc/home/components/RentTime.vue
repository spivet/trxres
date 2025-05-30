<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ArrowDown from '@/assets/svg/arrow-down.svg'
import useConfigStore from '@/store/config'

const rentalTime = defineModel<number>('rentalTime', { default: 1 })
const timeType = defineModel<string>('timeType', { default: 'h1' })

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const { t } = useI18n()

// 时间单位选择
const timeUnit = ref('h1')

// 初始化时同步外部传入的值
watch(() => timeType.value, (newType) => {
  if (newType) {
    timeUnit.value = newType

    // 如果是天数类型，更新租赁时间
    if (newType.startsWith('day')) {
      const days = Number.parseInt(newType.replace('day', ''))
      if (!Number.isNaN(days)) {
        rentalTime.value = days
      }
    }
  }
}, { immediate: true })

// 所有可选的时间单位
const unitPriceList = [
  {
    label: 'm10',
    value: 'm10',
  },
  {
    label: 'h1',
    value: 'h1',
  },
  {
    label: 'h3',
    value: 'h3',
  },
  {
    label: 'day1',
    value: 'day1',
    time: 1,
  },
  ...Array.from({ length: 29 }, (_, i) => ({
    label: `day${i + 2}`,
    value: `day${i + 2}`,
    time: i + 2,
  })),
]
// 获取不同时间单位对应的价格
function getPrice(u: string, t = 1) {
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
    time,
  }
}
// 下拉选择框的选项列表
const unitPriceOptions = computed(() => {
  return unitPriceList.map((item) => {
    const { priceSun } = getPrice(item.value, item.time)
    const unit = item.time ? `${item.time} ${t('app.days')}` : t(`energyPalDialog.${item.label}`)
    return {
      name: `${unit}`,
      value: item.value,
      priceSun,
    }
  })
})

// 快捷选择按钮的选项
const rentalTimeOptions = computed(() => [
  { label: `${t('energyPalDialog.m10')}`, value: 'm10', type: 'minute' },
  { label: `${t('energyPalDialog.h1')}`, value: 'h1', type: 'hours' },
  { label: `${t('energyPalDialog.h3')}`, value: 'h3', type: 'hours' },
  { label: `${t('energyPalDialog.day1')}`, value: 'day1', type: 'days' },
])

// 通过快捷按钮修改时间类型
function handleChangeTime(item: any) {
  timeUnit.value = item.value
  timeType.value = item.value

  // 根据时间类型设置租赁时间
  if (item.type === 'days') {
    rentalTime.value = 1
  }
  else if (item.type === 'hours') {
    rentalTime.value = item.value === 'h1' ? 1 : 3
  }
  else if (item.type === 'minute') {
    rentalTime.value = 10
  }
}

// 下拉框选择修改
function handleInput() {
  timeType.value = timeUnit.value

  // 如果选择的是天数类型，更新租赁时间
  if (timeUnit.value.startsWith('day')) {
    const days = Number.parseInt(timeUnit.value.replace('day', ''))
    if (!Number.isNaN(days)) {
      rentalTime.value = days
    }
  }
  else if (timeUnit.value === 'h1') {
    rentalTime.value = 1
  }
  else if (timeUnit.value === 'h3') {
    rentalTime.value = 3
  }
  else if (timeUnit.value === 'm10') {
    rentalTime.value = 10
  }
}
</script>

<template>
  <div>
    <strong class="text-14px">{{ $t('fastTradingDialog.rentalDuration') }}</strong>
    <div class="flex-between mt-10px">
      <span
        v-for="i in rentalTimeOptions"
        :key="i.value"
        class="option-button"
        @click="handleChangeTime(i)"
      >
        {{ i.label }}
      </span>
      <el-select
        v-model="timeUnit"
        placeholder="Select"
        class="w-118px! rounded-6px!"
        size="large"
        :suffix-icon="ArrowDown"
        @change="handleInput"
      >
        <el-option v-for="item in unitPriceOptions" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
