import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import 'virtual:uno.css'
import 'vant/lib/index.css'
import '@/styles/index.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-loading.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .use(i18n)
  .mount('#app')
