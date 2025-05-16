<script lang="ts" setup>
import { ref, watch } from 'vue'

interface TabItem {
  key: string | number
  label: string
  icon?: string
  disabled?: boolean
}

const props = defineProps<{
  tabs: TabItem[]
  modelValue?: string | number
  defaultActiveKey?: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number, oldValue: string | number]
}>()

// 当前激活的tab key
const activeKey = ref<string | number>(props.modelValue || props.defaultActiveKey || (props.tabs[0]?.key || ''))

// 切换tab
const handleTabClick = (tab: TabItem) => {
  if (tab.disabled) return

  const oldValue = activeKey.value
  activeKey.value = tab.key
  emit('update:modelValue', tab.key)
  emit('change', tab.key, oldValue)
}

// 监听modelValue变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined && newValue !== activeKey.value) {
      activeKey.value = newValue
    }
  }
)
</script>

<template>
  <div class="trx-tabs">
    <div
      v-for="tab in props.tabs"
      :key="tab.key"
      class="trx-tab-item"
      :class="{ 'active': activeKey === tab.key, 'disabled': tab.disabled }"
      @click="handleTabClick(tab)"
    >
      <i v-if="tab.icon" :class="tab.icon"></i>
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.trx-tabs {
  display: inline-flex;
  align-items: center;
  background-color: #000;
  border-radius: 100px;
  padding: 4px;
  box-sizing: border-box;
}

.trx-tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 52px;
  border-radius: 100px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  gap: 8px;

  i {
    font-size: 18px;
  }

  &.active {
    background-color: #fff;
    color: #000;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(.active):not(.disabled):hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
