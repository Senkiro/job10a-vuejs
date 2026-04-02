<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import { footerJob10a } from "@/constants/footerButtonsConfigs";
import { headerMenusJob10a } from "@/constants/headerConfigs";
import { ref } from "vue";
import PrintRangeDialog from "@/components/dialogs/job10a/print-range/PrintRangeDialog.vue";
import OutputSettingsDialog from "@/components/dialogs/job10a/output-settings/OutputSettingsDialog.vue";

const showPrintRangeDialog = ref(false);
const showOutputSettingsDialog = ref(false);
const showMonthSelectDialog = ref(false);

function handleFooterKeyClick(key: number) {
  switch (key) {
    case 2:
      showPrintRangeDialog.value = true;
      break;
    case 4:
      showOutputSettingsDialog.value = true;
      break;
    case 8:
      showMonthSelectDialog.value = true;
      break;
  }
}

function handlePrintRange() {
  console.log("Thực hiện in");
}
</script>

<template>
  <div class="layout">
    <AppSidebar />

    <div class="content-area">
      <AppHeader
        user-name="User 0001"
        title="科目履歴一覧"
        period-text="当期：自 2026年 1月 1日 至 2026年12月31日"
        screen-code="KNMRI-1"
        :menus="headerMenusJob10a"
        :show-help="true"
        :show-shortcut="true"
      />

      <main>
        <h1>job10a</h1>
      </main>

      <PrintRangeDialog
        v-model:visible="showPrintRangeDialog"
        @confirm="handlePrintRange"
      />

      <OutputSettingsDialog
        v-model:visible="showOutputSettingsDialog"
        @confirm="handlePrintRange"
      />

      <AppFooter
        :buttons="footerJob10a"
        :enabled-keys="[2, 4, 8]"
        @key-click="handleFooterKeyClick"
      />
    </div>
  </div>
</template>

<style scoped></style>
