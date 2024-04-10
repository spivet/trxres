// @ts-expect-error: no types for tp-js-sdk
import tp from 'tp-js-sdk'

export enum WalletType {
  TronLink = 'TronLink',
  TokenPocket = 'TokenPocket',
}
export enum StatusCodes {
  Success = 200,
  NoEnvironment = 400,
  InvalidNetwork = 501,
  Unauthorized = 502,
}

interface IConnectResponse {
  code: number
  data: string | null
  message: string
}

function isTronLink() {
  return window.tronLink
}

export function isTokenPocket() {
  return tp.isConnected()
}
function isTronNet(chain: string) {
  return chain === 'tron'
}

export async function connectWallet(): Promise<IConnectResponse> {
  if (isTokenPocket()) {
    const wallet = await tp.getCurrentWallet()
    if (isTronNet(wallet.data.blockchain)) {
      // 如果是波场网络，返回地址
      return Promise.resolve({
        code: StatusCodes.Success,
        data: wallet.data.address,
        message: 'Success',
      })
    }
    else {
      // 如果不是波场网络，提示用户切换网络
      return Promise.resolve({
        code: StatusCodes.InvalidNetwork,
        data: null,
        message: 'Invalid network',
      })
    }
  }
  else if (isTronLink()) {
    const tronLink = window.tronLink!
    const res = await tronLink.request({ method: 'tron_requestAccounts' })
    if (res.code === 200) {
      const address = tronLink.tronWeb.defaultAddress.base58 as string
      return Promise.resolve({
        code: StatusCodes.Success,
        data: address,
        message: 'Success',
      })
    }
    else {
      // 如果没登录或者拒绝授权，提示用户登录并同意授权
      return Promise.resolve({
        code: StatusCodes.Unauthorized,
        data: null,
        message: 'Unauthorized',
      })
    }
  }
  else {
    // 如果没有环境，提示用户安装钱包
    return Promise.resolve({
      code: StatusCodes.NoEnvironment,
      data: null,
      message: 'No environment found',
    })
  }
}

export async function signOnTronLink(address: string, second: number) {
  return await window.tronWeb?.trx.signMessageV2(`${address}-${second}`)
}
