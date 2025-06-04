import { WalletConnectionError } from '@tronweb3/tronwallet-abstract-adapter'
import {
  TokenPocketAdapter,
  TronLinkAdapter,
} from '@tronweb3/tronwallet-adapters'
import { ElMessage } from 'element-plus'
import { TronWeb } from 'tronweb'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import useOrderStore from '@/store/orders'

/**
 * 钱包类型枚举
 */
export enum WalletType {
  TronLink = 'TronLink',
  TokenPocket = 'TokenPocket',
}

// 网络类型定义
export enum NetworkType {
  Mainnet = 'Mainnet',
  Shasta = 'Shasta',
  Nile = 'Nile',
  Unknown = 'Unknown',
}

// 网络信息接口
export interface Network {
  networkType: NetworkType
  chainId: string
  fullNode: string
  solidityNode: string
  eventServer: string
}

const StorageKey = {
  WalletType: 'walletType',
}
let adapter: TokenPocketAdapter | TronLinkAdapter | null = null

function useWallet() {
  const { t } = useI18n()
  const accountStore = useAccountStore()
  const configStore = useConfigStore()
  const orderStore = useOrderStore()

  // Reactive state
  const isConnecting = ref(false)

  // 事件处理函数
  const onAddressChanged = (newAddress: string | null) => {
    accountStore.setAddress(newAddress)
    configStore.getConfig(newAddress || undefined)
    accountStore.queryBalance()
    orderStore.getLatestHistory()
  }

  // 移除事件监听并重置适配器
  function cleanup() {
    if (!adapter)
      return

    adapter.removeAllListeners()
    adapter = null
  }

  // 连接到选定的钱包
  async function connect(name: WalletType) {
    try {
      isConnecting.value = true

      // 根据钱包类型创建对应的适配器
      if (name === WalletType.TronLink) {
        const tronLinkAdapter = new TronLinkAdapter({
          openUrlWhenWalletNotFound: true,
          checkTimeout: 3000,
        })
        // 设置事件监听
        tronLinkAdapter.on('connect', onAddressChanged)
        tronLinkAdapter.on('accountsChanged', onAddressChanged)
        adapter = tronLinkAdapter

        // 如果钱包已连接，直接设置地址
        if (tronLinkAdapter.connected) {
          onAddressChanged(tronLinkAdapter.address)
          // 记录当前使用的钱包类型
          localStorage.setItem(StorageKey.WalletType, name)
          return
        }

        await tronLinkAdapter.connect()
      }
      else if (name === WalletType.TokenPocket) {
        const tokenPocketAdapter = new TokenPocketAdapter()
        adapter = tokenPocketAdapter
        // 设置事件监听
        // 注意：TokenPocket 移动端App在切换账户时会自动刷新页面，所以不需要监听 accountsChanged 事件
        tokenPocketAdapter.on('connect', onAddressChanged)
        tokenPocketAdapter.on('accountsChanged', onAddressChanged)

        // 如果钱包已连接，直接设置地址
        if (tokenPocketAdapter.connected) {
          onAddressChanged(tokenPocketAdapter.address)
          // 记录当前使用的钱包类型
          localStorage.setItem(StorageKey.WalletType, name)
          return
        }

        await tokenPocketAdapter.connect()
      }

      // 记录当前使用的钱包类型
      localStorage.setItem(StorageKey.WalletType, name)
    }
    catch (err: any) {
      console.error('[useWallet] connect error', err)
      if (err instanceof WalletConnectionError)
        ElMessage.error(t('app.walletConnectionError'))
      else ElMessage.error(err.message)
    }
    finally {
      isConnecting.value = false
    }
  }

  // 断开当前钱包连接
  async function disconnect() {
    if (!adapter)
      return

    try {
      // 注意：TronLink不支持通过DApp断开连接，但我们仍然调用此方法保持API一致性
      await adapter.disconnect()
      cleanup()
      accountStore.setAddress(null)
      accountStore.setBalance(null)
      localStorage.removeItem(StorageKey.WalletType)
    }
    catch (err: any) {
      console.error('[useWallet] disconnect error', err)
      ElMessage.error(err.message)
    }
  }

  // 签名消息
  async function signMessage(message: string): Promise<string | null> {
    if (!adapter) {
      ElMessage.error(t('app.walletNotConnected'))
      return null
    }

    try {
      return await adapter.signMessage(message)
    }
    catch (err: any) {
      ElMessage.error(err.message)
      return null
    }
  }

  // 签名交易
  async function signTransaction(transaction: any): Promise<any> {
    if (!adapter) {
      ElMessage.error(t('app.walletNotConnected'))
      return null
    }

    try {
      return await adapter.signTransaction(transaction)
    }
    catch (err: any) {
      ElMessage.error(err.message)
      return null
    }
  }

  // 获取最新区块高度
  async function getLatestBlockHeight() {
    try {
      const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
      })
      const block = await tronWeb.trx.getCurrentBlock()
      return block.block_header.raw_data.number
    }
    catch (err: any) {
      ElMessage.error(err.message)
      return null
    }
  }

  // 自动连接上次使用的钱包
  function autoConnect() {
    const savedWalletType = localStorage.getItem(StorageKey.WalletType) as WalletType | null
    if (savedWalletType === WalletType.TronLink) {
      // TronLink 立即触发连接，否则会被 TP 拦截
      connect(WalletType.TronLink)
    }
    else if (savedWalletType === WalletType.TokenPocket) {
      // TokenPocket 钱包初始化会有延迟，所以需要延迟连接，否则会报错
      setTimeout(() => {
        connect(WalletType.TokenPocket)
      }, 600)
    }
  }

  return {
    // 状态
    adapter,
    isConnecting,
    // 操作
    connect,
    autoConnect,
    disconnect,
    signMessage,
    signTransaction,
    getLatestBlockHeight,
  }
}

export default useWallet
