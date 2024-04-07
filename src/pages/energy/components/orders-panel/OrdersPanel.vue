<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import OrderCard from './OrderCard.vue'
import OrderCell from './OrderCell.vue'
import OrderDetail from './OrderDetail.vue'
import KeleTabs from '@/components/kele-tabs/KeleTabs.vue'
import KeleTab from '@/components/kele-tabs/KeleTab.vue'
import PopoverSelect from '@/components/popover-select/index.vue'
import { apiGetOrderList } from '@/api'
import { OrderStatus, SortType } from '@/constants'
import useAccountStore from '@/store/account'

const { t } = useI18n()
const accountStore = useAccountStore()
const { address } = toRefs(accountStore)

const Tabs = {
  TRADE: 'trades', // 最近交易
  MY_ORDER: 'myOrder', // 我的订单
}
const activeTab = ref(Tabs.TRADE)

const { data: completedData } = useRequest(apiGetOrderList, {
  defaultParams: [{ status: OrderStatus.Ended }],
})
const completedList = computed(() => {
  return completedData.value?.data.map((item) => {
    return {
      ...item,
      time: dayjs(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
      unitPrice: `${item.orderPrice} SUN`,
      unit: calculatePriceUnit(item.pledgeDay, item.pledgeHour, item.pledgeMinute),
    }
  })
})

// 我的订单
const statusType = ref<API.OrderStatus | undefined>()
const statusOptions = computed(() => [
  {
    name: t('order.all'),
    value: undefined,
  },
  {
    name: t('order.0'),
    value: OrderStatus.Unpaid,
  },
  {
    name: t('order.1'),
    value: OrderStatus.Paid,
  },
  {
    name: t('order.2'),
    value: OrderStatus.Renting,
  },
  {
    name: t('order.3'),
    value: OrderStatus.Redeeming,
  },
  {
    name: t('order.4'),
    value: OrderStatus.Ended,
  },
  {
    name: t('order.5'),
    value: OrderStatus.Invalid,
  },
])
const sortType = ref(SortType.OrderTimeDesc)
const sortOptions = computed(() => [
  {
    name: t('order.latest'),
    value: SortType.OrderTimeDesc,
  },
  {
    name: t('order.highestPrice'),
    value: SortType.PriceDesc,
  },
  {
    name: t('order.highestEnergy'),
    value: SortType.EnergyDesc,
  },
])
const pageing = ref({
  page: 1,
  pageSize: 20,
  total: 0,
})
const { data: myOrderData, runAsync: getMyOrder } = useRequest(apiGetOrderList, {
  manual: true,
  onSuccess(data) {
    const { pagination } = data
    pageing.value = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
    }
  },
})
watch(address, (newVal) => {
  if (!newVal)
    return
  getMyOrder({
    fromAddress: address.value,
    status: statusType.value,
    sort: sortType.value,
  })
}, { immediate: true })
function handleOrderStatusChange({ value }: any) {
  getMyOrder({
    fromAddress: address.value,
    status: value,
    sort: sortType.value,
  })
}
function handleSortChange({ value }: any) {
  getMyOrder({
    fromAddress: address.value,
    status: statusType.value,
    sort: value,
  })
}
function handleCurrentChange(page: number) {
  getMyOrder({
    fromAddress: address.value,
    status: statusType.value,
    sort: sortType.value,
    page,
  })
}
const myOrderList = computed(() => {
  return myOrderData.value?.data.map((item) => {
    return {
      ...item,
      time: dayjs(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
      unitPrice: `${item.orderPrice} SUN`,
      unit: calculatePriceUnit(item.pledgeDay, item.pledgeHour, item.pledgeMinute),
      statusTxt: t(`order.${item.status}`),
    }
  })
})

const currentOrder = ref({} as API.IOrderItem)
const showOrderDetail = ref(false)
function openOrderDetail(order: API.IOrderItem) {
  currentOrder.value = order
  showOrderDetail.value = true
}

function calculatePriceUnit(pledgeDay: number, pledgeHour: number, pledgeMinute: number) {
  return pledgeDay ? `${t('app.day')}` : pledgeHour ? `${pledgeHour}${t('app.hour')}` : `${pledgeMinute}${t('app.minute')}`
}
</script>

<template>
  <KeleTabs v-model="activeTab" title-active-color="#4356FC">
    <KeleTab :key="Tabs.TRADE" :title="$t('app.trades')">
      <div class="flex flex-col gap-24px">
        <OrderCard
          v-for="completedItem in completedList"
          :key="completedItem.orderId"
          :time="completedItem.time"
        >
          <template #order-tag>
            <van-tag plain color="#4356FC" class="order-tag" @click="openOrderDetail(completedItem)">
              {{ $t('app.viewDetail') }}
            </van-tag>
          </template>
          <div class="flex-between">
            <OrderCell :label="`${$t('app.price')}/${completedItem.unit}`" :value="completedItem.unitPrice" />
            <OrderCell :label="$t('app.energy')" :value="`${completedItem.pledgeNum} SUN`" />
          </div>
          <OrderCell :label="$t('app.leaseHash')">
            <template #value>
              <van-text-ellipsis class="w-300px font-bold" :content="completedItem.pledgeHash" position="middle" />
            </template>
          </OrderCell>
        </OrderCard>
      </div>
    </KeleTab>

    <KeleTab v-if="address" :key="Tabs.MY_ORDER" :title="$t('app.myOrder')">
      <div class="flex flex-col gap-24px">
        <div class="select-bar">
          <PopoverSelect v-model="statusType" :options="statusOptions" @changed="handleOrderStatusChange" />
          <PopoverSelect v-model="sortType" :options="sortOptions" @changed="handleSortChange" />
        </div>
        <template v-if="myOrderList?.length">
          <OrderCard
            v-for="myOrderItem in myOrderList"
            :key="myOrderItem.orderId"
            :time="myOrderItem.time"
          >
            <template #order-tag>
              <van-tag plain color="#4356FC" class="order-tag" @click="openOrderDetail(myOrderItem)">
                {{ $t('app.viewDetail') }}
              </van-tag>
            </template>
            <OrderCell class="flex-between" :label="$t('app.orderStatus')">
              <template #value>
                <span
                  class="font-bold"
                  :class="{
                    'color-function-warning': myOrderItem.status !== OrderStatus.Invalid && myOrderItem.status !== OrderStatus.Ended,
                    'color-function-danger': myOrderItem.status === OrderStatus.Invalid,
                  }"
                >
                  {{ myOrderItem.statusTxt }}
                </span>
              </template>
            </OrderCell>
            <div class="flex-between">
              <OrderCell :label="`${$t('app.price')}/${myOrderItem.unit}`" :value="myOrderItem.unitPrice" />
              <OrderCell :label="$t('app.energy')" :value="`${myOrderItem.pledgeNum} SUN`" />
            </div>
            <OrderCell :label="$t('app.receiver')">
              <template #value>
                <van-text-ellipsis class="w-300px font-bold color-brand" :content="myOrderItem.pledgeHash" position="middle" />
              </template>
            </OrderCell>
          </OrderCard>
          <el-pagination
            background
            hide-on-single-page
            :page-size="20"
            :pager-count="5"
            layout="prev, pager, next"
            :total="pageing.total"
            class="pagination"
            @current-change="handleCurrentChange"
          />
        </template>
        <van-empty v-else />
      </div>
    </KeleTab>
  </KeleTabs>

  <!-- 订单详情弹框 -->
  <OrderDetail v-model:visible="showOrderDetail" :data="currentOrder" />
</template>

<style lang="less" scoped>
.order-tag {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 22px;
  line-height: 26px;
  cursor: pointer;
}
.select-bar {
  display: flex;
  justify-content: flex-end;
  gap: 24px;

  :deep(.van-popover__wrapper) {
    flex: 1;
  }
}
.pagination {
  justify-content: center;
  margin-top: 12px;

  :deep(&.is-background .el-pager li.is-active) {
    background-color: var(--kele-color-brand);
  }
}
</style>
