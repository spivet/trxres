<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import flagUA from '../images/flag-ua.png'
import flagChina from '../images/flag-china.png'
import { loadLanguageAsync } from '@/i18n'
import useAccountStore from '@/store/account'
import { StatusCodes, connectWallet } from '@/utils/wallet'
import { setMeta } from '@/utils/utils'

const accountStore = useAccountStore()
const { t, locale } = useI18n()
const showLangPopover = ref(false)
const languages = [
  { name: 'English', value: 'en', icon: flagUA },
  { name: '中文', value: 'zh', icon: flagChina },
]
const currentLang = ref(languages[0])
async function onChangeLang(language: typeof languages[number]) {
  currentLang.value = language
  await loadLanguageAsync(language.value)
  setTitleAndMeta()
  showLangPopover.value = false
}
async function initLang() {
  const language = languages.find(item => item.value === locale.value)
  if (language) {
    currentLang.value = language
    await loadLanguageAsync(locale.value)
    setTitleAndMeta()
  }
}

const addressBtnText = computed(() => {
  // 将hash地址转换为省略形式
  const shortAddress = accountStore.address ? `${accountStore.address.slice(0, 6)}...${accountStore.address.slice(-4)}` : ''
  return shortAddress || t('app.connectWallet')
})

async function linkWallet() {
  const res = await connectWallet()
  if (res.code === StatusCodes.Success)
    accountStore.setAddress(res.data!)

  else if (res.code === StatusCodes.InvalidNetwork)
    ElMessage.error(t('app.invalidNetwork'))

  else if (res.code === StatusCodes.Unauthorized)
    ElMessage.error(t('app.unauthorized'))

  else if (res.code === StatusCodes.NoEnvironment)
    accountStore.setNoWallet(true)

  else ElMessage.error(res.message)
}
function unlinkWallet() {
  accountStore.setAddress('')
  accountStore.setSourceFlag('')
  accountStore.setBalance(null)
}
function goToOfficalWeb(type: 'tp' | 'tl') {
  if (type === 'tp')
    window.open('https://www.tokenpocket.pro/')

  else if (type === 'tl')
    window.open('https://www.tronlink.org/')
}

function setTitleAndMeta() {
  document.title = t('meta.title')
  setMeta('description', t('meta.description'))
  setMeta('keywords', t('meta.keywords'))
}

onMounted(() => {
  initLang()
})
</script>

<template>
  <div class="page-header">
    <div class="flex items-center">
      <span class="mr-24px">logo</span>
      <span class="text-28px font-bold color-brand">Logo Name</span>
    </div>

    <div class="header-main">
      <!-- 语言切换 -->
      <van-popover v-model:show="showLangPopover">
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
      <div v-if="!accountStore.address" class="account-box" @click="linkWallet">
        <i class="i-icon:wallet w-30px h-30px" /> {{ addressBtnText }}
      </div>
      <van-popover v-else>
        <template #reference>
          <span class="account-box">{{ addressBtnText }}</span>
        </template>
        <ul class="w-256px py-16px">
          <li class="popover-option" @click="unlinkWallet">
            <i class="i-icon:logout-outline text-40px" />
            <span class="text-26px color-#333">{{ $t('app.disconnect') }}</span>
          </li>
        </ul>
      </van-popover>
    </div>
  </div>
  <van-popup
    v-model:show="accountStore.noWallet"
    :show-confirm-button="false"
    round
    overlay-class="bg-[rgba(0,0,0,.5)]!"
    class="dialog-container"
  >
    <DialogTitle :title="$t('app.installWallet')" @close="accountStore.setNoWallet(false)" />
    <div class="flex-around my-56px">
      <div class="flex flex-col items-center" @click="goToOfficalWeb('tp')">
        <img src="../images/logo-tp.png" alt="" class="w-152px h-152px">
        <span class="text-30px font-600 mt-12px">Token Pocket</span>
      </div>
      <div class="flex flex-col items-center" @click="goToOfficalWeb('tl')">
        <img src="../images/logo-tl.png" alt="" class="w-152px h-152px">
        <span class="text-30px font-600 mt-12px">Tron Link</span>
      </div>
    </div>
    <!-- <van-button color="#4045D6" block round class="mt-32px! font-bold">
      {{ $t('app.install') }}
    </van-button> -->
  </van-popup>
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
  display: flex;
  align-items: center;
  gap: 8px;
  width: auto;
  padding: 6px 12px;
  background-color: #EEF2FF;
  border-radius: 36px;
  font-size: 24px;
  font-weight: 500;
  color: var(--kele-color-brand);
}

.dialog-container {
  width: 686px;
  padding: 32px 32px 48px;
  background-color: #FCFCFD;
  box-shadow: 0px 128px 128px -96px rgba(31, 47, 70, 0.12);
}
</style>
