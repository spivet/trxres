import dayjs from 'dayjs'

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

// 缩短地址，默认从第6位开始，到倒数第4位结束
export function shortenAddress(address: string, startIndex = 6, endIndex = 4) {
  if (!address)
    return ''
  return `${address.slice(0, startIndex)}...${address.slice(-endIndex)}`
}

// 格式化时间戳，默认格式为YYYY-MM-DD HH:mm:ss
export function formatTimestamp(timestamp: number) {
  return dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 将天、小时、分钟转换成小时，如果天不为0，则将天转换成小时，如果天为0，则将小时转换成小时，如果天和小时都为0，则将分钟转换成小时
export function formatTimeToHour(day: string, hour: string, minute: string) {
  let hours = Number.parseInt(hour)
  if (!day && !hour && !minute)
    return ''
  if (day > 0) {
    hours = Number.parseInt(day) * 24 + Number.parseInt(hour)
  }
  if (minute > 0) {
    hours = Number.parseInt(hour) + Number.parseInt(minute) / 60
  }
  return hours.toFixed(2)
}

/**
 * 将能量租赁时长统一转换成天，目前时长有3种单位：天、小时、分钟
 * pledgeDay，pledgeHour，pledgeMinute，三者按顺序取第一个不为0的值，转换成天
 */
export function pledgeTimeToDay(pledgeDay: string, pledgeHour: string, pledgeMinute: string) {
  return Number.parseInt(pledgeDay) || Number.parseInt(pledgeHour) / 24 || Number.parseInt(pledgeMinute) / 1440
}

/**
 * 获取租赁时长参数
 * @param rentalTime 租赁时长，m10/h1/h3/day1-day30
 */
export function getRentalTime(rentalTime: string) {
  let pledgeDay
  let pledgeHour
  let pledgeMinute
  if (rentalTime === 'm10') {
    pledgeMinute = 10
  }
  else if (rentalTime === 'h1') {
    pledgeHour = 1
  }
  else if (rentalTime === 'h3') {
    pledgeHour = 3
  }
  else if (rentalTime.startsWith('day')) {
    pledgeDay = Number(rentalTime.replace('day', ''))
  }

  return {
    pledgeDay,
    pledgeHour,
    pledgeMinute,
  }
}
