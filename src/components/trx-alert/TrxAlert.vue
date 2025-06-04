<script setup lang="ts">
import type { AlertOptions } from './types'
import { computed, ref } from 'vue'
import errorIcon from './images/icon-error.png'
import successIcon from './images/icon-success.png'
import warningIcon from './images/icon-warning.png'

const props = defineProps<AlertOptions>()

const emit = defineEmits(['confirm', 'close'])

const visible = ref(true)

// 根据类型获取对应图标
const iconSrc = computed(() => {
  switch (props.type) {
    case 'success':
      return successIcon
    case 'error':
      return errorIcon
    case 'warning':
      return warningIcon
    default:
      return successIcon
  }
})

// 确认按钮点击事件
function handleConfirm() {
  visible.value = false
  emit('confirm')
  emit('close')
}

// 自动关闭
if (props.duration !== 0) {
  setTimeout(() => {
    visible.value = false
    emit('close')
  }, props.duration || 3000)
}

// 暴露方法
defineExpose({
  close: () => {
    visible.value = false
    emit('close')
  },
})
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="trx-modal">
      <div class="trx-alert">
        <div class="trx-alert__content">
          <img class="trx-alert__icon" :src="iconSrc" alt="alert icon">
          <p class="trx-alert__message" :class="`trx-alert__message--${type}`">
            {{ message }}
          </p>
        </div>
        <button class="trx-alert__button" @click="handleConfirm">
          {{ $t('app.confirm') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="less" scoped>
.trx-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 9998;
}

.trx-alert {
  width: 280px;
  padding: 32px 15px 24px 15px;
  margin: 15vh auto 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}

.trx-alert__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.trx-alert__icon {
  width: 48px;
  height: 48px;
  margin-bottom: 10px;
}

.trx-alert__message {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0;
  word-break: break-word;

  &--success {
    color: #73C74A;
  }

  &--error {
    color: #E73F2E;
  }

  &--warning {
    color: #F9C014;
  }
}

.trx-alert__button {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: #000;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #333;
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
