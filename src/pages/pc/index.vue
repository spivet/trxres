<script setup lang=ts>
import { ref } from 'vue'
import PackUpRightIcon from '@/assets/svg/pack-up-right.svg'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import HeaderRight from './components/HeaderRight.vue'
import WalletConnectDialog from './components/WalletConnectDialog.vue'
import Wellet from './components/wellet/index.vue'

// 控制侧边栏
const isWalletVisible = ref(false)
function openWallet() {
  isWalletVisible.value = true
}
function closeWallet() {
  isWalletVisible.value = false
}

// 控制连接钱包对话框
const isWalletConnectVisible = ref(false)
function openWalletConnect() {
  isWalletConnectVisible.value = true
}
function closeWalletConnect() {
  isWalletConnectVisible.value = false
}
</script>

<template>
  <div class="layout">
    <div class="main" :class="{ 'with-aside': isWalletVisible }">
      <div class="content" :class="{ 'with-aside': isWalletVisible }">
        <Header>
          <template #right>
            <HeaderRight v-if="!isWalletVisible" @open-wallet="openWallet" @connect="openWalletConnect" />
          </template>
        </Header>

        <div class="content-main">
          <router-view />
        </div>
      </div>

      <!-- 侧边栏钱包 -->
      <div class="aside" :class="{ visible: isWalletVisible }">
        <PackUpRightIcon class="close-btn" @click="closeWallet" />
        <Wellet class="px-20px py-28px" @unlink="closeWallet" />
      </div>
    </div>
    <Footer />

    <WalletConnectDialog v-model="isWalletConnectVisible" />
  </div>
</template>

<style scoped lang="less">
.layout {
  height: 100vh;
  overflow: hidden;
  background-color: #F9F9FB;
}

.main {
  display: flex;
  height: calc(100vh - 40px);
  position: relative;
  transition: all 0.3s ease;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: all 0.3s ease;

  &.with-aside {
    width: calc(100% - 320px);
  }
}
.content-main {
  flex: 1;
  overflow: auto;
}

.aside {
  position: relative;
  width: 0;
  height: calc(100vh - 70px);
  margin-top: 30px;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;

  &.visible {
    width: 420px;
    opacity: 1;
    visibility: visible;
    margin-right: 20px;
  }

  .close-btn {
    position: absolute;
    top: 30px;
    left: -52px;
    border: none;
    cursor: pointer;
  }
}
</style>
