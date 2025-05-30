import useAccountStore from '@/store/account'

// 导入新的钱包封装实现
import { WalletStatusCode, WalletType } from './useWallet/helper'
import useWalletImplementation from './useWallet/index'

/**
 * 钱包Hook，兼容旧版API同时提供新的功能
 */
function useWallet() {
  const accountStore = useAccountStore()
  
  // 使用新的钱包封装实现
  const walletImplementation = useWalletImplementation()
  
  /**
   * 兼容旧版API：连接钱包
   */
  async function linkWallet() {
    // 默认使用TronLink钱包
    const res = await walletImplementation.connect(WalletType.TronLink)
    
    if (res.code === WalletStatusCode.Success) {
      // 更新账户状态
      accountStore.setAddress(res.data!)
      // 保存钱包类型
      localStorage.setItem('walletType', WalletType.TronLink)
      return true
    } else {
      // 处理错误情况
      if (res.code === WalletStatusCode.InvalidNetwork) {
        accountStore.setSourceFlag('')
      } else if (res.code === WalletStatusCode.NoEnvironment) {
        accountStore.setNoWallet(true)
      }
    }
  }
  
  /**
   * 兼容旧版API：断开钱包连接
   */
  function unlinkWallet() {
    walletImplementation.disconnect()
    accountStore.setAddress('')
    accountStore.setSourceFlag('')
    accountStore.setBalance(null)
    localStorage.removeItem('walletType')
  }
  
  /**
   * 兼容旧版API：监听账户变化
   */
  function watchAccountChange() {
    // 新版实现已经包含了账户变化监听，这里不需要额外实现
    // 为了兼容旧版API，保留此方法
  }
  
  // 返回合并后的API，包含旧版API和新版API
  return {
    // 旧版API
    linkWallet,
    unlinkWallet,
    watchAccountChange,
    
    // 新版API
    ...walletImplementation,
  }
}

export default useWallet
