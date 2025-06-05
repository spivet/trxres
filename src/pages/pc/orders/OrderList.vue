<script setup lang="ts">
import { useWallet } from '@tronweb3/tronwallet-adapter-vue-hooks'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGetOrderList } from '@/api'
import { OrderStatus } from '@/constants'
import { formatTimestamp } from '@/utils/utils.js'

// 定义订单项类型
interface OrderItem {
  id: string | number
  orderPrice: number
  pledgeDay?: number
  pledgeHour?: number
  pledgeMinute?: number
  pledgeNum: number
  startTime: number
  status: string
  fromAddress: string
}

const { t } = useI18n()
const page = ref(1)
const pageSize = ref(10)

const { address } = useWallet()

// 订单列表数据
const { data: tableData, run, loading } = useRequest(apiGetOrderList, {
  manual: true, // 手动触发请求
})

// 格式化时间显示
function formatTime(row: OrderItem): string {
  const { pledgeDay, pledgeHour, pledgeMinute } = row
  if (pledgeDay && typeof pledgeDay === 'number') {
    return pledgeDay + t('app.day')
  }
  else if (pledgeHour && typeof pledgeHour === 'number') {
    return pledgeHour + t('app.hour')
  }
  else if (pledgeMinute && typeof pledgeMinute === 'number') {
    return pledgeMinute + t('app.minute')
  }
  return ''
}

// 格式化地址显示
function formatAddress(address: string): string {
  if (!address)
    return ''
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// 设置状态样式
function getStatusClass(status: number): string {
  if (status === OrderStatus.Invalid) {
    return 'color-danger'
  }
  else if (status !== OrderStatus.Invalid && status !== OrderStatus.Ended) {
    return 'color-warning'
  }
  return 'color-success'
}

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
function handleSizeChange(val: number): void {
  pageSize.value = val
  page.value = 1
}
function handleCurrentChange(val: number): void {
  page.value = val
}

function cellClassName({ rowIndex, columnIndex }: { rowIndex: number, columnIndex: number }) {
  let baseStyle = 'color-#000 font-400! border-b-0!'
  // 偶数
  if (rowIndex % 2 === 0) {
    baseStyle += ' bg-#F6F7FB!'
    if (columnIndex === 0) {
      return `${baseStyle} rounded-tl-6px rounded-bl-6px`
    }
    if (columnIndex === 3) {
      return `${baseStyle} rounded-tr-6px rounded-br-6px`
    }
    return baseStyle
  }
  return baseStyle
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

    <!-- 使用 el-table -->
    <el-table
      v-loading="loading"
      :data="tableData?.data"
      style="width: 100%"
      header-cell-class-name="color-#000 font-400! border-b-0!"
      :cell-class-name="cellClassName"
    >
      <!-- 订单信息列 -->
      <el-table-column :label="$t('order.orderInfo')" min-width="280">
        <template #default="{ row }">
          <div class="order-info">
            <p>{{ $t('app.unitPrice') }}：<strong>{{ row.orderPrice }} SUN</strong></p>
            <p>{{ $t('fastTradingDialog.rentalDuration') }}：<strong>{{ formatTime(row) }}</strong></p>
            <p>{{ $t('fastTradingDialog.rentalAmount') }}：<strong>{{ row.pledgeNum }}</strong></p>
          </div>
        </template>
      </el-table-column>

      <!-- 时间列 -->
      <el-table-column :label="$t('order.time')" min-width="180">
        <template #default="{ row }">
          <span>{{ formatTimestamp(row.startTime) }}</span>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column :label="$t('order.status')" align="center" min-width="120">
        <template #default="{ row }">
          <span
            class="status-tag"
            :class="getStatusClass(row.status)"
          >
            {{ $t(`order.${row.status}`) }}
          </span>
        </template>
      </el-table-column>

      <!-- 地址列 -->
      <el-table-column :label="$t('order.pledgeAddress')" align="right" min-width="150">
        <template #default="{ row }">
          <strong>{{ formatAddress(row.fromAddress) }}</strong>
        </template>
      </el-table-column>

      <template #empty>
        <div class="empty mt-14 mb-14">
          <img src="@/assets/images/no-data.png" class="w-80px h-80px" alt="empty">
          <div class="fw-bold">
            {{ $t('order.noData') }}
          </div>
        </div>
      </template>
    </el-table>
    <div v-if="tableData" class="pagination-container">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        class="mt-20px"
        :disabled="loading"
        :page-sizes="[10, 20, 50, 100]"
        size="default"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
    background-color: #000;
    border-radius: 6px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h3 {
    font-size: 18px;
    line-height: 1;
    margin: 0;
    margin-bottom: 20px;
  }
}

.table-header {
  font-weight: bold;
  color: #000;
  background-color: #f5f7fa;
}

.order-info {
  p {
    font-size: 12px;
    margin: 0;
    line-height: 1.5;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}

.status-tag {
  font-size: 12px;
  font-weight: bold;

  &.color-success {
    color: var(--el-color-success);
  }

  &.color-warning {
    color: var(--el-color-warning);
  }

  &.color-danger {
    color: var(--el-color-danger);
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
</style>
