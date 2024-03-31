/// <reference types="vite/client" />
declare interface Window {
  tronWeb?: {
    defaultAddress: {
      base58: string | false
      hex: string | false
    }
    trx: any
    ready: boolean
    request: (options: { method: string }) => Promise<any>
  }
  tronLink?: {
    tronWeb: typeof Window.tronWeb
  }
}
