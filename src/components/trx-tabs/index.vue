<script lang="ts" setup>
import { ref, watch } from 'vue'

interface TabItem {
  key: string | number
  label: string
  icon?: string
  disabled?: boolean
  onClick?: () => boolean
}

const props = defineProps<{
  tabs: TabItem[]
  modelValue?: string | number
  defaultActiveKey?: string | number
  size?: 'normal' | 'big'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [value: string | number, oldValue: string | number]
}>()

// 当前激活的tab key
const activeKey = ref<string | number>(props.modelValue || props.defaultActiveKey || (props.tabs[0]?.key || ''))

// 切换tab
function handleTabClick(tab: TabItem) {
  if (tab.disabled)
    return

  if (tab.onClick && !tab.onClick())
    return

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
  },
)
</script>

<template>
  <div class="trx-tabs" :class="[`size-${props.size || 'normal'}`]">
    <div
      v-for="tab in props.tabs"
      :key="tab.key"
      class="trx-tab-item"
      :class="{
        active: activeKey === tab.key,
        disabled: tab.disabled,
        [`size-${props.size || 'normal'}`]: true,
      }"
      @click="handleTabClick(tab)"
    >
      <i v-if="tab.icon" :class="tab.icon" :style="{ color: activeKey === tab.key ? '#000' : '#fff' }" />
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.trx-tabs {
  display: inline-flex;
  align-items: center;
  background-color: #000;
  border-radius: 60px;
  box-sizing: border-box;

  &.size-normal {
    height: 40px;
    padding: 0 4px;
  }

  &.size-big {
    gap: 4px;
    height: 60px;
    padding: 0 5px;
  }
}

.trx-tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  gap: 10px;

  &.active {
    background-color: #fff;
    color: #000;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.size-normal {
    padding: 9px 30px;
    font-size: 14px;
    font-weight: normal;
    &.active {
      font-weight: bold;
    }
  }

  &.size-big {
    padding: 15px 53px;
    font-size: 20px;
    font-weight: bold;
  }

  &:not(.active):not(.disabled):hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
