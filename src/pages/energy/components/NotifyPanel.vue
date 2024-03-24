<script setup lang="ts">
import { ref } from 'vue'

const showPanel = ref(true)
</script>

<template>
  <div v-if="showPanel" class="notify-panel">
    <i class="i-icon:close-fill close-icon" @click="showPanel = false" />

    <ul class="notify-list">
      <li class="notify-item">
        {{ $t('notice.earning') }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.notify-panel {
  position: relative;
  padding: 8px;
  border-radius: 16px;
  background: #FFF;
}
.close-icon {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 10;
  width: 32px;
  height: 32px;
}
.notify-list {
  height: 190px;
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, #FFF4EA 0%, #FFFAF4 95.72%);
}
.notify-item {
  height: 100%;
  overflow: auto;
  white-space: pre-wrap;
  font-size: 22px;
  line-height: 1.5;
  color: var(--kele-color-warning);
}
</style>
