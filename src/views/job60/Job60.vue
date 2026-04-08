<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";

import { ref } from "vue";
import { footerjob30 } from "@/constants/footerButtonsConfigs";
import { headerMenusJob30 } from "@/constants/headerConfigs";
import { ShowConfirmDialog } from "@/services/confirmDialogService";
import { ShowMessageDialog } from "@/services/messageDialogService";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

const visible = ref(false);

async function handleSave() {
  visible.value = false;

  await ShowMessageDialog(
    "Đã lưu dữ liệu thành công",
    "Thông báo",
    MessageBoxIcon.Success,
  );
}

async function handleDelete() {
  const ok = await ShowConfirmDialog(
    "Bạn có chắc muốn xóa dữ liệu này?",
    "Xác nhận xóa",
    MessageBoxIcon.Warning,
  );

  if (!ok) return;

  console.log("User chọn OK");
}

function handleFooterKeyClick(key: number) {
  switch (key) {
    case 2:
      console.log("In");
      break;
    case 4:
      console.log("Output settings");
      break;
    case 8:
      visible.value = true;
      break;
  }
}
</script>

<template>
  <div class="layout">
    <AppSidebar />

    <div class="content-area">
      <AppHeader
        user-name="User 0001"
        title="残高合併"
        period-text=""
        screen-code="GAPPEI-1"
        :menus="headerMenusJob30"
        :show-help="true"
        :show-shortcut="true"
      />

      <main>
        <h1>job30</h1>
      </main>

      <button @click="handleDelete">Delete</button>

      <div class="card">
        <Button label="Show" @click="visible = true" />

        <Dialog
          v-model:visible="visible"
          modal
          header="Edit Profile"
          :style="{ width: '25rem' }"
        >
          <template #header>
            <div class="dialog-header-custom">
              <Avatar
                image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                shape="circle"
              />
              <span class="dialog-name">Amy Elsner</span>
            </div>
          </template>

          <span class="dialog-desc">Update your information.</span>

          <div class="form-row">
            <label for="username">Username</label>
            <InputText id="username" class="input-grow" autocomplete="off" />
          </div>

          <div class="form-row">
            <label for="email">Email</label>
            <InputText id="email" class="input-grow" autocomplete="off" />
          </div>

          <template #footer>
            <Button
              label="Cancel"
              text
              severity="secondary"
              @click="visible = false"
            />
            <Button
              label="Save"
              variant="outlined"
              severity="secondary"
              @click="handleSave"
            />
          </template>
        </Dialog>
      </div>

      <AppFooter
        :buttons="footerjob30"
        :enabled-keys="[4, 8]"
        @key-click="handleFooterKeyClick"
      />
    </div>
  </div>
</template>
