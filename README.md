# trxres_web

## 框架要求：

  + 主框架 vue3

  + css框架 unocss

  + UI库 elementUI-plus

  + HTTP请求库 axios

  + 控制台库 eruda，要求dev模式下常开，prod模式下有特定区域埋点触发显示

  + 状态管理 pinia，尽量少用或不用provide/inject 特性，维护全局状态使用pinia，维护局部状态在当前组件里完成

  + 钱包连接使用tronweb 不用安装，用浏览器插件的形式，所以需要安装tronlink拓展，参考文档 https://tronweb.network/docu

  + 需要下载TP钱包，调试的时候保证chrome的tronlink和tp上集成的tronlink行为一致，tp jssdk: tp-js-sdk

## 项目规范：

  + 根据响应式布局编写页面，设计稿上的像素单位转为rem

  + 使用eslint和styleint保证代码质量和规范性

  + 页面seo相关属性根据语言版本可配置，如keywords、descriptions和title

  + 不要过度抽象，非公用方法不用单独写一个lib文件

  + 图片文件需要压缩

  + 打包走ssg流程，最后输出多语言版本纯静态文件
  
## 计算

  + 参考工具 https://tronscan.org/#/tools/tronstation
  
  + 显示的节省费用为 所需能量数 / 燃烧1TRX可获得能量数 - 报价
    比如tronify租赁 1笔 32000能量 1小时，报价为4.08，当前燃烧1TRX可获得 2380.95238 , 32000 / 2380.95238 - 4.08 = 9.3600000054，保留两位小数就是9.36