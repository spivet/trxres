<script setup lang="ts">
import ContactUs from '../components/ContactWe.vue'
import Tips from '../components/Tips.vue'
import PageOrderList from './PageOrderList.vue'
</script>

<template>
  <div class="home">
    <div class="main">
      <div class="main-aside">
        <div class="flex items-center mb-30px cursor-pointer" @click="() => $router.back()">
          <img class="w-30px h-30px mr-30px" src="@/assets/images/back.png">
          <span class="text-30px leading-30px color-#000">
            返回
          </span>
        </div>
        <Tips />
        <ContactUs class="mt-18px" />
      </div>

      <PageOrderList />
    </div>
  </div>
</template>

<style scoped lang="less">
.home {
  width: 1050px;
  margin: 0 auto;
}

.main {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.main-aside {
  flex-shrink: 0;
  width: 280px;
  margin-right: 20px;
}
</style>
