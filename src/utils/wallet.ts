// @ts-expect-error: no types for tp-js-sdk
import tp from 'tp-js-sdk'

export enum WalletType {
  TronLink = 'TronLink',
  TokenPocket = 'TokenPocket',
}

interface IConnectResponse {
  code: number
  data: string | null
  message: string
}

// 连接到TronLink
async function connectToTronLink(): Promise<IConnectResponse> {
  if (!window.tronWeb) {
    return Promise.resolve({
      code: 400,
      data: null,
      message: 'TronLink not found',
    })
  }

  const res = await window.tronWeb.request({ method: 'tron_requestAccounts' })
  if (res.code === 200) {
    const address = window.tronWeb.defaultAddress.base58 as string
    return Promise.resolve({
      code: 200,
      data: address,
      message: 'Success',
    })
  }

  else {
    return Promise.resolve({
      code: res.code,
      data: null,
      message: res.message,
    })
  }
}
export async function signOnTronLink(address: string, second: number) {
  return await window.tronWeb?.trx.signMessageV2(`${address}-${second}`)
}

// 连接到TokenPocket
async function connectToTokenPocket() {
  console.log(tronLink)
  if (!tp.isConnected)
    return Promise.reject(new Error('TokenPocket not found'))

  const res = await tp.getCurrentWallet()
  console.log(res)
  const address = res.data.address
  return Promise.resolve({
    code: 200,
    data: address,
    message: 'Success',
  })
}

// 统一处理连接请求
export function connectWallet(walletType: `${WalletType}`) {
  const walletConnectors = {
    [WalletType.TronLink]: connectToTronLink,
    [WalletType.TokenPocket]: connectToTokenPocket,
  }
  return walletConnectors[walletType]()
}
