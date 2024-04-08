<script setup lang="ts">
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { computed, toRefs } from 'vue'
import DialogContainer from '@/components/dialog-custom/DialogContainer.vue'
import { OrderStatus } from '@/constants'
import { openAddressDetail, openHashDetail } from '@/utils/utils'

const props = defineProps<{
  data: API.IOrderItem
}>()
const visible = defineModel('visible', {
  type: Boolean,
  required: true,
})

const { t } = useI18n()
const { data } = toRefs(props)
const pledgeDuration = computed(() => {
  return data.value.pledgeDay ? `${data.value.pledgeDay}${t('app.day')}` : data.value.pledgeHour ? `${data.value.pledgeHour}${t('app.hour')}` : `${data.value.pledgeMinute}${t('app.minute')}`
})
</script>

<template>
  <van-popup
    v-model:show="visible"
    :show-confirm-button="false"
    round
    overlay-class="bg-[rgba(0,0,0,.5)]!"
    class="dialog-container"
  >
    <DialogContainer :title="$t('app.orderDetail')" @close="visible = false">
      <ul class="detail-list">
        <li class="detail-item">
          <span class="item-label">{{ $t('app.orderNo') }}</span>
          <span class="item-value">{{ data.orderId }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.time') }}</span>
          <span class="item-value">{{ dayjs(data.startTime * 1000).format('YYYY-MM-DD HH:mm') }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.orderStatus') }}</span>
          <span
            class="item-value"
            :class="{
              'color-function-warning!': data.status !== OrderStatus.Invalid && data.status !== OrderStatus.Ended,
              'color-function-danger!': data.status === OrderStatus.Invalid,
            }"
          >
            {{ t(`order.${data.status}`) }}
          </span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.unitPrice') }}</span>
          <span class="item-value">{{ data.orderPrice }} SUN</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('fastTradingDialog.rentalDuration') }}</span>
          <span class="item-value">{{ pledgeDuration }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('fastTradingDialog.rentalAmount') }}</span>
          <span class="item-value">{{ data.pledgeNum }}</span>
        </li>
        <li class="detail-item" @click="openAddressDetail(data.pledgeAddress)">
          <span class="item-label">{{ $t('app.receiver') }}</span>
          <van-text-ellipsis class="item-value color-brand!" :content="data.pledgeAddress" position="middle" />
        </li>
        <li v-if="data.pledgeHash" class="detail-item" @click="openHashDetail(data.pledgeHash)">
          <span class="item-label">{{ $t('app.leaseHash') }}</span>
          <van-text-ellipsis class="item-value" :content="data.pledgeHash" position="middle" />
        </li>
      </ul>
    </DialogContainer>
    <!-- <DialogTitle :title="$t('fastTradingDialog.title')" @close="visible = false" /> -->
  </van-popup>
</template>

<style scoped>
.detail-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 32px;
  margin-top: 32px;
  gap: 24px;
  border-radius: 24px;
  background: #F2F3F5;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  line-height: 40px;
  color: var(--kele-color-font-second);
}
.item-value {
  width: 400px;
  font-weight: 500;
  text-align: right;
  color: var(--kele-color-font-primary);
}
</style>
