import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        // rotate的变换属性在firefox中会出现mask与主体转动不同步，导致出现背景色边框问题
        // 基于使用该方式集成图标方便，并且实际变化效果也并未有多出彩的地方，故rotate变化不使用动画过渡
        'transition-property': 'background-color',
        'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'transition-duration': '150ms',
        'vertical-align': 'middle',
      },
      collections: {
        icon: FileSystemIconLoader(
          './src/assets/svg',
          svg => svg.replace(/#FFF/, 'currentColor'),
        ),
      },
    }),
    presetAttributify(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    colors: {
      brand: 'var(--kele-color-brand)',
      font: {
        primary: 'var(--kele-color-font-primary)',
        second: 'var(--kele-color-font-second)',
      },
      bg: {
        page: 'var(--kele-color-bg-page)',
        primary: 'var(--kele-color-bg-primary)',
      },
      function: {
        warning: 'var(--kele-color-warning)',
        danger: 'var(--kele-color-danger)',
      },
    },
  },
  shortcuts: [
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-around', 'flex items-center justify-around'],
  ],
  safelist: [],
  rules: [],
})
