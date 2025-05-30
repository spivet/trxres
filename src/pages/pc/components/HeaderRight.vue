<script lang="ts" setup>
import useAccountStore from '@/store/account'
import LanguageChange from './LanguageChange.vue'

const emit = defineEmits(['connect', 'openWallet'])

const accountStore = useAccountStore()
async function connectWallet() {
  emit('connect')
}
function openWallet() {
  emit('openWallet')
}
</script>

<template>
  <div class="header-right">
    <LanguageChange />
    <button v-if="!accountStore.address" class="button connect-wallet" @click="connectWallet">
      {{ $t('app.connectWallet') }}
    </button>
    <button v-else class="button wallet-info" @click="openWallet">
      {{ accountStore.address.slice(0, 4) }}...{{ accountStore.address.slice(-4) }}
    </button>
  </div>
</template>

<style scoped lang="less">
.header-right {
  display: flex;
  align-items: center;
  position: absolute;
  right: 36px;
}

.button {
  border: 0;
  border-radius: 9px;
  padding: 9px 24px;
  margin-left: 30px;
  font-size: 18px;
  font-weight: bold;
  line-height: 22px;
  cursor: pointer;

}
.connect-wallet {
  background-color: #fff;
  color: #000;

  &:hover {
    background-color: #2c2b2b;
    color: #fff;
  }
}

.wallet-info {
  background-color: #000;
  color: #fff;
}
</style>
