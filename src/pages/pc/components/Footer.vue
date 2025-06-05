<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getLatestBlockHeight } from '@/utils/wallet'

const latestBlockHeight = ref<number | null>(null)

onMounted(() => {
  getLatestBlockHeight().then((height) => {
    latestBlockHeight.value = height
  })
})
</script>

<template>
  <div class="footer">
    <span class="copyright">©2025 TRXRes All rights reserved.</span>
    <div v-if="latestBlockHeight" class="block-height">
      {{ $t('app.currentBlockHeight') }}: {{ latestBlockHeight }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  padding: 0 36px;
  font-size: 12px;
}

.block-height {
  display: flex;
  align-items: center;
  margin-right: 20px;

  &::before{
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(239deg, #01FF84 9%, #E73F2E 89%);
    margin-right: 10px;
  }
}
</style>
