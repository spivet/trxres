<script setup lang="ts">
import { ref } from 'vue'
import OrderCard from './OrderCard.vue'
import OrderCell from './OrderCell.vue'
import OrderDetail from './OrderDetail.vue'
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

const showOrderDetail = ref(false)
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
          <template #order-tag>
            <van-tag plain color="#EB5757" class="order-tag">
              {{ $t('app.hash') }}
            </van-tag>
          </template>
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
          <PopoverSelect v-model="orderStatus" :options="orderStatusOptions" />
        </div>
        <OrderCard
          v-for="completedItem in completedList"
          :key="completedItem.id"
          :time="completedItem.time"
        >
          <template #order-tag>
            <van-tag plain color="#4356FC" class="order-tag cursor-pointer" @click="showOrderDetail = true">
              {{ $t('app.viewDetail') }}
            </van-tag>
          </template>
          <OrderCell class="flex-between" :label="$t('app.orderStatus')" :value="completedItem.value">
            <template #value>
              <span class="color-function-warning font-bold">进行中</span>
            </template>
          </OrderCell>
          <div class="flex-between">
            <OrderCell :label="$t('app.pricePerDay')" :value="completedItem.value" />
            <OrderCell :label="$t('app.energy')" :value="completedItem.value" />
          </div>
          <OrderCell :label="$t('app.receiver')" :value="completedItem.value">
            <template #value>
              <van-text-ellipsis class="w-300px font-bold color-brand" content="addressBtnText" position="middle" />
            </template>
          </OrderCell>
        </OrderCard>
      </div>
    </KeleTab>
  </KeleTabs>

  <!-- 订单详情弹框 -->
  <OrderDetail v-model:visible="showOrderDetail" />
</template>

<style lang="less" scoped>
.order-tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 22px;
  line-height: 26px;
}
.select-bar {
  display: flex;
  justify-content: flex-end;
  gap: 24px;

  :deep(.van-popover__wrapper) {
    flex: 1;
  }
}
</style>
