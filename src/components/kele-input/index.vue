<script setup lang="ts">
defineOptions({
  name: 'KeleInput',
})
const props = defineProps<{
  placeholder?: string
  positiveOnly?: boolean // 是否只允许正整数
  suffix?: string
  options?: (string | number)[]
}>()
const inputValue = defineModel<string | number>({
  required: true,
})

function onInput(event: Event) {
  let value: string | number = (event.target as HTMLInputElement).value
  if (props.positiveOnly) {
    // 如果只允许正整数，则移除小数点和负数符号
    value = value.replace(/[^\d]/g, '')
    inputValue.value = Number.parseInt(value)
  }
  if (value === '') {
    // parseInt解析空字符串是NaN，需要转换为空字符串
    inputValue.value = value
  }
}
function selectOption(option: string | number) {
  inputValue.value = props.positiveOnly ? Number.parseInt(option as string) : option
}
</script>

<template>
  <div class="kele-input">
    <div class="kele-input__wrapper">
      <input
        v-model="inputValue"
        :placeholder="placeholder"
        class="kele-input__inner"
        @input="onInput"
      >
      <slot name="suffix">
        <span v-if="suffix" class="ml-24px text-24px flex-shrink-0">{{ suffix }}</span>
      </slot>
    </div>
    <ul v-if="options?.length" class="kele-input__shortcut-list">
      <li
        v-for="option in options"
        :key="option"
        class="kele-input__shortcut"
        @click="selectOption(option)"
      >
        {{ option }}
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
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
.kele-input__shortcut {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--kele-color-font-primary);
  border-radius: 16px;
  background: #FFF;
  cursor: pointer;

  &:hover {
    color: var(--kele-color-brand);
  }
}
</style>
