<script lang="ts" setup>
import { useWallet } from '@tronweb3/tronwallet-adapter-vue-hooks'
import { getShortAddress } from '@/utils/wallet'
import LanguageChange from './LanguageChange.vue'

const emit = defineEmits(['connect', 'openWallet'])

const { address } = useWallet()

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
    <button v-if="!address" class="button connect-wallet" @click="connectWallet">
      {{ $t('app.connectWallet') }}
    </button>
    <button v-else class="button wallet-info" @click="openWallet">
      {{ getShortAddress(address, 4) }}
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
