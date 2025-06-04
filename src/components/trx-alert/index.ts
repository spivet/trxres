import type { AlertInstance, AlertOptions } from './types'
import { createApp, h } from 'vue'
import { i18n } from '@/i18n'
import TrxAlertComponent from './TrxAlert.vue'

// 存储当前显示的所有弹窗实例
const instances: Array<{ vm: any, container: HTMLElement }> = []

// 创建弹窗容器
function createContainer() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}

// 创建弹窗实例
function createAlertInstance(options: AlertOptions) {
  const container = createContainer()

  // 规范化选项
  const alertOptions = typeof options === 'string'
    ? { message: options }
    : options

  // 创建弹窗应用
  const app = createApp({
    render() {
      return h(TrxAlertComponent, {
        type: alertOptions.type || 'success',
        message: alertOptions.message,
        duration: alertOptions.duration,
        onConfirm: () => {
          if (alertOptions.onConfirm) {
            alertOptions.onConfirm()
          }
        },
        onClose: () => {
          // 关闭时销毁实例
          setTimeout(() => {
            app.unmount()
            container.parentNode?.removeChild(container)
            const index = instances.findIndex(item => item.container === container)
            if (index !== -1) {
              instances.splice(index, 1)
            }
          }, 300) // 等待动画结束
        },
      })
    },
  })

  // 应用全局 i18n
  app.use(i18n)

  // 挂载应用
  app.mount(container)

  // 保存实例
  const instance = { vm: app, container }
  instances.push(instance)

  return instance
}

// 创建 TrxAlert 对象
const TrxAlert: AlertInstance = {
  success(options) {
    const alertOptions = typeof options === 'string'
      ? { message: options, type: 'success' as const }
      : { ...options, type: 'success' as const }
    return createAlertInstance(alertOptions)
  },

  error(options) {
    const alertOptions = typeof options === 'string'
      ? { message: options, type: 'error' as const }
      : { ...options, type: 'error' as const }
    return createAlertInstance(alertOptions)
  },

  warning(options) {
    const alertOptions = typeof options === 'string'
      ? { message: options, type: 'warning' as const }
      : { ...options, type: 'warning' as const }
    return createAlertInstance(alertOptions)
  },

  closeAll() {
    instances.forEach(({ vm }) => {
      vm.unmount()
    })
    instances.length = 0
  },
}

// 导出组件
// export { TrxAlert }
export default TrxAlert
