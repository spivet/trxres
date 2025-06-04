/**
 * TrxAlert 组件类型定义
 */

// 弹窗类型
export type AlertType = 'success' | 'error' | 'warning'

// 弹窗配置项
export interface AlertOptions {
  // 弹窗类型
  type?: AlertType
  // 弹窗内容
  message: string
  // 弹窗持续时间，单位毫秒，默认 3000ms
  duration?: number
  // 点击确认按钮回调
  onConfirm?: () => void
}

// 组件实例方法
export interface AlertInstance {
  // 显示成功弹窗
  success: (message: string | AlertOptions) => void
  // 显示错误弹窗
  error: (message: string | AlertOptions) => void
  // 显示警告弹窗
  warning: (message: string | AlertOptions) => void
  // 关闭所有弹窗
  closeAll: () => void
}
