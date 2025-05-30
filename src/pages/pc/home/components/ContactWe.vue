<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function sendEmail() {
  if (typeof window !== 'undefined') {
    window.open(`mailto:support@trxres.com`)
  }
}
function openTelegram() {
  window.open('https://t.me/realTRXRes', '_blank')
}
</script>

<template>
  <div class="card-container">
    <h3 class="tip-title">
      {{ t('tips.contactTitle') }}
    </h3>
    <img src="@/assets/images/contact.png" class="card-img">
    <div class="card-content">
      <div class="card-content__item">
        <button type="info" class="contact-button" @click="() => sendEmail()">
          <i class="i-icon:email" /> Gmail
        </button>
      </div>
      <div class="card-content__item">
        <button type="info" class="contact-button" @click="() => openTelegram()">
          <i class="i-icon:telegram" /> Telegram
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card-container {
  padding: 14px 20px 25px;
  border-radius: 20px;
  background-color: #fff;
  text-align: center;
  display: flex;;
  flex-direction: column;
  align-items: center;
}

.tip-title {
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  margin: 0;
  padding-bottom: 18px;
}

.card-img {
  width: 81px;
  height: 81px;
}

.icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}

.card-content {
  padding-top: 23px;
  width: 100%;
  &__item {
    &:not(:last-child) {
      margin-left: 0 !important;
      margin-bottom: 15px;
    }
  }
}
.contact-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 0;
  outline: none;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }

  i {
    font-size: 18px;
    margin-right: 4px;
  }
}
</style>
