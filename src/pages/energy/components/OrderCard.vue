<script setup lang="ts">
defineProps({
  time: String,
})
</script>

<template>
  <div class="order-panel">
    <div class="order-header">
      <span class="">{{ time }}</span>
      <slot name="order-tag" />
    </div>
    <div class="split-line" />
    <div class="order-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.order-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0px;
  border-radius: 24px;
  border: 2px solid #F2F3FB;
  background-color: #fff;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  font-size: 26px;
  line-height: 1.5;
  color: var(--kele-color-font-second);
}

.split-line {
  height: 1px;
  background-color: #E7E8F0;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 32px;
}
</style>
