<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <div class="layout">
    <AppSidebar />

    <div class="content-area">
      <main>
        <div class="home-wrap">
          <div class="home-title">ホームページ</div>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
 .home-wrap {
     height: 90vh; 
     display: flex;
     align-items: center;
     justify-content: center; 
 }
 
.home-title {
    font-size: 64px;
    font-weight: 700;
    color: #003770;
    text-align: center;
}

</style>