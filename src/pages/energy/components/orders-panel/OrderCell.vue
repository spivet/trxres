<script setup lang="ts">
defineProps({
  label: String,
  value: [String, Number],
})
</script>

<template>
  <div class="order-cell">
    <span class="order-label">{{ label }}: </span>
    <slot name="value">
      <span class="order-value">{{ value }}</span>
    </slot>
  </div>
</template>

<style scoped>
.order-cell {
  display: flex;
  align-items: center;
  font-size: 24px;
  line-height: 1.5;
  white-space: break-spaces;
}
.order-label {
  color: var(--kele-color-font-second);
  font-weight: 400;
}
.order-value {
  color: var(--kele-color-font-primary);
  font-weight: 600;
}
</style>
