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

const visible = ref(false);

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
              @click="visible = false"
            />
          </template>
        </Dialog>
      </div>

      <AppFooter
        :buttons="footerjob30"
        :enabled-keys="[4]"
        @key-click="handleFooterKeyClick"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 16px;
}

.dialog-header-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.dialog-name {
  font-weight: 700;
  white-space: nowrap;
}

.dialog-desc {
  display: block;
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row label {
  width: 90px;
  font-weight: 600;
}

.input-grow {
  flex: 1;
}
</style>
