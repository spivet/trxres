<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { apiCheckSubsidy, apiSubsidy } from '@/api/index'
import useConfigStore from '@/store/config'
import useAccountStore from '@/store/account'
import { signOnTronLink } from '@/utils/wallet'
import useWallet from '@/hooks/useWallet'

const { t } = useI18n()
const { linkWallet } = useWallet()
const { address, sourceFlag } = toRefs(useAccountStore())
const { config } = toRefs(useConfigStore())

const { data: subsidyInfo, runAsync: checkSubsidy } = useRequest(apiCheckSubsidy, {
  manual: true,
})
watch(address, (newVal) => {
  if (!newVal)
    return
  checkSubsidy(address.value, sourceFlag.value)
}, { immediate: true })

// 1 usdt原价
const subsidyPrice = computed(() => {
  return (config.value?.treasureType?.[0].value / config.value?.burnEnergy) || 0
})
// 1 usdt折扣价
const subsidyDiscountPrice = computed(() => {
  return (config.value?.treasureType?.[0].value / 1e6 * config.value?.sun_10m + config.value?.lowEnergyFee) || 0
})
// 节省百分比
const savedPercent = computed(() => {
  return (((1 - subsidyDiscountPrice.value / subsidyPrice.value) * 100) || 0).toFixed(0)
})

async function receiveSubsidy() {
  const second = Date.now()
  try {
    const signed = await signOnTronLink(address.value, second)
    await apiSubsidy({
      fromAddress: address.value,
      sourceFlag: sourceFlag.value,
      timeStamp: second,
      signed,
    }, t('api.receiveSuccess'))
    checkSubsidy(address.value, sourceFlag.value)
  }
  catch (error: any) {
    if (typeof error === 'string') {
      ElMessage.error({
        message: error,
        customClass: 'whitespace-nowrap',
      })
    }
    console.error('领取失败：', error)
  }
}

async function handleReceive() {
  if (!address.value) {
    const res = await linkWallet()
    if (res)
      receiveSubsidy()
  }
  else {
    receiveSubsidy()
  }
}
</script>

<template>
  <div class="subsidy-panel">
    <div class="header">
      <span class="text-34px color-#fff font-600">{{ $t('subsidy.transSubsidy') }}</span>
      <button class="header-btn" @click="handleReceive">
        {{ $t('app.receive') }}
      </button>
    </div>
    <div class="content">
      <p class="content-title">
        {{ $t('subsidy.title') }} {{ subsidyInfo?.totalReceivedLimit }}
      </p>
      <p class="content-text">
        {{
          $t('subsidy.content', {
            monthRemain: subsidyInfo?.monthRemain,
            savedPercent,
          })
        }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.subsidy-panel {
  padding: 12px;
  border-radius: 16px;
  background: url('../images/subsidy-bg.png') center/cover no-repeat;
  box-shadow: 0px 20px 88px 0px rgba(0, 0, 0, 0.05);
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 28px;
}
.header-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 162px;
  height: 58px;
  padding: 16px 32px;
  border-radius: 32.9px;
  border: 0;
  background: #FFF736;
  box-shadow: 0px -6px 4px 0px rgba(255, 255, 255, 0.60) inset;
  font-size: 24px;
  font-weight: bold;
  color: #FD703A;
}

.content {
  padding: 24px 20px;
  border-radius: 8px;
  background: #FFF;
}
.content-title {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
  color: var(--kele-color-font-primary);
}
.content-text {
  margin-top: 8px;
  margin-bottom: 0;
  color: var(--kele-color-warning);
  font-size: 22px;
  font-style: normal;
  line-height: normal;
}
</style>
