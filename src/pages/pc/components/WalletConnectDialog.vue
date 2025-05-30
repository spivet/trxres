<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import tpLogo from '@/assets/images/tokenPoket.png'
import tlLogo from '@/assets/images/tronLink.png'
import useWallet, { WalletType } from '@/hooks/useWallet'

// 定义事件
const emit = defineEmits(['connect', 'close', 'walletChange'])

// 使用 defineModel 替代 modelValue 和 update:modelValue
const visible = defineModel<boolean>()

const { t } = useI18n()

// 初始化钱包 hook
const {
  isConnecting,
  connect,
  tronLinkAvailable,
  tokenPocketAvailable,
} = useWallet()

// 可选择的钱包列表常量
const walletOptions = computed(() => [
  {
    id: WalletType.TokenPocket,
    name: 'TokenPocket',
    icon: tpLogo,
    isInstall: tokenPocketAvailable.value,
  },
  {
    id: WalletType.TronLink,
    name: 'TronLink',
    icon: tlLogo,
    isInstall: tronLinkAvailable.value,
  },
])

// 当前选中的钱包
const selectedWallet = ref<{
  id: WalletType
  name: string
  icon: string
  isInstall: boolean
} | null>(null)

/**
 * 选择钱包
 */
function selectWallet(wallet: any) {
  selectedWallet.value = wallet
  emit('walletChange', wallet)
}

/**
 * 连接钱包
 */

const buttonText = computed(() => {
  if (isConnecting.value)
    return t('app.connecting')
  return t('app.connectWallet')
})
async function connectWallet() {
  if (!selectedWallet.value)
    return

  if (!selectedWallet.value.isInstall) {
    openOfficialWebsite(selectedWallet.value.id)
    return
  }

  try {
    await connect(selectedWallet.value.id)
    visible.value = false
    ElMessage.success(t('app.connectSuccess'))
  }
  catch (err) {
    ElMessage.error(t('app.connectFailed'))
  }
}

/**
 * 打开钱包官网
 */
function openOfficialWebsite(type: WalletType) {
  if (type === WalletType.TokenPocket)
    window.open('https://www.tokenpocket.pro/')
  else if (type === WalletType.TronLink)
    window.open('https://www.tronlink.org/')
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
          v-for="wallet in walletOptions"
          :key="wallet.id"
          class="option"
          :class="{ active: selectedWallet?.id === wallet.id }"
          @click="selectWallet(wallet)"
        >
          <img :src="wallet.icon" :alt="wallet.name" class="icon">
          {{ wallet.name }}
        </div>
      </div>
      <el-button
        type="primary"
        class="btn-connect"
        :loading="isConnecting"
        @click="connectWallet"
      >
        {{ buttonText }}
      </el-button>
      <div v-if="selectedWallet && !selectedWallet.isInstall" class="install-tip">
        {{ `${selectedWallet.name} ${t('app.noWallet')}` }}
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
  margin-top: 12px;
  font-size: 12px;
  color: #999;
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

