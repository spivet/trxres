<script setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import usePrice from '@/hooks/usePrice'
import useConfigStore from '@/store/config'
import { roundFloat } from '@/utils/number'

const priceStore = usePrice()
const configStore = useConfigStore()
const { config } = storeToRefs(configStore)
const { t } = useI18n()

const originalTRXPrice = computed(() => {
  if (!config.value.burnEnergy)
    return 0
  return roundFloat(65000 / config.value.burnEnergy, 2)
})

const actualTRXPrice = computed(() => {
  if (!priceStore.priceData.value)
    return 0
  return roundFloat(65000 / 1e6 * config.value.sun_10m, 2)
})

const savedTRXPercent = computed(() => {
  if (!priceStore.priceData.value)
    return 0
  return ((originalTRXPrice.value - actualTRXPrice.value) / originalTRXPrice.value * 100).toFixed(0)
})
onMounted(() => {
  priceStore.checkPrice({
    pledgeAddress: '',
    pledgeTime: 'm10',
    pledgeNum: 65000,
    payToken: 'TRX',
  })
})
</script>

<template>
  <div class="tips-container">
    <div class="tips-container__header">
      <h3 class="tip-title">
        {{ t('tips.title') }}
      </h3>
      <img src="@/assets/images/tips.png" class="tip-img">
    </div>
    <div class="tip-item-box">
      <div class="tip-item">
        {{ t('tips.content1') }}
      </div>
      <div class="tip-item">
        {{ t('tips.content2') }}
      </div>
    </div>
    <div class="compari-content">
      <div class="comp-title fw-bold">
        {{ t('tips.compareTitle') }}
      </div>
      <div class="comp-des ">
        {{ t('tips.compareText') }}
      </div>
      <div class="comp-eg">
        <div class="comp-eg-item">
          <div class="left">
            <img src="@/assets/images/fire.png" class="w-44px h-44px mr-4px">
          </div>
          <div class="rightArea rightArea--1">
            <div class="cost">
              {{ originalTRXPrice }} TRX
            </div>
            <div class="text">
              {{ t('tips.iconText1') }}
            </div>
          </div>
        </div>
        <div class="comp-eg-item">
          <div class="left">
            <img src="@/assets/images/battery.png" class="w-44px h-44px -mr-2px">
          </div>
          <div class="rightArea rightArea--2">
            <div class="cost">
              {{ actualTRXPrice }} TRX
            </div>
            <div class="text">
              {{ t('tips.iconText2', { saved: savedTRXPercent }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tips-container {
  box-sizing: border-box;
  padding-top: 14px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 39px;
  border-radius: 20px;
  background-color: #fff;
}

.tips-container__header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 22px;
}

.tip-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  color: #000000;
  margin: 0 auto;
  padding-bottom: 15px;
}

.tip-img {
  width: 81px;
  height: 77px;
}

.tip-item-box {
  padding-bottom: 20px;
}

.tip-item {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  display: flex;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &::before {
    content: "";
    display: block;
    width: 5px;
    height: 5px;
    flex: none;
    border-radius: 5px;
    margin-right: 6px;
    position: relative;
    top: 7px;
    /* 蓝红 */
    background: linear-gradient(239deg, #01ff84 9%, #e73f2e 89%);
  }
}

.compari-content {
  text-align: left;
  padding-left: 3px;
}

.comp-title {
  font-size: 14px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: normal;
  /* 正文色/正文色 */
  color: #1A1A1A;
  padding-bottom: 10px;
}

.comp-des {
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: #000;
}

.comp-eg {
  padding-top: 31px;
  display: flex;
}

.comp-eg-item {
  display: flex;
  align-items: center;
}

.rightArea {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 150%;
}

.cost {
  font-size: 12px;
  font-weight: bold;
  color: #1A1A1A;
}

.text {
  font-size: 10px;
  color: #9E9E9E;
}
</style>
