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

// 设置meta属性，如果没有则创建
export function setMeta(name: string, content: string) {
  let meta: HTMLMetaElement | null = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}
