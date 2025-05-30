<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useWallet from '@/hooks/useWallet'

const { getLatestBlockHeight } = useWallet()

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

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 36px;
}
</style>
