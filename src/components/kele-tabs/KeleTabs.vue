<script setup lang="ts">
import { computed, provide, ref, watchEffect } from 'vue'
import type { ITab, KeyType, RegisterTabCallback, UnregisterTabCallback } from './types'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  tabsHeaderClass: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:modelValue'])

const tabs = ref<ITab[]>([])
const _activeKey = computed<KeyType>({
  get() {
    return props.modelValue
  },
  set(key: KeyType) {
    tabs.value.forEach((tab) => {
      tab.isActive = tab.key === key
    })
    emits('update:modelValue', key)
  },
})

function setActiveTab(key: KeyType) {
  _activeKey.value = key
}

const registerTab: RegisterTabCallback = (tab) => {
  tabs.value.push(tab)
}

const unregisterTab: UnregisterTabCallback = (key) => {
  const index = tabs.value.findIndex(t => t.key === key)
  if (index !== -1)
    tabs.value.splice(index, 1)
}

watchEffect(() => {
  tabs.value.forEach((tab) => {
    tab.isActive = tab.key === _activeKey.value
  })
})

provide('registerTab', registerTab)
provide('unregisterTab', unregisterTab)
provide('activeKey', _activeKey)
</script>

<template>
  <div class="kele-tabs">
    <div class="kele-tabs-header" :class="tabsHeaderClass">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="kele-tab" :class="[{ active: tab.isActive }]"
        @click="setActiveTab(tab.key)"
      >
        {{ tab.title }}
      </div>
    </div>
    <div class="kele-tabs-content">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.kele-tabs {
  display: flex;
  flex-direction: column;
}

.kele-tabs-header {
  display: flex;
  align-items: center;
  gap: 56px;
  padding: 20px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #DDDEE5;
}

.kele-tab {
  /* padding-bottom: 20px; */
  position: relative;
  color: var(--kele-color-font-second);
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  cursor: pointer;
}

.kele-tab.active {
  color: var(--kele-color-brand);
  /* border-bottom: 4px solid var(--kele-color-brand); */

  &::after {
    content: '';
    position: absolute;
    bottom: -23px;
    left: 4px;
    right: 4px;
    height: 4px;
    background-color: var(--kele-color-brand);
    transition: background-color 0.3s;
  }
}

.kele-tabs-content {
  flex: 1;
  overflow: hidden;
}
</style>
