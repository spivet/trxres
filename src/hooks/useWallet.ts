// @ts-expect-error: no types for tp-js-sdk
import tp from 'tp-js-sdk'
import { ref } from 'vue'

enum WalletType {
  TronLink = 'TronLink',
  TokenPocket = 'TokenPocket',
}

function useWallet() {
  const address = ref('')
  const walletType = ref('')
  const noExtension = ref(false)
  const errorMessage = ref('')

  // 连接到TronLink
  async function connectToTronLink() {
    if (!window.tronWeb) {
      noExtension.value = true
      return Promise.reject(new Error('TronLink not found'))
    }
    const res = await window.tronWeb.request({ method: 'tron_requestAccounts' })
    if (res.code === 200) {
      address.value = window.tronWeb.defaultAddress.base58 as string
      walletType.value = WalletType.TronLink
      return Promise.resolve(address.value)
    }
    else {
      errorMessage.value = res.message
      return Promise.reject(new Error(res.message))
    }
  }

  // 连接到TokenPocket
  async function connectToTokenPocket() {
    if (!tp.isConnected) {
      noExtension.value = true
      return Promise.reject(new Error('TokenPocket not found'))
    }
    const res = await tp.getCurrentWallet()
    address.value = res.data.address
    walletType.value = WalletType.TokenPocket
    return Promise.resolve(address.value)
  }

  // 统一处理连接请求
  function connectWallet(walletType: `${WalletType}`) {
    const walletConnectors = {
      [WalletType.TronLink]: connectToTronLink,
      [WalletType.TokenPocket]: connectToTokenPocket,
    }
    return walletConnectors[walletType]()
  }

  return {
    address,
    walletType,
    noExtension,
    errorMessage,
    connectToTronLink,
    connectWallet,
  }
}

export default useWallet
