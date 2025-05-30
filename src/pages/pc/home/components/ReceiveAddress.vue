<script setup lang="ts">
const receiverAddress = defineModel<string>()
</script>

<template>
  <div class="receive-address">
    <strong class="text-14px mb-10px">{{ $t('app.receiver') }}</strong>

    <TrxInput
      :model-value="receiverAddress"
      disabled
    />
  </div>
</template>

<style scoped>
.receive-address {
  display: flex;
  flex-direction: column;
}
</style>
