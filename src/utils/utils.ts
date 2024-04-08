export function openAddressDetail(address: string) {
  window.open(`${import.meta.env.VITE_ADDRESS_URL}#/address/${address}`)
}
export function openHashDetail(hash: string) {
  window.open(`${import.meta.env.VITE_TRANS_URL}#/transaction/${hash}`)
}
