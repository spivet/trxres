export type KeyType = string | number
export interface ITab {
  key: KeyType
  title: string
  isActive: boolean
}
export type RegisterTabCallback = (tab: { key: KeyType, title: string, isActive: boolean }) => void
export type UnregisterTabCallback = (key: KeyType) => void
