<script setup lang="ts">
import useEruda from '@/hooks/useEruda'

const { toggleEruda } = useEruda(3)
</script>

<template>
  <div class="page-footer">
    <div class="logo" @click="toggleEruda">
      logo
    </div>
    <nav class="flex-between">
      <a href="" class="nav-item">
        <i class="i-icon:book" />
        {{ $t('app.manual') }}
      </a>
      <a href="" class="nav-item">
        <i class="i-icon:plugin" />
        API
      </a>
    </nav>
    <p class="footer-pagraph">
      {{ $t('notice.saving') }}
    </p>
    <p class="footer-pagraph">
      {{ $t('notice.earning') }}
    </p>
  </div>
</template>

<style scoped>
.page-footer {
  padding: 40px;
  background-color: #fff;
}

.nav-item {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
  margin-top: 36px;
  color: var(--kele-color-font-primary);
  font-size: 32px;
  line-height: normal;
}
.footer-pagraph {
  margin: 36px 0;
  color: var(--kele-color-font-second);
  font-size: 24px;
  line-height: normal;
}
</style>
