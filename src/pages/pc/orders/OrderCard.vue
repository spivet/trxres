<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { OrderStatus } from '@/constants'
import { formatTimestamp } from '@/utils/utils.js'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})

const { t } = useI18n()

const addressBtnText = computed(() => {
  // 将hash地址转换为省略形式
  const shortAddress = props.data.fromAddress
    ? `${props.data.fromAddress.slice(0, 4)}...${props.data.fromAddress.slice(-4)}`
    : ''
  return shortAddress || t('app.connectWallet')
})

const time = computed(() => {
  const { pledgeDay, pledgeHour, pledgeMinute } = props.data
  if (pledgeDay) {
    return pledgeDay + t('app.day')
  }
  else if (pledgeHour) {
    return pledgeHour + t('app.hour')
  }
  else if (pledgeMinute) {
    return pledgeMinute + t('app.minute')
  }
  return ''
})
</script>

<template>
  <div class="order-card">
    <div class="order-card__part">
      <p>{{ $t('app.unitPrice') }}：<strong>{{ data.orderPrice }} SUN</strong></p>
      <p>{{ $t('fastTradingDialog.rentalDuration') }}：<strong>{{ time }}</strong></p>
      <p>{{ $t('fastTradingDialog.rentalAmount') }}：<strong>{{ data.pledgeNum }}</strong></p>
    </div>
    <div class="order-card__part">
      <p>{{ formatTimestamp(data.startTime) }}</p>
    </div>
    <div class="order-card__part text-center">
      <span
        class="item-value default-status"
        :class="{
          'color-warning': data.status !== OrderStatus.Invalid && data.status !== OrderStatus.Ended,
          'color-danger': data.status === OrderStatus.Invalid,
        }"
      >
        {{ t(`order.${data.status}`) }}
      </span>
    </div>
    <div class="order-card__part">
      <p class="tr">
        <strong>{{ addressBtnText }}</strong>
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.order-card {
  padding: 16px 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.order-card__part {
  flex: 1;
}

.order-card__part:first-child {
  width: 80px !important;
  flex: auto;
}

.order-card__part p {
  font-size: 12px;
  margin: 0;
  line-height: 1;
  margin: 0;
}

.order-card__part p:not(:last-child) {
  margin-bottom: 12px;
}

.order-card__part p.tr {
  text-align: right;
}
.item-value {
  font-size: 12px;
  font-weight: bold;
  color: var(--el-color-font-primary);
}
.default-status{
  color: var(--el-color-success);
}
.color-warning{
  color: var(--el-color-warning);
}
.color-danger{
  color: var(--el-color-danger);
}
</style>
