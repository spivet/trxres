<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'
import TrxTabs from '@/components/trx-tabs/index.vue'

const { t, locale } = useI18n()
const accountStore = useAccountStore()

// 导航菜单项
const navItems = [
  { key: 'home', label: t('header.home'), path: '/', icon: 'i-icon:首页' },
  { key: 'api', label: 'API', path: '/api' },
  { key: 'help', label: t('header.help'), path: '/help' },
]

const showLanguageDropdown = ref(false)

const switchLanguage = (lang: string) => {
  locale.value = lang
  showLanguageDropdown.value = false
}

const connectWallet = async () => {
  await accountStore.connect()
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <div class="logo">
          <img src="@/assets/images/logo.png" alt="TRXRes">
        </div>
        <TrxTabs :tabs="navItems" />
      </div>
      <div class="header-right">
        <div class="language-selector" @click="showLanguageDropdown = !showLanguageDropdown" @blur="showLanguageDropdown = false">
          <i class="i-icon:language"></i>
          <div v-if="showLanguageDropdown" class="language-dropdown">
            <div class="language-option" @click="switchLanguage('zh')">
              简体中文
            </div>
            <div class="language-option" @click="switchLanguage('en')">
              English
            </div>
          </div>
        </div>
        <button v-if="!accountStore.address" class="connect-wallet" @click="connectWallet">
          {{ t('header.connectWallet') }}
        </button>
        <div v-else class="wallet-info">
          <span class="wallet-address">{{ accountStore.address.slice(0, 6) }}...{{ accountStore.address.slice(-4) }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="less" scoped>
.header {
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 40px;

  img {
    height: 32px;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.language-selector {
  position: relative;
  margin-right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  i {
    font-size: 20px;
    color: #1B2124;
  }

  .language-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 8px 0;
    z-index: 10;
    min-width: 120px;

    .language-option {
      padding: 8px 16px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}

.connect-wallet {
  background-color: #fff;
  color: #000;
  border: 0;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background-color: #2c2b2b;
    color: #fff;
  }
}

.wallet-info {
  display: flex;
  align-items: center;

  .wallet-address {
    background-color: #f2f3f5;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    color: #1B2124;
  }
}
</style>
