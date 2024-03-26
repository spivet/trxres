<script setup lang="ts">
withDefaults(defineProps<{
  title: string
}>(), {
  title: '标题',
})
defineEmits(['close'])
</script>

<template>
  <div class="dialog-title">
    <span class="title-content">{{ title }}</span>
    <i class="title-icon i-icon:close-outline" @click="$emit('close')" />
  </div>
</template>

<style lang="less" scoped>
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
