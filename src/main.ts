import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import 'virtual:uno.css'
import 'vant/lib/index.css'
import '@/styles/index.css'

createApp(App)
  .use(router)
  .use(i18n)
  .mount('#app')
