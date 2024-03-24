<script setup lang="ts">
import { ref } from 'vue'
import OrderCard from './OrderCard.vue'
import OrderCell from './OrderCell.vue'
import KeleTabs from '@/components/kele-tabs/KeleTabs.vue'
import KeleTab from '@/components/kele-tabs/KeleTab.vue'
import PopoverSelect from '@/components/popover-select/index.vue'

const Tabs = {
  TRADE: 'trades', // 最近交易
  MY_ORDER: 'myOrder', // 我的订单
}
const activeTab = ref(Tabs.TRADE)
const completedList = [
  {
    id: 1,
    time: '2021-09-01',
    value: '0.1',
  },
  {
    id: 2,
    time: '2021-09-02',
    value: '0.2',
  },
  {
    id: 3,
    time: '2021-09-03',
    value: '0.3',
  },
]

const orderStatusOptions = [
  {
    name: '全部',
    value: 'all',
  },
  {
    name: '进行中',
    value: 'processing',
  },
  {
    name: '已完成',
    value: 'completed',
  },
]
const orderStatus = ref('all')
</script>

<template>
  <KeleTabs v-model="activeTab" title-active-color="#4356FC">
    <KeleTab :key="Tabs.TRADE" :title="$t('app.trades')">
      <div class="flex flex-col gap-24px">
        <OrderCard
          v-for="completedItem in completedList"
          :key="completedItem.id"
          :time="completedItem.time"
        >
          <div class="flex-between">
            <OrderCell :label="$t('app.pricePerDay')" :value="completedItem.value" />
            <OrderCell :label="$t('app.energy')" :value="completedItem.value" />
          </div>
          <OrderCell :label="$t('app.income')" :value="completedItem.value" />
        </OrderCard>
      </div>
    </KeleTab>

    <KeleTab :key="Tabs.MY_ORDER" :title="$t('app.myOrder')">
      <div class="flex flex-col gap-24px">
        <div class="select-bar">
          <PopoverSelect v-model="orderStatus" :options="orderStatusOptions" />
        </div>
        <OrderCard
          v-for="completedItem in completedList"
          :key="completedItem.id"
          :time="completedItem.time"
        >
          <OrderCell class="flex-between" :label="$t('app.orderStatus')" :value="completedItem.value">
            <template #value>
              <span class="color-function-warning font-bold">进行中</span>
            </template>
          </OrderCell>
          <div class="flex-between">
            <OrderCell :label="$t('app.pricePerDay')" :value="completedItem.value" />
            <OrderCell :label="$t('app.energy')" :value="completedItem.value" />
          </div>
          <OrderCell :label="$t('app.income')" :value="completedItem.value">
            <template #value>
              <van-text-ellipsis class="w-300px font-bold color-brand" content="addressBtnText" position="middle" />
            </template>
          </OrderCell>
        </OrderCard>
      </div>
    </KeleTab>
  </KeleTabs>
</template>

<style lang="less" scoped>
.select-bar {
  display: flex;
  justify-content: flex-end;

  :deep(.van-popover__wrapper) {
    width: 50%;
  }
}
</style>
