<script setup>
defineProps({
  value: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="progress-bar">
    <span class="progress-bar-inner" :style="{ width: `${value}%` }" />
  </div>
</template>

<style lang="less" scoped>
.progress-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 10px;
  border-radius: 5px;
  background-color: #bbbbbb;
}

.progress-bar-inner {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 5px;
  background-color: #000000;
}
</style>
