<script setup>
import { computed } from 'vue'

const {
  src,
  title,
  chain,
  address,
  amount,
  avaibleAmount,
  usdtValue,
} = defineProps({
  src: {
    type: String,
  },
  title: {
    type: String,
    default: 'Tether USD(USDT)',
  },
  chain: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
  },
  avaibleAmount: {
    type: Number,
    default: 0,
  },
  usdtValue: {
    type: Number,
    default: 0,
  },
})

const addressStr = computed(() => {
  if (address) {
    if (address.length > 34) { // 修正为 address.length
      return `${address.slice(0, 17)}...${address.slice(-17)}`
    }
    else {
      return address
    }
  }
  else {
    return ''
  }
})
</script>

<template>
  <div class="balance-item">
    <div class="item__header">
      <img class="item-avatar" :src="src" alt="">
      <div class="item-info">
        <div class="flex items-center">
          <span class="text-14px font-bold">
            {{ title }}
          </span>
          <span v-if="chain" class="item-chain">
            {{ chain }}
          </span>
        </div>
        <span v-if="chain" class="address">
          {{ addressStr }}
        </span>
      </div>
    </div>

    <div class="mt-15px">
      <p class="text-16px font-bold">
        {{ amount }} <span v-if="avaibleAmount">(Available:{{ avaibleAmount }})</span>
      </p>
      <p v-if="usdtValue" class="text-14px mt-4px">
        ≈ {{ usdtValue }} USDT
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.balance-item {
  padding: 15px;
  border-radius: 10px;
  background-color: #F6F7FB;
}

.item__header {
  display: flex;
  align-items: center;
  gap: 10px;

  .item-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .item-info {
    display: flex;
    flex-direction: column;
  }
  .item-chain {
    padding: 2px 5px;
    border-radius: 3px;
    margin-left: 10px;
    font-size: 12px;
    line-height: 1;
    font-weight: bold;
    color: #fff;
    background-color: #000000;
  }
  .address {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1;
    font-weight: normal;
    color: #767676;
  }
}
</style>
