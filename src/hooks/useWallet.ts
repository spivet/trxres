import {
  TokenPocketAdapter,
  TronLinkAdapter,
} from '@tronweb3/tronwallet-adapters'
import { ElMessage } from 'element-plus'
import { TronWeb } from 'tronweb'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'
import useConfigStore from '@/store/config'
import useOrderStore from '@/store/orders'

type IWalletAdapter = TokenPocketAdapter | TronLinkAdapter

/**
 * 钱包类型枚举
 */
export enum WalletType {
  TronLink = 'TronLink',
  TokenPocket = 'TokenPocket',
}

// 钱包就绪状态
enum WalletReadyState {
  /**
   * 适配器将在创建实例后开始检查钱包是否存在
   */
  Loading = 'Loading',
  /**
   * 检查结束且未找到钱包时，readyState 将为 NotFound
   */
  NotFound = 'NotFound',
  /**
   * 检查结束且找到钱包时，readyState 将为 Found
   */
  Found = 'Found',
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

// 链信息接口
interface ChainInfo {
  chainId: string
}

const StorageKey = {
  WalletType: 'walletType',
}
// 选择适配器实例
let adapter: IWalletAdapter | null = null

function useWallet() {
  const { t } = useI18n()
  const accountStore = useAccountStore()
  const configStore = useConfigStore()
  const orderStore = useOrderStore()

  // Reactive state
  const address = ref<string | null>(null)
  const chainId = ref<string | null>(null)
  const network = ref<Network | null>(null)
  const isReady = ref(false)
  const isConnecting = ref(false)
  const isConnected = computed(() => !!address.value)
  const error = ref<Error | null>(null)

  watch(address, (newAddress) => {
    accountStore.setAddress(newAddress)
    accountStore.queryBalance()
    orderStore.getLatestHistory()
    if (newAddress) {
      configStore.getConfig(newAddress, accountStore.sourceFlag)
    }
    console.log('address changed', newAddress)
  }, { immediate: true })

  // 适配器配置
  const tronLinkConfig = {
    openUrlWhenWalletNotFound: true,
    checkTimeout: 30000, // 30秒
    openTronLinkAppOnMobile: true,
    dappName: document.title,
  }

  const tokenPocketConfig = {
    openUrlWhenWalletNotFound: true,
  }

  // 初始化适配器
  const tronLinkAdapter = new TronLinkAdapter(tronLinkConfig)
  const tokenPocketAdapter = new TokenPocketAdapter(tokenPocketConfig)

  // 检查钱包是否可用
  // 注意：不要监听 readyStateChanged，只要有 TokenPocket, TronLink 就会变成 Found 状态
  const tronLinkAvailable = ref<boolean>(tronLinkAdapter.readyState === WalletReadyState.Found)
  const tokenPocketAvailable = ref<boolean>(tokenPocketAdapter.readyState === WalletReadyState.Found)

  function selectAdapter(name: WalletType) {
    cleanup()
    const adapters = {
      [WalletType.TronLink]: tronLinkAdapter,
      [WalletType.TokenPocket]: tokenPocketAdapter,
    }
    adapter = adapters[name]
    return adapter
  }

  // 连接到选定的钱包
  async function connect(name: WalletType) {
    try {
      error.value = null
      isConnecting.value = true

      adapter = selectAdapter(name)
      if (!adapter) {
        throw new Error(`${name} wallet not support`)
      }

      // 检查钱包是否已安装
      if (adapter.readyState !== WalletReadyState.Found) {
        const errorMessage = `${name} ${t('app.noWallet')}`
        ElMessage.error(errorMessage)
        throw new Error(errorMessage)
      }

      // 请求连接账户
      await adapter.connect()
      // 更新状态
      address.value = adapter.address
      accountStore.setAddress(adapter.address)

      // 获取网络信息
      try {
        // 注意：TokenPocket和TronLink都支持network()方法
        const networkInfo = await adapter.network()
        network.value = networkInfo
        chainId.value = networkInfo.chainId
        console.log('networkInfo', networkInfo)
      }
      catch (netErr) {
        console.warn('[useWallet] get network error', netErr)
      }

      // 设置事件监听
      setupListeners(adapter)
      isReady.value = true

      // 记录当前使用的钱包类型
      localStorage.setItem(StorageKey.WalletType, name)

      return {
        address: adapter.address,
        chainId: chainId.value,
      }
    }
    catch (err: any) {
      error.value = err
      ElMessage.error(err.message)
    }
    finally {
      isConnecting.value = false
    }
  }

  // 断开当前钱包连接
  async function disconnect() {
    console.trace('[useWallet] disconnect', adapter)
    if (!adapter)
      return
    try {
      // 注意：TronLink不支持通过DApp断开连接，但我们仍然调用此方法保持API一致性
      await adapter.disconnect()
    }
    catch (err: any) {
      console.warn('[useWallet] disconnect error', err)
    }
    finally {
      cleanup()
      address.value = null
      chainId.value = null
      network.value = null
      isReady.value = false
      localStorage.removeItem(StorageKey.WalletType)
    }
  }

  // 事件处理函数
  const onAddressChanged = (newAddress: string, oldAddress?: string) => {
    console.log(`[useWallet] address changed from ${oldAddress} to ${newAddress}`)
    address.value = newAddress
  }

  const onNetworkChanged = (chainData: unknown) => {
    const chainInfo = chainData as ChainInfo
    console.warn(`[useWallet] network changed to chainId: ${chainInfo.chainId}`)
    chainId.value = chainInfo.chainId
    // 尝试更新完整的网络信息
    if (adapter) {
      adapter.network().then((networkInfo) => {
        network.value = networkInfo
      }).catch(console.error)
    }
  }

  const onDisconnect = () => {
    console.warn('[useWallet] disconnected')
    address.value = null
    chainId.value = null
    network.value = null
    isReady.value = false
    localStorage.removeItem(StorageKey.WalletType)
  }

  // 添加事件监听
  function setupListeners(adapter: IWalletAdapter) {
    // 注意：TokenPocket 移动端App在切换账户时会自动刷新页面，所以不需要监听 accountsChanged 事件
    adapter.on('connect', onAddressChanged)
    adapter.on('accountsChanged', onAddressChanged)
    adapter.on('chainChanged', onNetworkChanged)
    adapter.on('disconnect', onDisconnect)
  }

  // 移除事件监听并重置适配器
  function cleanup() {
    console.log('[useWallet] cleanup', adapter)
    if (!adapter)
      return
    adapter.removeAllListeners()
    adapter = null
  }

  // 签名消息
  async function signMessage(message: string): Promise<string | null> {
    if (!adapter || !isConnected.value) {
      ElMessage.error(t('app.walletNotConnected'))
      return null
    }

    try {
      return await adapter.signMessage(message)
    }
    catch (err) {
      ElMessage.error(err.message)
      return null
    }
  }

  // 签名交易
  async function signTransaction(transaction: any): Promise<any> {
    if (!adapter || !isConnected.value) {
      ElMessage.error(t('app.walletNotConnected'))
      return null
    }

    try {
      return await adapter.signTransaction(transaction)
    }
    catch (err) {
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
    catch (err) {
      error.value = err as Error
      return null
    }
  }

  // 自动连接上次使用的钱包
  function autoConnect() {
    const savedWalletType = localStorage.getItem(StorageKey.WalletType) as WalletType | null
    if (savedWalletType) {
      connect(savedWalletType)
    }
  }

  // 组件挂载时尝试自动连接
  onMounted(() => {
    setTimeout(autoConnect, 1000)
  })

  // 组件卸载时自动清理
  // onUnmounted(cleanup)

  return {
    // 状态
    address,
    chainId,
    network,
    isConnected,
    isConnecting,
    isReady,
    error,
    // 可用性
    tronLinkAvailable,
    tokenPocketAvailable,
    // 操作
    connect,
    autoConnect,
    disconnect,
    signMessage,
    signTransaction,
    getLatestBlockHeight,
    // 工具方法
    getShortAddress: () => {
      if (!address.value)
        return ''
      return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
    },
  }
}

export default useWallet
