<script setup lang="ts">
withDefaults(defineProps<{
  title: string
}>(), {
  title: '标题',
})
defineEmits(['close'])
</script>

<template>
  <div class="dialog-container">
    <div class="dialog-title">
      <span class="title-content">{{ title }}</span>
      <i class="title-icon i-icon:close-outline" @click="$emit('close')" />
    </div>

    <slot />
  </div>
</template>

<style scoped>
.dialog-container {
  width: 686px;
  padding: 32px 32px 48px;
  background-color: #FCFCFD;
  box-shadow: 0px 128px 128px -96px rgba(31, 47, 70, 0.12);
}

.dialog-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;

  .title-content {
    font-size: 34px;
    font-weight: 700;
    color: var(--kele-color-font-primary);
  }
  .title-icon {
    position: absolute;
    right: 0;
    font-size: 48px;
    cursor: pointer;
  }
}
</style>
