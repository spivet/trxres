<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface IOption {
  name: string
  value: string | number
}
defineOptions({
  name: 'PopoverSelect',
})
const props = defineProps<{
  options: IOption[]
  placeholder?: string
  customSelectClass?: string
}>()
const emits = defineEmits<{
  changed: [option: IOption]
}>()
const modelValue = defineModel<number | string | undefined>({
  required: true,
})

const boxWidth = ref('')
const selectBox = ref<HTMLElement | null>(null)

const showPopover = ref(false)
const selectedOption = computed(() => props.options.find(item => item.value === modelValue.value))
const placeValue = computed(() => {
  return selectedOption.value?.name || selectedOption.value?.value || props.placeholder
})
function onSelect(item: IOption) {
  showPopover.value = false
  modelValue.value = item.value
  emits('changed', item)
}

onMounted(() => {
  if (selectBox.value)
    boxWidth.value = `${selectBox.value.offsetWidth}px`
})
</script>

<template>
  <van-popover v-model:show="showPopover">
    <template #reference>
      <div ref="selectBox" class="select-box" :class="customSelectClass">
        <span class="select-placeholder" :class="{ 'has-value': selectedOption }">
          {{ placeValue }}
        </span>
        <van-icon name="arrow-down" color="#BDBDBD" />
      </div>
    </template>
    <ul class="select-options" :style="{ width: boxWidth }">
      <li
        v-for="item in options"
        :key="item.value"
        class="select-option"
        :class="{ selected: modelValue === item.value }"
        @click="onSelect(item)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </van-popover>
</template>

<style lang="less" scoped>
.select-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 80px;
  border-radius: 16px;
  border: 2px solid #F2F3FB;
  background: #FFF;
  cursor: pointer;
}
.select-placeholder {
  font-size: 24px;
  line-height: 1.5;
  color: var(--kele-color-placeholder);

  &.has-value {
    color: var(--kele-color-font-primary);
  }
}
.select-options {
  padding: 16px 0;
}
.select-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 32px;
  font-size: 24px;
  line-height: 1.5;
  color: var(--kele-color-font-primary);
  cursor: pointer;

  &:hover {
    color: var(--kele-color-brand);
  }

  &.selected {
    color: var(--kele-color-brand);
  }
}
</style>
