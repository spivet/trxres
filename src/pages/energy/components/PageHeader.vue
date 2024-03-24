<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import flagUA from '../images/flag-ua.png'
import flagChina from '../images/flag-china.png'
import { loadLanguageAsync } from '@/i18n'

const { t } = useI18n()
const showLangPopover = ref(false)
const languages = [
  { name: 'English', value: 'en', icon: flagUA },
  { name: '中文', value: 'zh', icon: flagChina },
]
const currentLang = ref(languages[0])
function onChangeLang(language: typeof languages[number]) {
  currentLang.value = language
  loadLanguageAsync(language.value)
  showLangPopover.value = false
}

const showAccountPopover = ref(false)
const account = ref('')
const addressBtnText = computed(() => {
  return account.value ? account.value : t('app.connectWallet')
})
async function linkWallet() {
  if (window.tronWeb)
    account.value = window.tronWeb.defaultAddress.base58
}
linkWallet()
</script>

<template>
  <div class="page-header">
    <div class="flex items-center">
      <span class="mr-24px">logo</span>
      <span class="text-28px font-bold color-brand">Logo Name</span>
    </div>

    <div class="header-main">
      <!-- 语言切换 -->
      <van-popover v-model:show="showLangPopover" :actions="languages">
        <template #reference>
          <van-image :src="currentLang.icon" class="block w-48px h-48px" round />
        </template>
        <ul class="w-256px py-16px">
          <li
            v-for="item in languages"
            :key="item.value"
            class="popover-option"
            @click="onChangeLang(item)"
          >
            <van-image :src="item.icon" class="w-40px h-40px" round />
            <span class="text-26px color-#333">{{ item.name }}</span>
          </li>
        </ul>
      </van-popover>

      <!-- 账户地址 -->
      <div v-if="!account" class="account-box">
        {{ addressBtnText }}
      </div>
      <van-popover v-else v-model:show="showAccountPopover">
        <template #reference>
          <van-text-ellipsis class="account-box" :content="addressBtnText" position="middle" />
        </template>
        <ul class="w-256px py-16px">
          <li class="popover-option">
            <i class="i-icon:logout-outline text-40px" />
            <span class="text-26px color-#333">{{ 'item.value' }}</span>
          </li>
        </ul>
      </van-popover>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 124px;
  padding: 0 40px;
  background-color: #fff;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 24px;

  &:deep(.van-popover__wrapper) {
    display: flex;
    align-items: center;
  }
}
.popover-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
}

.account-box {
  width: 200px;
  padding: 6px 12px;
  background-color: #EEF2FF;
  border-radius: 36px;
  font-size: 23px;
  font-weight: 500;
  color: var(--kele-color-brand);
}
</style>
