<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import DialogTitle from '@/components/dialog-custom/DialogTitle.vue'
import KeleInput from '@/components/kele-input/index.vue'
import PopoverSelect from '@/components/popover-select/index.vue'
import useConfigStore from '@/store/config'
import useAccountStore from '@/store/account'
import usePayment from '@/hooks/usePayment'
import { toThousands } from '@/utils/utils'

const visible = defineModel('visible', {
  type: Boolean,
  default: false,
})

const { t } = useI18n()
const accountStore = useAccountStore()
const configStore = useConfigStore()
const { hasEnoughEnergy, pay, isPaying } = usePayment()

const { config, treasureType } = storeToRefs(configStore)
// 转账类型
const transferTypeOptions = computed(() => {
  return treasureType.value.map((item) => {
    return {
      name: t(`energyPalDialog.${item.type}`),
      value: item.value,
    }
  })
})
const selectedTransferEnergy = ref()
watch(treasureType, (newTreasure) => {
  if (newTreasure)
    selectedTransferEnergy.value = newTreasure[0].value
})
// 转账笔数数
const transferNum = ref(1)
// 接收地址
const receiverAddress = ref('')
watch(() => accountStore.address, (newAddress) => {
  receiverAddress.value = newAddress
}, { immediate: true })

// 单价选项
const unitPriceList = [{
  label: 'm10',
  value: 'm10',
}, {
  label: 'h1',
  value: 'h1',
}, {
  label: 'h3',
  value: 'h3',
}, {
  label: 'day1',
  value: 'day1',
}, {
  label: 'day2',
  value: 'day2',
  time: 2,
}, {
  label: 'day3',
  value: 'day3',
  time: 3,
}, {
  label: 'day4',
  value: 'day4',
  time: 4,
}, {
  label: 'day5',
  value: 'day5',
  time: 5,
}, {
  label: 'day6',
  value: 'day6',
  time: 6,
}, {
  label: 'day7',
  value: 'day7',
  time: 7,
}, {
  label: 'day8',
  value: 'day8',
  time: 8,
}, {
  label: 'day9',
  value: 'day9',
  time: 9,
}, {
  label: 'day10',
  value: 'day10',
  time: 10,
}, {
  label: 'day11',
  value: 'day11',
  time: 11,
}, {
  label: 'day12',
  value: 'day12',
  time: 12,
}, {
  label: 'day13',
  value: 'day13',
  time: 13,
}, {
  label: 'day14',
  value: 'day14',
  time: 14,
}, {
  label: 'day15',
  value: 'day15',
  time: 15,
}, {
  label: 'day16',
  value: 'day16',
  time: 16,
}, {
  label: 'day17',
  value: 'day17',
  time: 17,
}, {
  label: 'day18',
  value: 'day18',
  time: 18,
}, {
  label: 'day19',
  value: 'day19',
  time: 19,
}, {
  label: 'day20',
  value: 'day20',
  time: 20,
}, {
  label: 'day21',
  value: 'day21',
  time: 21,
}, {
  label: 'day22',
  value: 'day22',
  time: 22,
}, {
  label: 'day23',
  value: 'day23',
  time: 23,
}, {
  label: 'day24',
  value: 'day24',
  time: 24,
}, {
  label: 'day25',
  value: 'day25',
  time: 25,
}, {
  label: 'day26',
  value: 'day26',
  time: 26,
}, {
  label: 'day27',
  value: 'day27',
  time: 27,
}, {
  label: 'day28',
  value: 'day28',
  time: 28,
}, {
  label: 'day29',
  value: 'day29',
  time: 29,
}, {
  label: 'day30',
  value: 'day30',
  time: 30,
}]
const unitPriceOptions = computed(() => {
  return unitPriceList.map((item) => {
    const { priceRtx, priceSun } = getPrice(item.value, item.time)
    const unit = item.time ? `${item.time} ${t('app.days')}` : t(`energyPalDialog.${item.label}`)
    return {
      name: `${t('app.unitPrice')} ${priceRtx}TRX / ${unit}`,
      value: item.value,
      priceRtx,
      priceSun,
    }
  })
})

// 单价
const unitPriceType = ref('m10')
const unitPriceTRX = computed(() => {
  return unitPriceOptions.value.find(item => item.value === unitPriceType.value)?.priceRtx || 0
})
const rentalDays = computed(() => {
  return unitPriceType.value.includes('day') ? +unitPriceType.value.replace('day', '') : 1
})

// 转账能量
const totalEnergy = computed(() => {
  return selectedTransferEnergy.value * transferNum.value
})
const actualPrice = computed(() => {
  const basePrice = unitPriceTRX.value * transferNum.value
  const lowEnergyFee = totalEnergy.value < 65e3 && transferNum.value ? config.value.lowEnergyFee : 0
  return +(basePrice + lowEnergyFee).toFixed(6) || 0
})

// 节省的RTX价格
const savedPrice = computed(() => {
  return +(selectedTransferEnergy.value * transferNum.value * rentalDays.value / config.value.burnEnergy - actualPrice.value).toFixed(2) || 0
})
// 约等于的美元价格
const savedUsdPrice = computed(() => {
  return +(savedPrice.value * config.value.price).toFixed(2) || 0
})

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
    priceRtx: +(selectedTransferEnergy.value / 1e6 * priceSun * time).toFixed(6) || 0,
  }
}
function resetForm() {
  transferNum.value = 1
  receiverAddress.value = accountStore.address
  unitPriceType.value = 'm10'
  selectedTransferEnergy.value = treasureType.value[0].value
}
async function handlePay() {
  if (!hasEnoughEnergy(actualPrice.value)) {
    ElMessage.error(t('energyPalDialog.notEnoughEnergy'))
    return
  }
  await pay({
    pledgeAddress: receiverAddress.value || accountStore.address,
    pledgeNum: totalEnergy.value,
    pledgeDay: unitPriceType.value.includes('day') ? rentalDays.value : 0,
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
    :z-index="1000"
    @closed="resetForm"
  >
    <DialogTitle :title="$t('energyPalDialog.title')" @close="visible = false" />
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
        <div id="pa" class="dialog-body__title-sub">
          {{ $t('energyPalDialog.transTimes') }}
          <el-tooltip effect="dark" placement="bottom" :z-index="1001">
            <i class="i-icon:question-outline ml-8px" />
            <template #content>
              <div class="text-22px w-380px">
                {{ $t('energyPalDialog.transDesc') }}
              </div>
            </template>
          </el-tooltip>
        </div>
        <div class="flex items-center">
          <KeleInput v-model="transferNum" positive-only class="w-160px" />
          <span class="mx-16px text-24px">{{ $t('energyPalDialog.times') }} x</span>
          <PopoverSelect v-model="unitPriceType" :options="unitPriceOptions" custom-select-class="w-350px" />
        </div>
        <PopoverSelect v-model="selectedTransferEnergy" :options="transferTypeOptions" />
        <i18n-t keypath="energyPalDialog.transResult" tag="div" class="text-24px/38px color-font-second">
          <template #result>
            <span class="color-function-danger">{{ toThousands(selectedTransferEnergy) }}</span>
          </template>
        </i18n-t>
        <!-- 接收地址 -->
        <div class="dialog-body__title-sub">
          {{ $t('app.receiver') }}
        </div>
        <KeleInput v-model="receiverAddress" :placeholder="$t('fastTradingDialog.receiverPlace')" />
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
          <span class="color-function-danger mr-12px">{{ actualPrice }}</span>
          TRX
          <van-tag plain color="#EB5757" class="ml-24px leading-47px! rounded-16px!">
            {{ $t('energyPalDialog.discountTag') }}
          </van-tag>
        </div>
        <p class="m-0 text-24px/38px color-font-second">
          <template v-if="totalEnergy < 65e3">
            {{ $t('energyPalDialog.lowEnergyFee') }}
          </template>
          {{ $t('energyPalDialog.discountDesc') }}
          <span class="color-font-primary font-500">{{ savedPrice }} TRX ≈ $ {{ savedUsdPrice }}</span>
        </p>
      </div>
    </section>
    <!-- 注意说明 -->
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
</style>
