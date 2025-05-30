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
  validator?: (value: string | number | undefined, rule?: IRule,) => boolean
}

defineOptions({
  name: 'TrxInput',
})
const props = defineProps<{
  type?: string // 输入框类型
  disabled?: boolean // 是否禁用
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
  change: [value: string | number]
}>()
const inputValue = defineModel<string | number | undefined>({
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

function onChange(event: Event) {
  let value: string | number = (event.target as HTMLInputElement).value
  if (props.positiveOnly) {
    // 如果只允许正整数，则移除小数点和负数符号
    value = value.replace(/\D/g, '')
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

defineExpose({
  validate,
})
</script>

<template>
  <div class="kele-input">
    <div class="kele-input__wrapper" :class="{ 'kele-input__wrapper--error': errMsg }">
      <input
        v-model="inputValue"
        :type="type"
        :maxlength="maxLength"
        :max="max"
        :min="min"
        :inputmode="inputMode"
        :placeholder="placeholder"
        :disabled="disabled"
        class="kele-input__inner"
        :class="{ 'kele-input__inner--disabled': disabled }"
        @input="onChange"
        @blur="handleBlur"
      >
      <slot name="suffix">
        <span v-if="suffix" class="suffix-text">{{ suffix }}</span>
      </slot>
    </div>
    <p v-if="errMsg" class="error-text">
      {{ errMsg }}
    </p>
  </div>
</template>

<style lang="less" scoped>
.kele-input {
  display: flex;
  flex-direction: column;
}
.kele-input__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-radius: 10px;
  border: 1px solid #F6F7FB;
  background: #F6F7FB;
}
.kele-input__wrapper--error {
  border-color: #E73F2E;
}
.kele-input__inner {
  width: 100%;
  height: 48px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1;
  font-weight: 600;
  color: var(--kele-color-font-primary);

  &::placeholder {
    font-weight: 400;
    color: #aaaaaa;
  }
}
.kele-input__inner--disabled {
  cursor: not-allowed;
  color: #767676;
}
.suffix-text {
  flex-shrink: 0;
  margin-left: 15px;
  font-size: 14px;
  font-weight: 600;
  color: var(--kele-color-font-primary);
}
.error-text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1;
  color: #E73F2E;
}
</style>
