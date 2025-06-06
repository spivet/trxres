/// <reference types="vite/client" />
declare interface Window {
  tronWeb?: {
    defaultAddress: {
      base58: string | false
      hex: string | false
    }
    trx: any
    fullNode: {
      host: string
    }
    ready: boolean
    request: (options: { method: string }) => Promise<any>
  }
  tronLink?: {
    tronWeb: typeof Window.tronWeb
    request: (options: { method: string }) => Promise<any>
  }
  tron?: {
    isTokenPocket?: boolean
    isTronLink: boolean
    tronWeb: boolean | typeof Window.tronWeb
    tronlinkParams: {
      websiteIcon: string
      websiteName: string
    }
  }
}
