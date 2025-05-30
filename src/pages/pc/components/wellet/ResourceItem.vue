<script setup>
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  total: {
    type: Number,
    default: 0,
  },
  used: {
    type: Number,
    default: 0,
  },
})

const lessNum = computed(() => {
  return props.total - props.used
})

const progressValue = computed(() => {
  return Math.floor((props.total - props.used) / props.total * 100)
})
</script>

<template>
  <div class="resource-item">
    <div class="flex-between">
      <span class="font-600">
        {{ title }}
      </span>
      <span>
        {{ total }}
      </span>
    </div>

    <ProgressBar :value="progressValue" />

    <div class="flex-between">
      <span>
        {{ $t('app.residue') }} {{ lessNum }}
      </span>
      <span>
        {{ $t('app.used') }} {{ used }}
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.resource-item {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 10px;
  border-radius: 10px;
  background-color: #F6F7FB;
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
  color: #000;
}
</style>
