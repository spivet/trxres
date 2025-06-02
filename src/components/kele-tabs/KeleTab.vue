<script setup lang="ts">
import type { Ref } from 'vue'
import type { KeyType, RegisterTabCallback, UnregisterTabCallback } from './types'
import { computed, getCurrentInstance, inject, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const instance = getCurrentInstance()
const key = computed(() => instance?.vnode.key as KeyType)

const registerTab = inject<RegisterTabCallback>('registerTab')
const unregisterTab = inject<UnregisterTabCallback>('unregisterTab')
const activeKey = inject<Ref<KeyType>>('activeKey')
const isActive = computed(() => activeKey?.value === key.value)

onMounted(() => {
  registerTab?.({
    key: key.value,
    title: props.title,
    isActive: isActive.value,
  })
})

onUnmounted(() => {
  unregisterTab?.(key.value)
})
</script>

<template>
  <div v-show="isActive" class="kele-tab">
    <slot />
  </div>
</template>

<style scoped>
.kele-tab {
  /* 单个Tab的样式 */
}
</style>
