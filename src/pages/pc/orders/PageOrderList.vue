<script setup>
import { ref, toRefs, watch } from 'vue'
import { apiGetOrderList } from '@/api'
import useAccountStore from '@/store/account'
import OrderCard from './OrderCard.vue'

const page = ref(1)
const pageSize = ref(10)
const accountStore = useAccountStore()

const { address } = toRefs(accountStore)

// 订单列表数据
const { data: tableData, run, loading } = useRequest(apiGetOrderList, {
  manual: true, // 手动触发请求
  defaultParams: [{ fromAddress: address.value, pageSize: pageSize.value, page: page.value }], // 默认参数
})

watch(
  [address, page, pageSize],
  ([newAddress, newPage, newPageSize]) => {
    if (newAddress) {
      run({
        fromAddress: newAddress,
        pageSize: newPageSize,
        page: newPage,
      })
    }
  },
  { immediate: true },
)
function handleSizeChange(val) {
  pageSize.value = val
  page.value = 1
}
function handleCurrentChange(val) {
  page.value = val
}
</script>

<template>
  <div class="order-wrapper">
    <h3 class="flex items-center">
      <div class="orderIconWarp mr-10px">
        <img src="@/assets/images/order.png" class="w-30px">
      </div>
      {{ $t('order.orderTitle') }}
    </h3>
    <div class="order-list-title">
      <p>{{ $t('order.orderInfo') }}</p>
      <p>{{ $t('order.time') }}</p>
      <p class="text-center">
        {{ $t('order.status') }}
      </p>
      <p class="tr">
        {{ $t('order.pledgeAddress') }}
      </p>
    </div>
    <ul v-if="tableData" v-loading="loading" class="order-list">
      <li v-for="item in tableData.data" :key="item.id" class="item">
        <OrderCard :data="item" />
      </li>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mr-14 mt-14"
        :diable="loading"
        :page-sizes="[8, 20, 50, 100]"
        :size="pageSize"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </ul>
  </div>
</template>

<style lang="less" scoped>
.order-wrapper {
  width: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 30px;
  background-color: #fff;
  .orderIconWarp{
    background-color: #000; border-radius: 6px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  }
  .svgIcon{
    color: #000;
  }
  h3 {
    font-size: 18px;
    line-height: 1;
    margin: 0;
  }
}

.order-list-title {
  display: flex;
  padding: 20px;

  p {
    flex: 1;
    margin: 0;
    &:first-child {
      width: 80px !important;
      flex: auto;
    }
    &.tr {
      text-align: right;
    }
  }
}

.order-list {

  .item {
    border-radius: 6px;
    background-color: #F6F7FB;

    &:nth-child(even) {
      background-color: #fff;
    }
  }
}
</style>
