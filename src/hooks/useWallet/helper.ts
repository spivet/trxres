import type { Adapter } from '@tronweb3/tronwallet-abstract-adapter'
import { WalletError, WalletReadyState } from '@tronweb3/tronwallet-abstract-adapter'

/**
 * 钱包类型枚举
 */
export enum WalletType {
  TronLink = 'TronLink',
  TokenPocket = 'TokenPocket',
}

/**
 * 钱包状态码
 */
export enum WalletStatusCode {
  Success = 200,
  NoEnvironment = 400,
  InvalidNetwork = 501,
  Unauthorized = 502,
  Unknown = 503,
}

/**
 * 钱包连接响应接口
 */
export interface WalletConnectResponse {
  code: WalletStatusCode
  data: string | null
  message: string
}

/**
 * 钱包事件类型
 */
export enum WalletEventType {
  Connect = 'connect',
  Disconnect = 'disconnect',
  AccountsChanged = 'accountsChanged',
  ChainChanged = 'chainChanged',
  ReadyStateChanged = 'readyStateChanged',
  Error = 'error',
}

/**
 * 钱包错误类型
 */
export interface WalletErrorData {
  code: WalletStatusCode
  message: string
  originalError?: Error | WalletError
}

/**
 * 钱包网络信息
 */
export interface WalletNetwork {
  networkType: string
  chainId: string
  fullNode: string
  solidityNode: string
  eventServer: string
}

/**
 * 钱包适配器配置
 */
export interface WalletAdapterConfig {
  openUrlWhenWalletNotFound?: boolean
  checkTimeout?: number
  openTronLinkAppOnMobile?: boolean
  dappIcon?: string
  dappName?: string
}

/**
 * 将钱包就绪状态转换为状态码
 */
export function readyStateToStatusCode(readyState: WalletReadyState): WalletStatusCode {
  switch (readyState) {
    case WalletReadyState.Found:
      return WalletStatusCode.Success
    case WalletReadyState.NotFound:
      return WalletStatusCode.NoEnvironment
    case WalletReadyState.Loading:
    default:
      return WalletStatusCode.Unknown
  }
}

/**
 * 创建钱包错误
 */
export function createWalletError(
  code: WalletStatusCode,
  message: string,
  originalError?: Error | WalletError
): WalletErrorData {
  return {
    code,
    message,
    originalError,
  }
}

/**
 * 处理钱包错误
 */
export function handleWalletError(error: unknown): WalletErrorData {
  if (error instanceof WalletError) {
    return createWalletError(
      WalletStatusCode.Unknown,
      error.message,
      error
    )
  }
  
  if (error instanceof Error) {
    return createWalletError(
      WalletStatusCode.Unknown,
      error.message,
      error
    )
  }
  
  return createWalletError(
    WalletStatusCode.Unknown,
    '未知错误',
    error instanceof Error ? error : undefined
  )
}

/**
 * 检查适配器是否已连接
 */
export function isAdapterConnected(adapter: Adapter | null): boolean {
  return !!adapter && adapter.connected
}

/**
 * 检查适配器是否已找到钱包
 */
export function isAdapterReady(adapter: Adapter | null): boolean {
  return !!adapter && adapter.readyState === WalletReadyState.Found
}
