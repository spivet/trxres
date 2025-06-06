import { TokenPocketAdapterName } from '@tronweb3/tronwallet-adapter-tokenpocket'
import { TronLinkAdapterName } from '@tronweb3/tronwallet-adapter-tronlink'
import { TronWeb } from 'tronweb'

export const WalletType = {
  TronLink: TronLinkAdapterName,
  TokenPocket: TokenPocketAdapterName,
} as const

export function hasTokenPocket() {
  return window.tron?.isTokenPocket
}

export function isTokenPocketEnv() {
  const host = window.tronWeb?.fullNode?.host
  const isTokenPocket = host?.includes('tokenpocket')
  return isTokenPocket
}

export function getShortAddress(address: string, startIndex = 6, endIndex = 4) {
  return `${address.slice(0, startIndex)}...${address.slice(-endIndex)}`
}
// 获取最新区块高度
export async function getLatestBlockHeight() {
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
