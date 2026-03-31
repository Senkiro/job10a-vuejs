<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import { ref } from "vue";

function handleFooterKeyClick(key: number) {
  console.log("Đã bấm phím:", key);

  switch (key) {
    case 2:
      console.log("In");
      break;
    case 4:
      console.log("Output settings");
      break;
    case 8:
      console.log("Chọn tháng xử lý");
      break;
  }
}

const showDialog = ref(false);

function openDialog() {
  showDialog.value = true;
}
</script>

<template>
  <div class="layout">
    <AppSidebar />

    <div class="content-area">
      <AppHeader />

      <main>
        <h1>job10a</h1>
      </main>
      <button @click="openDialog">Mở dialog</button>

      <BaseDialog
        v-model:visible="showDialog"
        title="Xác nhận thao tác"
        width="40rem"
      >
        <p>Bạn có chắc chắn muốn thực hiện thao tác này không?</p>

        <template #footer>
          <div style="display: flex; gap: 8px; justify-content: end">
            <button @click="showDialog = false">Hủy</button>
            <button @click="showDialog = false">Xác nhận</button>
          </div>
        </template>
      </BaseDialog>

      <AppFooter :enabled-keys="[2, 4, 8]" @keyClick="handleFooterKeyClick" />
    </div>
  </div>
</template>

<style scoped></style>
