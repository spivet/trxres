<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useAccountStore from '@/store/account'

// 使用i18n进行国际化
const { t } = useI18n()
const accountStore = useAccountStore()

// 能量租赁相关数据
const energyAmount = ref(64000)
const durationOptions = [
  { label: '10分钟', value: 0.1 },
  { label: '1小时', value: 1 },
  { label: '3小时', value: 3 },
  { label: '1天', value: 24 },
]
const selectedDuration = ref(durationOptions[1].value)
const receivingAddress = ref('')

// 价格数据
const energyPrice = ref(6.123)
const totalPrice = computed(() => {
  return (energyAmount.value * energyPrice.value / 1000000).toFixed(2)
})

// 订单数据
const latestOrders = [
  { time: '2025-03-31 17:40', type: '能量', amount: '64,000', price: '78 SUN', duration: '0.1', address: 'TC5X...yoUy' },
  { time: '2025-03-31 17:12', type: '能量', amount: '64,000', price: '95 SUN', duration: '1', address: 'TVh...vev' },
  { time: '2025-03-31 17:01', type: '带宽', amount: '1,000', price: '78 SUN', duration: '24', address: 'TUdQ...hEAV' },
  { time: '2025-03-31 17:12', type: '能量', amount: '64,000', price: '95 SUN', duration: '10', address: 'TVh...vev' },
  { time: '2025-03-31 17:40', type: '带宽', amount: '1,000', price: '78 SUN', duration: '3', address: 'TC5X...yoUy' },
]

// 连接钱包
const connectWallet = async () => {
  await accountStore.connect()
}

// 提交订单
const submitOrder = () => {
  if (!accountStore.address) {
    connectWallet()
    return
  }
  // 提交订单逻辑
}

// 发送邮件
const sendEmail = () => {
  window.location.href = 'mailto:contact@trxres.com'
}

// 打开Telegram
const openTelegram = () => {
  window.open('https://t.me/trxres', '_blank')
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <div class="home-page">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 能量租赁区域 -->
      <div class="energy-rental-section">
        <div class="tabs">
          <div class="tab active">小贴士</div>
          <div class="tab">能量</div>
          <div class="tab">带宽</div>
        </div>

        <div class="tips-content">
          <div class="tips-icon">
            <img src="@/assets/images/tips.png" alt="Tips">
          </div>
          <div class="tips-text">
            <p>• 使用能量进行TRX转账、钱包、游戏和Dapp操作可降低网络使用费。</p>
            <p>• 租用的能量在合约正常运行时间内持续可用，租用结束后自动回收。</p>
          </div>
        </div>

        <div class="rental-form">
          <div class="form-header">
            <div class="form-title">特价套餐</div>
            <div class="form-subtitle">余额: 132.22 TRX</div>
          </div>

          <div class="form-group">
            <div class="form-label">能量</div>
            <div class="form-input-group">
              <input type="text" v-model="energyAmount" class="form-input" />
              <span class="form-input-suffix">每小时 6.123 TRX/10 万能</span>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">租用时长</div>
            <div class="duration-options">
              <div
                v-for="option in durationOptions"
                :key="option.value"
                :class="['duration-option', selectedDuration === option.value ? 'active' : '']"
                @click="selectedDuration = option.value"
              >
                {{ option.label }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">特价租用方式 USDT</div>
            <div class="form-dropdown">
              <div class="dropdown-value">-</div>
              <div class="dropdown-arrow"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">接收地址</div>
            <div class="form-input-group">
              <input type="text" v-model="receivingAddress" class="form-input" placeholder="输入接收能量的地址" />
            </div>
          </div>

          <div class="payment-summary">
            <div class="payment-item">
              <div class="payment-label">支付金额</div>
              <div class="payment-value">{{ totalPrice }} TRX</div>
            </div>
            <div class="payment-details">
              <p>每小时 SUN, 正常价格 TRX 75% 折扣, 购买 0 TRX (0.00)</p>
              <p>我们将为您支付能量 20,769.52 TRX (32,123.45)</p>
            </div>
          </div>

          <button class="payment-button" @click="submitOrder">
            {{ t('home.pay') }}
          </button>
        </div>
      </div>

      <!-- 价格对比区域 -->
      <div class="price-comparison-section">
        <div class="section-title">对比</div>
        <div class="comparison-cards">
          <div class="comparison-card">
            <div class="comparison-card-header">
              <div class="comparison-card-title">租用→ USDT 转账</div>
              <div class="comparison-card-subtitle">建议的交易方式，使用USDT，交易手续费低</div>
            </div>
            <div class="comparison-card-content">
              <div class="price-tag">
                <img src="@/assets/images/fire.png" alt="Fire" class="price-icon">
                <div class="price-value">10.8 TRX</div>
              </div>
              <div class="price-details">
                <div class="price-detail-item">能量单价 5.5%</div>
                <div class="price-detail-item">每小时 2.5 SUN</div>
              </div>
            </div>
          </div>

          <div class="comparison-card">
            <div class="comparison-card-header">
              <div class="comparison-card-title">租用→ TRX 转账</div>
              <div class="comparison-card-subtitle">建议的交易方式，使用TRX，交易手续费低</div>
            </div>
            <div class="comparison-card-content">
              <div class="price-tag">
                <img src="@/assets/images/battery.png" alt="Battery" class="price-icon">
                <div class="price-value">5.65 TRX</div>
              </div>
              <div class="price-details">
                <div class="price-detail-item">能量单价 3.5%</div>
                <div class="price-detail-item">每小时 2.0 SUN</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系我们区域 -->
      <div class="contact-section">
        <div class="section-title">联系我们</div>
        <div class="contact-content">
          <img src="@/assets/images/contact.png" alt="Contact" class="contact-image">
          <div class="contact-buttons">
            <button class="contact-button email" @click="sendEmail">
              <i class="i-icon:book mr-2"></i>
              Email
            </button>
            <button class="contact-button telegram" @click="openTelegram">
              <i class="i-icon:plugin mr-2"></i>
              Telegram
            </button>
          </div>
        </div>
      </div>

      <!-- 最新订单区域 -->
      <div class="latest-orders-section">
        <div class="section-header">
          <div class="section-title">最新订单</div>
          <div class="view-more">查看更多</div>
        </div>
        <div class="orders-table">
          <div class="orders-table-header">
            <div class="order-header-cell">时间</div>
            <div class="order-header-cell">类型</div>
            <div class="order-header-cell">数量</div>
            <div class="order-header-cell">价格</div>
            <div class="order-header-cell">租用时长/小时</div>
            <div class="order-header-cell">接收地址</div>
          </div>
          <div v-for="(order, index) in latestOrders" :key="index" class="orders-table-row">
            <div class="order-cell">{{ order.time }}</div>
            <div class="order-cell">{{ order.type }}</div>
            <div class="order-cell">{{ order.amount }}</div>
            <div class="order-cell">{{ order.price }}</div>
            <div class="order-cell">{{ order.duration }}</div>
            <div class="order-cell">{{ order.address }}</div>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="footer">
        <div class="footer-content">
          <div class="copyright">©2025 TRXRes All rights reserved.</div>
          <div class="terms">服务协议</div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-page {
  padding-top: 64px; /* 为固定的header留出空间 */
  min-height: 100vh;
  background-color: var(--kele-color-bg-page);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #1B2124;
  margin-bottom: 16px;
}

.energy-rental-section,
.price-comparison-section,
.contact-section,
.latest-orders-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 24px;
}

/* 能量租赁区域 */
.tabs {
  display: flex;
  border-bottom: 1px solid #f2f3f5;
  margin: -24px -24px 24px -24px;
}

.tab {
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #97999B;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;

  &:hover {
    color: var(--kele-color-brand);
  }

  &.active {
    color: #fff;
    background-color: #000;
  }
}

.tips-content {
  display: flex;
  padding: 24px;
  background-color: #f8f8fa;
  gap: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.tips-icon {
  flex-shrink: 0;

  img {
    width: 40px;
    height: 40px;
  }
}

.tips-text {
  p {
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.5;
    color: #1B2124;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.rental-form {
  padding: 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-title {
  font-size: 18px;
  font-weight: 500;
  color: #1B2124;
}

.form-subtitle {
  font-size: 14px;
  color: #97999B;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #1B2124;
  margin-bottom: 8px;
}

.form-input-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #f2f3f5;
  border-radius: 4px;
  font-size: 16px;
  color: #1B2124;
  background-color: #fff;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--kele-color-brand);
    outline: none;
  }

  &::placeholder {
    color: #BDBDBD;
  }
}

.form-input-suffix {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #97999B;
}

.duration-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.duration-option {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #f8f8fa;
  font-size: 14px;
  color: #1B2124;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #f2f3f5;
  }

  &.active {
    background-color: var(--kele-color-brand);
    color: #fff;
  }
}

.form-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #f2f3f5;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.dropdown-value {
  font-size: 16px;
  color: #1B2124;
}

.dropdown-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #97999B;
}

.payment-summary {
  background-color: #f8f8fa;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.payment-label {
  font-size: 16px;
  font-weight: 500;
  color: #1B2124;
}

.payment-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--kele-color-brand);
}

.payment-details {
  p {
    margin: 0 0 4px 0;
    font-size: 12px;
    color: #97999B;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.payment-button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 4px;
  background-color: #00C873;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darken(#00C873, 5%);
  }
}

/* 价格对比区域 */
.comparison-cards {
  display: flex;
  gap: 24px;
}

.comparison-card {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f2f3f5;
}

.comparison-card-header {
  padding: 16px;
  background-color: #f8f8fa;
}

.comparison-card-title {
  font-size: 16px;
  font-weight: 500;
  color: #1B2124;
  margin-bottom: 8px;
}

.comparison-card-subtitle {
  font-size: 12px;
  color: #97999B;
}

.comparison-card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-icon {
  width: 24px;
  height: 24px;
}

.price-value {
  font-size: 20px;
  font-weight: 500;
  color: #1B2124;
}

.price-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-detail-item {
  font-size: 14px;
  color: #97999B;
}

/* 联系我们区域 */
.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.contact-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.contact-buttons {
  display: flex;
  gap: 16px;
}

.contact-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;

  &.email {
    background-color: #f8f8fa;
    color: #1B2124;

    &:hover {
      background-color: #f2f3f5;
    }
  }

  &.telegram {
    background-color: #0088cc;
    color: #fff;

    &:hover {
      background-color: darken(#0088cc, 5%);
    }
  }
}

/* 最新订单区域 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.view-more {
  font-size: 14px;
  color: var(--kele-color-brand);
  cursor: pointer;
}

.orders-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f2f3f5;
}

.orders-table-header {
  display: flex;
  background-color: #f8f8fa;
  padding: 12px 16px;
  font-weight: 500;
}

.order-header-cell {
  flex: 1;
  font-size: 14px;
  color: #1B2124;
}

.orders-table-row {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f2f3f5;

  &:last-child {
    border-bottom: none;
  }
}

.order-cell {
  flex: 1;
  font-size: 14px;
  color: #1B2124;
}

/* 页脚 */
.footer {
  margin-top: 24px;
  padding: 24px 0;
  border-top: 1px solid #f2f3f5;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 14px;
  color: #97999B;
}

.terms {
  font-size: 14px;
  color: #1B2124;
  cursor: pointer;

  &:hover {
    color: var(--kele-color-brand);
  }
}
</style>
