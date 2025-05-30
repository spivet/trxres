import type BigNumberType from 'bignumber.js'
import BigNumber from 'bignumber.js'

interface SymbolValue {
  value: number
  symbol: string
}

interface FormattedNumber {
  zh: { value: string, symbol: string }
  en: { value: string, symbol: string }
}

// 多语言格式化数量展示
export function numberFormatter(num: number, digits: number = 2): FormattedNumber {
  const enMode: SymbolValue[] = [
    { value: 1e21, symbol: 'B' },
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
    { value: 1, symbol: '' },
  ]

  const zhMode: SymbolValue[] = [
    { value: 1e20, symbol: '垓' },
    { value: 1e16, symbol: '京' },
    { value: 1e12, symbol: '兆' },
    { value: 1e8, symbol: '亿' },
    { value: 1e4, symbol: '万' },
    { value: 1, symbol: '' },
  ]

  const enItem = enMode.find(item => num >= item.value)
  const zhItem = zhMode.find(item => num >= item.value)

  return {
    en: enItem ? { ...enItem, value: formatAmount(divided(num, enItem.value), digits) } : { value: formatAmount(num, digits), symbol: '' },
    zh: zhItem ? { ...zhItem, value: formatAmount(divided(num, zhItem.value), digits) } : { value: formatAmount(num, digits), symbol: '' },
  }
}

// bignumber minus
export function minus(a: BigNumberType.Value, b: BigNumberType.Value, decimals = 2) {
  return computeBase(a, b, 'minus', decimals)
}

// bignumber plus
export function plus(a: BigNumberType.Value, b: BigNumberType.Value, decimals = 2) {
  return computeBase(a, b, 'plus', decimals)
}

// bignumber divided
export function divided(a: BigNumberType.Value, b: BigNumberType.Value, decimals: number = 2): string {
  return computeBase(a, b, 'dividedBy', decimals)
}

// bignumber multiplied
export function multiplied(a: BigNumberType.Value, b: BigNumberType.Value, decimals: number = 2): string {
  return computeBase(a, b, 'multipliedBy', decimals)
}

export function formatAmount(num: BigNumberType.Value, decimals: number = 2): string {
  const _num = new BigNumber(num)
  return _num.toFormat(decimals).replace(/\.0+$|(\.\d*[1-9])0+$/, '$1')
}

function computeBase(a: BigNumberType.Value, b: BigNumberType.Value, method: 'dividedBy' | 'multipliedBy' | 'plus' | 'minus', decimals: number): string {
  const x = new BigNumber(a)
  const y = new BigNumber(b)
  return decimals >= 0 ? x[method](y).toFixed(decimals, 1) : x[method](y).toString()
}

/**
 * 保留 n 位小数，支持字符串和数字输入，异常时返回 0
 * @param value 输入值
 * @param n 保留小数位数
 */
export function roundFloat(value: number | string, n: number): number {
  const num = Number(value)
  if (Number.isNaN(num))
    return 0

  const factor = 10 ** n
  return Math.round(num * factor) / factor
}
