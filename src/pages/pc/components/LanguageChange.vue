<script setup lang="ts">
import { loadLanguageAsync } from '@/i18n'

function switchLanguage(lang: string) {
  loadLanguageAsync(lang)
  localStorage.setItem('lang', lang)
}
</script>

<template>
  <el-dropdown placement="bottom">
    <i class="i-icon:language color-#000 outline-0 text-26px" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="switchLanguage('en')">
          English
        </el-dropdown-item>
        <el-dropdown-item @click="switchLanguage('zh-tw')">
          繁體中文
        </el-dropdown-item>
        <!-- <el-dropdown-item @click="switchLanguage('zh-cn')">
          简体中文
        </el-dropdown-item> -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>

</style>
