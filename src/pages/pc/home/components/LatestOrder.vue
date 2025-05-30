<script setup>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'
import { formatTimestamp, formatTimeToHour, shortenAddress } from '@/utils/utils.js'

const emits = defineEmits({
  showMore: null,
})
const accountStore = useAccountStore()

const { t } = useI18n()
const { history } = toRefs(accountStore)
</script>

<template>
  <div class="page-footer">
    <div class="page-footer__header">
      <p class="title">
        {{ t('order.latest') }}
      </p>
      <p v-if="history && history.length > 0" class="more" @click="emits('showMore')">
        {{ t('order.viewMore') }}
      </p>
    </div>

    <div class="page-footer__content">
      <el-table :data="history" :loading="accountStore.historyLoading" stripe style="width: 780px">
        <el-table-column prop="startTime" :label="$t('order.date')" width="180">
          <template #default="scope">
            <span>{{ formatTimestamp(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" :label="t('order.orderType')" width="180">
          <template #default="scope">
            <span class="fw-bold">{{ scope.row.orderType === 'ENERGY' ? t('app.energy') : t('app.bandwidth') }} {{
              scope.row.pledgeNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderPrice" :label="t('order.price')">
          <template #default="scope">
            <span class="fw-bold">{{ scope.row.orderPrice }} SUN</span>
          </template>
        </el-table-column>
        <el-table-column prop="pledgeMinute" :label="t('order.pledgeHour')">
          <template #default="scope">
            <span class="fw-bold">{{ formatTimeToHour(scope.row.pledgeDay, scope.row.pledgeHour, scope.row.pledgeMinute)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pledgeAddress" :label="t('order.pledgeAddress')" width="140">
          <template #default="scope">
            <span class="address" :title="scope.row.pledgeAddress">{{ shortenAddress(scope.row.pledgeAddress) }}</span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty mt-14 mb-14">
            <img src="@/assets/images/no-data.png" class="w-80px h-80px" alt="empty">
            <div class="fw-bold">
              {{ t('order.noData') }}
            </div>
          </div>
        </template>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-footer {
  padding-top: 24px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 13px;
  border-radius: 20px;
  background-color: #fff;

  &__header {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: 600;
      line-height: normal;
      letter-spacing: normal;
      color: #121212;
      margin: 0;
    }

    .more {
      font-size: 14px;
      cursor: pointer;
      margin: 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
