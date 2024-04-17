<script setup lang="ts">
import { computed, ref } from 'vue'

interface IOption {
  name: string
  value: string | number
  [key: string]: any
}
interface IRule {
  required?: boolean
  message: string
  trigger?: 'blur' | 'change'
  pattern?: RegExp
  // 有错误返回false
  validator?: (value: string | number, rule?: IRule,) => boolean
}

defineOptions({
  name: 'KeleInput',
})
const props = defineProps<{
  type?: string // 输入框类型
  maxLength?: number // 最大长度
  max?: number // 最大值
  min?: number // 最小值
  placeholder?: string
  positiveOnly?: boolean // 是否只允许正整数
  suffix?: string
  options?: IOption[]
  rule?: IRule
}>()
const emits = defineEmits<{
  input: [value: string | number]
  select: [option: IOption]
}>()
const inputValue = defineModel<string | number>({
  required: true,
})

const inputMode = computed(() => {
  return props.positiveOnly ? 'numeric' : 'text'
})

const errMsg = ref<string | null>(null)
function validate() {
  if (props.rule) {
    const { required, message, pattern, validator } = props.rule
    if (required && !inputValue.value) {
      errMsg.value = message
      return false
    }
    if (pattern && !pattern.test(inputValue.value as string)) {
      errMsg.value = message
      return false
    }
    if (validator && !validator(inputValue.value, props.rule)) {
      errMsg.value = message
      return false
    }
  }
  errMsg.value = null
  return true
}
function handleBlur() {
  if (props.rule?.trigger === 'blur' || !props.rule?.trigger)
    validate()
}

function onInput(event: Event) {
  let value: string | number = (event.target as HTMLInputElement).value
  if (props.positiveOnly) {
    // 如果只允许正整数，则移除小数点和负数符号
    value = value.replace(/[^\d]/g, '')
    if (props.max && Number.parseInt(value) > props.max)
      value = props.max

    if (props.min && Number.parseInt(value as string) < props.min)
      value = props.min

    inputValue.value = Number.parseInt(value as string)
  }
  if (value === '') {
    // parseInt解析空字符串是NaN，需要转换为空字符串
    inputValue.value = value
  }
  emits('input', value)
}
function selectOption(option: IOption) {
  const { value } = option
  inputValue.value = props.positiveOnly ? Number.parseInt(value as string) : value
  emits('select', option)
}

defineExpose({
  validate,
})
</script>

<template>
  <div class="kele-input">
    <div class="kele-input__wrapper">
      <input
        v-model="inputValue"
        :type="type"
        :maxlength="maxLength"
        :max="max"
        :min="min"
        :inputmode="inputMode"
        :placeholder="placeholder"
        class="kele-input__inner"
        @input="onInput"
        @blur="handleBlur"
      >
      <slot name="suffix">
        <span v-if="suffix" class="ml-24px text-24px flex-shrink-0">{{ suffix }}</span>
      </slot>
    </div>
    <p v-if="errMsg" class="m-0 -mt-12px text-20px color-#f56c6c">
      {{ errMsg }}
    </p>
    <ul v-if="options?.length" class="kele-input__shortcut-list">
      <li
        v-for="option in options"
        :key="option.value"
        class="kele-input__shortcut"
        @click="selectOption(option)"
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.kele-input {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.kele-input__wrapper {
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
.kele-input__inner {
  width: 100%;
  padding: 0;
  border: none;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5;
  color: var(--kele-color-font-primary);

  &::placeholder {
    font-weight: 400;
  }
}

.kele-input__shortcut-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.kele-input__shortcut {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 16px;
  background: #FFF;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--kele-color-font-primary);
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: var(--kele-color-brand);
  }
}
</style>
