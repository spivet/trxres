export function openAddressDetail(address: string) {
  window.open(`${import.meta.env.VITE_ADDRESS_URL}#/address/${address}`)
}
export function openHashDetail(hash: string) {
  window.open(`${import.meta.env.VITE_TRANS_URL}#/transaction/${hash}`)
}

// 将数字转换为千分位
export function toThousands(num: number) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
