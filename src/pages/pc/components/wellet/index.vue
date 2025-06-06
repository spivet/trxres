<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { useWallet } from '@tronweb3/tronwallet-adapter-vue-hooks'
import { useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import tokenpoketLogo from '@/assets/images/tp-logo.png'
import tronlinkLogo from '@/assets/images/tronlink-logo.png'
import trx from '@/assets/images/trx.png'
import usdt from '@/assets/images/usdt-logo.png'
import useAccountStore from '@/store/account'
import { getShortAddress, isTokenPocketEnv } from '@/utils/wallet'
import LanguageChange from '../LanguageChange.vue'
import BalanceItem from './BalanceItem.vue'
import ResourceItem from './ResourceItem.vue'

const emit = defineEmits(['unlink'])

const { connected, address, disconnect } = useWallet()
const accountStore = useAccountStore()

const { trxBalanceToUsdt, balance } = storeToRefs(accountStore)
const { copy, copied } = useClipboard()

const sourceFlagAvatar = ref(tronlinkLogo)

function closeWelletConnect() {
  disconnect()
  emit('unlink')
}

watch(connected, () => {
  if (isTokenPocketEnv()) {
    sourceFlagAvatar.value = tokenpoketLogo
  }
}, { immediate: true })
</script>

<template>
  <div class="wallet">
    <div class="flex-between mb-24px">
      <div class="user">
        <img class="user__avatar" :src="sourceFlagAvatar" alt="">
        <span class="user__address">
          {{ getShortAddress(address || '') }}
        </span>
        <i v-if="!copied" class="i-icon:copy cursor-pointer" @click="() => copy(address || '')" />
        <el-icon v-else>
          <Check />
        </el-icon>
      </div>
      <LanguageChange />
    </div>

    <div class="wallet-content">
      <!-- 代币余额 -->
      <div class="">
        <div class="item-title">
          {{ $t('app.tokenBalance') }}
        </div>
        <ul class="flex flex-col gap-20px">
          <li class="item">
            <BalanceItem
              :src="trx" title="TRX"
              :address="balance?.address"
              :amount="balance?.trxBalance"
              totle-value=""
              :avaible-amount="balance?.balance.TRX"
              :usdt-value="trxBalanceToUsdt"
            />
          </li>
          <li class="item">
            <BalanceItem
              :src="usdt" title="Tether USD(USDT)"
              :amount="balance?.usdtBalance"
              :address="address || ''"
              chain="TRC20"
            />
          </li>
        </ul>
      </div>

      <!-- 资源 -->
      <div class="mt-30px">
        <div class="item-title">
          {{ $t('app.resource') }}
        </div>
        <ul class="flex flex-col gap-10px">
          <li class="item">
            <ResourceItem :title="$t('app.energy')" :total="balance?.energyTotal" :used="balance?.energyUsed" />
          </li>
          <li class="item">
            <ResourceItem :title="$t('app.bandwidth')" :total="balance?.netTotal" :used="balance?.netUsed" />
          </li>
        </ul>
      </div>

      <el-button size="large" class="offline-button" @click="closeWelletConnect">
        {{ $t('app.disconnect') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wallet {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.user {
  display: flex;
  column-gap: 10px;
  align-items: center;

  .user__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f2f2f2;
  }

  .user__address {
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    margin: 0;
  }
}

.wallet-content {
  flex: 1;
  overflow-y: auto;
}

.item-title {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 10px;
}

.offline-button {
  width: 100%;
  margin-top: 50px;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: #EA0000;
  color: #fff;
}
</style>
