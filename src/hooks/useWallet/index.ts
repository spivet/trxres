import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import type {
  WalletAdapterConfig,
  WalletConnectResponse,
  WalletErrorData,
  WalletNetwork,
} from './helper'
import { WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter'
import { TokenPocketAdapter, TronLinkAdapter } from '@tronweb3/tronwallet-adapters'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'
import {
  createWalletError,
  handleWalletError,
  isAdapterConnected,
  isAdapterReady,
  readyStateToStatusCode,
  WalletEventType,
  WalletStatusCode,
  WalletType,
} from './helper'

/**
 * 钱包适配器映射
 */
const adapters = {
  [WalletType.TronLink]: TronLinkAdapter,
  [WalletType.TokenPocket]: TokenPocketAdapter,
}

/**
 * 钱包Hook，统一封装钱包功能
 */
function useWallet() {
  const { t } = useI18n()
  const accountStore = useAccountStore()

  // 当前选择的钱包类型
  const walletType = ref<WalletType | null>(null)

  // 当前钱包适配器实例
  const adapter = ref<Adapter | null>(null)

  // 钱包地址
  const address = ref<string>('')
  watch(address, (newAddress) => {
    if (newAddress)
      accountStore.setAddress(newAddress)
  })

  // 钱包网络信息
  const network = ref<WalletNetwork | null>(null)

  // 钱包状态
  const state = reactive({
    connected: false,
    connecting: false,
    readyState: WalletReadyState.Loading,
  })

  // 错误信息
  const error = ref<WalletErrorData | null>(null)

  /**
   * 初始化钱包适配器
   * @param type 钱包类型
   * @param config 适配器配置
   */
  function initAdapter(type: WalletType, config?: WalletAdapterConfig) {
    try {
      // 如果已经存在适配器且类型相同，则不重新创建
      if (adapter.value && walletType.value === type) {
        return
      }

      // 移除之前适配器的事件监听
      removeAdapterListeners()

      // 创建新的适配器实例
      const AdapterClass = adapters[type]
      if (!AdapterClass) {
        throw new Error(`不支持的钱包类型: ${type}`)
      }

      const newAdapter = new AdapterClass(config)
      adapter.value = newAdapter
      walletType.value = type

      // 更新状态
      state.readyState = newAdapter.readyState
      state.connected = isAdapterConnected(newAdapter)
      state.connecting = newAdapter.connecting

      if (state.connected && newAdapter.address) {
        address.value = newAdapter.address
      }

      // 添加事件监听
      addAdapterListeners()

      return newAdapter
    }
    catch (err) {
      const walletError = handleWalletError(err)
      error.value = walletError
      ElMessage.error(walletError.message || t('app.unknownError'))
      return null
    }
  }

  /**
   * 连接钱包
   * @param type 钱包类型
   * @param config 适配器配置
   */
  async function connect(type: WalletType, config?: WalletAdapterConfig): Promise<WalletConnectResponse> {
    try {
      // 如果已连接且类型相同，则直接返回成功
      if (state.connected && walletType.value === type && address.value) {
        return {
          code: WalletStatusCode.Success,
          data: address.value,
          message: 'Success',
        }
      }

      // 初始化适配器 - 确保使用正确的钱包类型
      // 如果当前适配器类型与要连接的类型不同，则需要重新初始化
      let currentAdapter = adapter.value
      if (!currentAdapter || walletType.value !== type) {
        currentAdapter = initAdapter(type, config)
      }
      if (!currentAdapter) {
        return {
          code: WalletStatusCode.NoEnvironment,
          data: null,
          message: t('app.noEnvironment'),
        }
      }

      // 检查钱包是否已安装
      if (currentAdapter.readyState !== WalletReadyState.Found) {
        return {
          code: WalletStatusCode.NoEnvironment,
          data: null,
          message: t('app.noEnvironment'),
        }
      }

      // 连接钱包
      state.connecting = true
      await currentAdapter.connect()

      // 更新状态
      state.connected = isAdapterConnected(currentAdapter)
      state.connecting = false

      if (state.connected && currentAdapter.address) {
        address.value = currentAdapter.address

        // 获取网络信息
        try {
          // @ts-expect-error - network方法在适配器类型中可能不存在，但实际实现中存在
          const networkInfo = await currentAdapter.network()
          if (networkInfo) {
            network.value = networkInfo
          }
        }
        catch (err) {
          console.warn('获取网络信息失败:', err)
        }

        return {
          code: WalletStatusCode.Success,
          data: address.value,
          message: 'Success',
        }
      }

      return {
        code: WalletStatusCode.Unauthorized,
        data: null,
        message: t('app.unauthorized'),
      }
    }
    catch (err) {
      state.connecting = false
      const walletError = handleWalletError(err)
      error.value = walletError

      return {
        code: walletError.code,
        data: null,
        message: walletError.message || t('app.unknownError'),
      }
    }
  }

  /**
   * 断开钱包连接
   */
  async function disconnect(): Promise<void> {
    try {
      if (adapter.value) {
        await adapter.value.disconnect()

        // 重置状态
        state.connected = false
        address.value = ''
        network.value = null
      }
    }
    catch (err) {
      const walletError = handleWalletError(err)
      error.value = walletError
      ElMessage.error(walletError.message || t('app.unknownError'))
    }
  }

  /**
   * 签名消息
   * @param message 要签名的消息
   */
  async function signMessage(message: string): Promise<string | null> {
    try {
      if (!adapter.value || !state.connected) {
        throw createWalletError(
          WalletStatusCode.Unauthorized,
          t('app.walletNotConnected'),
        )
      }

      return await adapter.value.signMessage(message)
    }
    catch (err) {
      const walletError = handleWalletError(err)
      error.value = walletError
      ElMessage.error(walletError.message || t('app.unknownError'))
      return null
    }
  }

  /**
   * 签名交易
   * @param transaction 要签名的交易
   */
  async function signTransaction(transaction: any): Promise<any> {
    try {
      if (!adapter.value || !state.connected) {
        throw createWalletError(
          WalletStatusCode.Unauthorized,
          t('app.walletNotConnected'),
        )
      }

      return await adapter.value.signTransaction(transaction)
    }
    catch (err) {
      const walletError = handleWalletError(err)
      error.value = walletError
      ElMessage.error(walletError.message || t('app.unknownError'))
      return null
    }
  }

  /**
   * 切换网络
   * @param chainId 链ID
   */
  async function switchChain(chainId: string): Promise<boolean> {
    try {
      if (!adapter.value || !state.connected) {
        throw createWalletError(
          WalletStatusCode.Unauthorized,
          t('app.walletNotConnected'),
        )
      }

      await adapter.value.switchChain(chainId)
      return true
    }
    catch (err) {
      const walletError = handleWalletError(err)
      error.value = walletError
      ElMessage.error(walletError.message || t('app.unknownError'))
      return false
    }
  }

  /**
   * 添加适配器事件监听
   */
  function addAdapterListeners() {
    if (!adapter.value)
      return

    // 连接事件
    adapter.value.on(WalletEventType.Connect, (newAddress: string) => {
      state.connected = true
      state.connecting = false
      address.value = newAddress
    })

    // 断开连接事件
    adapter.value.on(WalletEventType.Disconnect, () => {
      state.connected = false
      address.value = ''
      network.value = null
    })

    // 账户变更事件
    adapter.value.on(WalletEventType.AccountsChanged, (newAddress: string) => {
      address.value = newAddress
    })

    // 网络变更事件
    adapter.value.on(WalletEventType.ChainChanged, (chainData: unknown) => {
      // 将chainData转换为WalletNetwork类型
      network.value = chainData as WalletNetwork
    })

    // 就绪状态变更事件
    adapter.value.on(WalletEventType.ReadyStateChanged, (readyState: WalletReadyState) => {
      state.readyState = readyState
    })

    // 错误事件
    adapter.value.on(WalletEventType.Error, (err: any) => {
      const walletError = handleWalletError(err)
      error.value = walletError
      ElMessage.error(walletError.message || t('app.unknownError'))
    })
  }

  /**
   * 移除适配器事件监听
   */
  function removeAdapterListeners() {
    if (!adapter.value)
      return

    adapter.value.removeAllListeners('connect')
    adapter.value.removeAllListeners('disconnect')
    adapter.value.removeAllListeners('accountsChanged')
    adapter.value.removeAllListeners('chainChanged')
    adapter.value.removeAllListeners('readyStateChanged')
    adapter.value.removeAllListeners('error')
  }

  /**
   * 检测钱包是否已安装
   * @param type 钱包类型
   */
  function isWalletInstalled(type: WalletType): boolean {
    // 如果当前适配器类型与要检测的类型相同，则直接使用当前适配器
    if (adapter.value && walletType.value === type) {
      return isAdapterReady(adapter.value)
    }

    // 否则创建新的适配器实例进行检测
    try {
      const AdapterClass = adapters[type]
      if (!AdapterClass)
        return false

      const tempAdapter = new AdapterClass()
      return isAdapterReady(tempAdapter)
    }
    catch (err) {
      console.warn(`检测钱包安装状态失败:`, err)
      return false
    }
  }

  /**
   * 获取钱包就绪状态
   * @param type 钱包类型
   */
  function getWalletReadyState(type: WalletType): WalletReadyState {
    const currentAdapter = adapter.value || initAdapter(type)
    return currentAdapter?.readyState || WalletReadyState.Loading
  }

  /**
   * 获取钱包状态码
   * @param type 钱包类型
   */
  function getWalletStatusCode(type: WalletType): WalletStatusCode {
    const readyState = getWalletReadyState(type)
    return readyStateToStatusCode(readyState)
  }

  /**
   * 获取短地址显示
   */
  function getShortAddress(): string {
    if (!address.value)
      return ''
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
  }

  // 组件挂载时初始化
  onMounted(() => {
    // 如果之前已经连接过钱包，尝试自动重连
    const savedWalletType = localStorage.getItem('walletType')
    if (savedWalletType && Object.values(WalletType).includes(savedWalletType as WalletType)) {
      initAdapter(savedWalletType as WalletType)
    }
  })

  // 组件卸载时清理
  onBeforeUnmount(() => {
    removeAdapterListeners()
  })

  return {
    // 状态
    walletType,
    adapter,
    address,
    network,
    state,
    error,

    // 方法
    connect,
    disconnect,
    signMessage,
    signTransaction,
    switchChain,
    isWalletInstalled,
    getWalletReadyState,
    getWalletStatusCode,
    getShortAddress,
  }
}

export default useWallet
