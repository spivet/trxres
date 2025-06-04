<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import TrxTabs from '@/components/trx-tabs/index.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// 导航菜单项
const navItems = computed(() => [
  { key: 'home', label: t('app.home'), path: '/', icon: 'i-icon:home', onClick: () => {
    router.push('/')
    return false
  } },
  { key: 'api', label: 'API', onClick: () => {
    window.open('https://docs.trxres.com/')
    return false
  } },
])
const activeNav = ref('')
watch(() => route.name, () => {
  activeNav.value = route.name as string
})
</script>

<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="TRXRes">
    </div>

    <TrxTabs v-model="activeNav" :tabs="navItems" class="mx-auto" size="big" />

    <slot name="right" />
  </header>
</template>

<style lang="less" scoped>
.header {
  background-color: #F9F9FB;;
  display: flex;
  align-items: center;
  padding: 20px 36px;
}

.logo {
  position: absolute;

  img {
    display: block;
    width: 178px;
  }
}
</style>
