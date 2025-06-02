<script setup lang="ts">
import ContactUs from '../components/ContactWe.vue'
import Tips from '../components/Tips.vue'
import LatestOrder from './components/LatestOrder.vue'
import Trade from './components/Trade.vue'
</script>

<template>
  <div class="home">
    <div class="main">
      <div class="main-aside">
        <Tips />
        <ContactUs class="mt-18px" />
      </div>
      <Trade class="w-480px" />
    </div>

    <LatestOrder class="mt-20px" />
  </div>
</template>

<style scoped lang="less">
.home {
  width: 780px;
  margin: 0 auto;
}

.main {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.main-aside {
  width: 280px;
}
</style>
