<script setup lang="ts">
import DialogContainer from '@/components/dialog-custom/DialogContainer.vue'

const visible = defineModel('visible', {
  type: Boolean,
  required: true,
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
    <DialogContainer :title="$t('fastTradingDialog.title')" @close="visible = false">
      <ul class="detail-list">
        <li class="detail-item">
          <span class="item-label">{{ $t('app.orderNo') }}</span>
          <span class="item-value">{{ }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.time') }}</span>
          <span class="item-value">{{ }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.orderStatus') }}</span>
          <span class="item-value">{{ }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.unitPrice') }}</span>
          <span class="item-value">{{ }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('fastTradingDialog.rentalDuration') }}</span>
          <span class="item-value">{{ }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('fastTradingDialog.rentalAmount') }}</span>
          <span class="item-value">{{ }}</span>
        </li>
        <li class="detail-item">
          <span class="item-label">{{ $t('app.receiver') }}</span>
          <van-text-ellipsis class="item-value" content="accousdf234234234snt" position="middle" />
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
  font-size: 26px;
  line-height: 40px;
  color: var(--kele-color-font-second);
}
.item-value {
  width: 400px;
  font-weight: 500;
  text-align: right;
}
</style>
