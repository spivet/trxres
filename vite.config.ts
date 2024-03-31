import path from 'node:path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'
// @ts-expect-error: No types available
import pxToViewport from 'postcss-px-to-viewport'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    UnoCSS(),
    AutoImport({
      resolvers: [
        VantResolver(),
        ElementPlusResolver(),
      ],
      imports: [
        {
          'vue-request': ['useRequest'],
        },
      ],
    }),
    Components({
      resolvers: [
        VantResolver(),
        ElementPlusResolver(),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },
  css: {
    postcss: {
      plugins: [
        pxToViewport({
          viewportWidth: 750,
          exclude: [/node_modules/],
        }),
      ],
    },
  },
})
