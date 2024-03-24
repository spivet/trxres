<script setup lang="ts">
defineProps({
  name: String,
  icon: String,
})
</script>

<template>
  <div class="action-button">
    <img :src="icon" alt="" class="button-icon">
    <span class="button-text">{{ name }}</span>
  </div>
</template>

<style scoped>
.action-button {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  background: #FFF;
  box-shadow: 0px 20px 120px 0px rgba(0, 0, 0, 0.02);
}
.button-icon {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}
.button-text {
  font-size: 28px;
  color: var(--kele-color-font-primary);
  font-weight: 600;
  line-height: 1.5;
}
</style>
