<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TradeStuffTypes } from '@/constants'

interface TabItem {
  label: string
  value: string
}

const { t } = useI18n()
const modelValue = defineModel()

const tabItems = computed(() => {
  return [
    { label: t('app.energy'), value: TradeStuffTypes.ENERGY },
    { label: t('app.bandwidth'), value: TradeStuffTypes.BAND },
  ]
})

function isActive(tab: TabItem) {
  return tab.value === modelValue.value
}

function updateValue(tab: TabItem) {
  modelValue.value = tab.value
}
</script>

<template>
  <div class="trade-tabs">
    <span class="trade-tab" :class="{ active: isActive(tabItems[0]) }" @click="updateValue(tabItems[0])">
      {{ tabItems[0].label }}
    </span>
    <span class="trade-tab" :class="{ active: isActive(tabItems[1]) }" @click="updateValue(tabItems[1])">
      {{ tabItems[1].label }}
    </span>
  </div>
</template>

<style lang="less" scoped>
.trade-tabs {
  display: inline-flex;
  align-items: center;
}

.trade-tab {
  padding: 11px 32px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  background-color: #000;

  &:first-child {
    border-top-left-radius: 10px;
  }

  &:last-child {
    margin-left: -16px;
    border-top-right-radius: 10px;
  }

  &:first-child.active {
    background: url('../images/tab1.png') no-repeat right center #fff;
    opacity: 1;
    z-index: 1;
  }

  &:last-child.active {
    background: url('../images/tab2.png') no-repeat left center #fff;
    opacity: 1;
    z-index: 1;
  }

  &.active {
    color: #000;
  }
}
</style>
