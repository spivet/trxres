<script setup lang="ts">
defineProps<{
  price: string | number
  loading: boolean
}>()
</script>

<template>
  <div class="flex-between mb-10px">
    <strong class="text-14px">
      {{ $t('fastTradingDialog.money') }}
    </strong>
    <el-icon v-if="loading" :loading="loading" class="is-loading">
      <i class="i-icon:loading" />
    </el-icon>
    <span v-else class="text-18px font-bold">
      {{ price }} TRX
    </span>
  </div>
</template>

<style scoped>

</style>
