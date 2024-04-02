<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import useAccountStore from '@/store/account'

const { balance } = toRefs(useAccountStore())
const currentEnergyRate = ref(0)
const energyRate = computed(() => {
  return (balance.value?.energyUsed ?? 0) / (balance.value?.energyTotal ?? 0) * 100
})

const currentBandWidthRate = ref(0)
const bandWidthRate = computed(() => {
  return (balance.value?.bandWidthUsed ?? 0) / (balance.value?.bandWidthTotal ?? 0) * 100
})
</script>

<template>
  <div class="balance-panel">
    <!-- 可用余额 -->
    <div class="title">
      <i class="i-icon:trx" />
      {{ $t('app.balance') }}(TRX)
    </div>
    <p class="coins">
      {{ balance?.balance ?? '--' }}
    </p>

    <div class="cells">
      <!-- 带宽 -->
      <div class="cell">
        <van-circle
          v-model:current-rate="currentEnergyRate"
          :rate="energyRate"
          :stroke-width="120"
          :speed="100"
          layer-color="#eee"
          color="#4356FC"
          class="w-76px! h-76px!"
        >
          <div class="flex-center h-full">
            <i class="i-icon:chip text-34px" />
          </div>
        </van-circle>
        <div class="cell__value">
          <span class="value__text">{{ balance?.energyUsed ?? '--' }}/{{ balance?.energyTotal ?? '--' }}</span>
          <span class="value__label">{{ $t('app.energy') }}</span>
        </div>
      </div>
      <!-- 分割线 -->
      <span class="w-2px h-72px mx-24px bg-#eee" />
      <!-- 能量 -->
      <div class="cell">
        <van-circle
          v-model:current-rate="currentBandWidthRate"
          :rate="bandWidthRate"
          :stroke-width="120"
          :speed="100"
          layer-color="#eee"
          color="#4356FC"
          class="w-76px! h-76px!"
        >
          <div class="flex-center h-full">
            <i class="i-icon:power text-34px" />
          </div>
        </van-circle>
        <div class="cell__value">
          <span class="value__text">{{ balance?.bandWidthUsed ?? '--' }}/{{ balance?.bandWidthTotal ?? '--' }}</span>
          <span class="value__label">{{ $t('app.bandwidth') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.balance-panel {
  display: flex;
  padding: 36px 40px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 16px;
  background: url('../images/balance-bg.png') top 40px right 36px/112px no-repeat #fff;
  box-shadow: 0px 20px 120px 0px rgba(0, 0, 0, 0.02);
}
.title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 26px;
  font-weight: 500;
  color: var(--kele-color-font-second);
}
.coins {
  margin-top: 8px;
  margin-bottom: 0;
  color: var(--kele-color-font-primary);
  font-size: 48px;
  font-weight: 500;
}

.cells {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 2px solid #EEE;
}
.cell {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 24px;
}
.cell__value {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.value__text {
  font-size: 28px;
  font-weight: 600;
  color: var(--kele-color-brand);
  line-height: normal;
}
.value__label {
  color: var(--Text-Color-Text-Second, #97999B);
  font-size: 24px;
  font-weight: 400;
  line-height: normal;
}
</style>
