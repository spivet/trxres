<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { apiCheckSubsidy, apiSubsidy } from '@/api/index'
import useAccountStore from '@/store/account'
import { signOnTronLink } from '@/utils/wallet'

const { t } = useI18n()
const { address } = toRefs(useAccountStore())

const { data: subsidyInfo, runAsync: checkSubsidy } = useRequest(apiCheckSubsidy, {
  manual: true,
})
watch(address, (newVal) => {
  if (!newVal)
    return
  checkSubsidy(address.value)
}, { immediate: true })
const canReceive = computed(() => {
  return !subsidyInfo.value?.isReceived && subsidyInfo.value?.remaining && subsidyInfo.value?.monthRemain && subsidyInfo.value?.monthIPRemain
})
async function receiveSubsidy() {
  const second = Date.now()
  try {
    const signed = await signOnTronLink(address.value, second)
    await apiSubsidy({
      fromAddress: address.value,
      sourceFlag: '',
      timeStamp: second,
      signed,
    }, t('api.receiveSuccess'))
    checkSubsidy(address.value)
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
</script>

<template>
  <div class="subsidy-panel">
    <div class="header">
      <span class="text-34px color-#fff font-600">{{ $t('subsidy.transSubsidy') }}</span>
      <button v-if="canReceive" class="header-btn" @click="receiveSubsidy">
        {{ $t('app.receive') }}
      </button>
    </div>
    <div class="content">
      <p class="content-title">
        {{ $t('subsidy.title') }}
      </p>
      <p class="content-text">
        {{ $t('subsidy.content') }}
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
