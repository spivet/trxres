<script setup lang="ts">
import { AdapterState } from '@tronweb3/tronwallet-abstract-adapter'
import { useWallet } from '@tronweb3/tronwallet-adapter-vue-hooks'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { WalletType } from '@/utils/wallet'

// 定义事件
const visible = defineModel<boolean>()

const { t } = useI18n()

// 初始化钱包 hook
const { wallets, wallet, connecting, connect, select } = useWallet()

// 可选择的钱包列表常量
const walletOptions = computed(() => wallets.value.map(wallet => ({
  name: wallet.adapter.name,
  icon: wallet.adapter.icon,
})))

const hasTokenPocket = computed(() => {
  const tpWallet = wallets.value.find(wallet => wallet.adapter.name === WalletType.TokenPocket)
  return tpWallet?.state !== AdapterState.NotFound && tpWallet?.state !== AdapterState.Loading
})

// 可选择的钱包列表常量
// const walletOptions = computed(() => [
//   {
//     name: WalletType.TokenPocket,
//     icon: tpLogo,
//   },
//   {
//     name: WalletType.TronLink,
//     icon: tlLogo,
//   },
// ])

// 当前选中的钱包
const selectedWallet = ref<{
  name: string
  icon: string
} | null>(null)

/**
 * 选择钱包
 */
async function selectWallet(wallet: any) {
  selectedWallet.value = wallet
  await select(wallet.name)
}

/**
 * 连接钱包
 */

const buttonText = computed(() => {
  if (connecting.value)
    return t('app.connecting')
  return t('app.connectWallet')
})
async function connectWallet() {
  await connect()
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="$t('app.connectWallet')"
    width="290px"
    :show-close="false"
    :close-on-click-modal="true"
    :center="true"
    class="wallet-connect-dialog"
    destroy-on-close
  >
    <div class="container">
      <div class="options">
        <div
          v-for="walletOption in walletOptions"
          :key="walletOption.name"
          class="option"
          :class="{ active: wallet?.adapter.name === walletOption.name }"
          @click="selectWallet(walletOption)"
        >
          <img :src="walletOption.icon" :alt="walletOption.name" class="icon">
          {{ walletOption.name }}
        </div>
      </div>
      <el-button
        type="primary"
        class="btn-connect"
        :loading="connecting"
        @click="connectWallet"
      >
        {{ buttonText }}
      </el-button>
      <div v-if="wallet?.adapter.name === WalletType.TronLink && hasTokenPocket" class="install-tip">
        {{ t('app.tpHijackTl') }}
      </div>
    </div>
  </el-dialog>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.options {
  display: flex;
  justify-content: space-around;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 96px;
  padding: 10px 0 8px;
  border-radius: 8px;
  font-size: 12px;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.option:hover {
  background-color: #F6F7FB;
}

.option.active {
  background-color: #F6F7FB;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.btn-connect {
  width: 100%;
  height: 44px;
  margin-top: 24px;
  margin-bottom: 8px;
  border-radius: 8px;
  font-size: 16px;
  background-color: #000;
  border-color: #000;
}

.btn-connect:hover {
  background-color: #333;
  border-color: #333;
}

.install-tip {
  font-size: 12px;
  color: #EA0000;
  text-align: center;
}
</style>

<style lang="less">
.wallet-connect-dialog {
  &.el-dialog {
    border-radius: 12px;
    overflow: hidden;
  }
  .el-dialog__header {
    margin: 0;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
}
</style>
