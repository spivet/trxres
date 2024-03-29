<script setup lang="ts">
import useAccountStore from '@/store/account'

const accountStore = useAccountStore()
</script>

<template>
  <div class="account-panel">
    <div class="title">
      {{ $t('app.account') }}
    </div>

    <van-text-ellipsis class="account-text" :content="accountStore.address" position="middle" />
  </div>
</template>

<style scoped>
.account-panel {
  display: flex;
  padding: 24px 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 16px;
  background: #FFF;
  box-shadow: 0px 20px 120px 0px rgba(0, 0, 0, 0.02);
}
.title {
  font-size: 26px;
  font-weight: 500;
  color: var(--kele-color-font-second);
}
.account-text {
  width: 100%;
  font-size: 28px;
  font-weight: 500;
  color: var(--kele-color-font-primary);
}
</style>
