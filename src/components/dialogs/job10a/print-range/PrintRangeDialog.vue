<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref, watch } from "vue";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import SeqSearchDialog from "@/components/dialogs/job10a/seq-search/SeqSearchDialog.vue";
import PrintSettingsDialog from "../print-settings/PrintSettingsDialog.vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm", payload: { from: string; to: string }): void;
  (e: "search"): void;
  (e: "historySearch"): void;
}>();

const fromValue = ref("");
const toValue = ref("");

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      fromValue.value = "";
      toValue.value = "";
    }
  },
);

function closeDialog() {
  emit("update:visible", false);
}

function confirmDialog() {
  showPrintSettingsDialog.value = true;
}

function handleSearch() {
  emit("search");
}

function handleHistorySearch() {
  emit("historySearch");
}

const seqSearchVisible = ref(false);

const kamokuItems = ref([
  {
    kicd: "1001",
    kcod: "A01",
    kana: "アイウ",
    shortName: "科目A",
    longName: "科目A正式名称",
  },
  {
    kicd: "1002",
    kcod: "B01",
    kana: "カキク",
    shortName: "科目B",
    longName: "科目B正式名称",
  },
]);

function handleSubmit(row: any) {
  console.log("selected:", row);
}

const showPrintSettingsDialog = ref(false);

function handlePrintSettingsConfirm(payload: any) {
  console.log("print settings:", payload);

  emit("confirm", {
    from: fromValue.value,
    to: toValue.value,
  });
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="印刷範囲指定"
    :closable="true"
    :draggable="false"
    :style="{ width: '820px' }"
    v-focustrap
    position="top"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="dialog-body">
      <div class="form-row">
        <div class="field-label">科目</div>

        <div class="range-area">
          <InputText v-model="fromValue" class="range-input" autofocus />
          <span class="range-separator">～</span>
          <InputText v-model="toValue" class="range-input" />
        </div>
      </div>

      <div class="hint-text">(科目は内部コードで指定します)</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <Button
            label="検索"
            class="action-btn primary-btn"
            @click="seqSearchVisible = true"
          />
          <Button
            label="履歴検索"
            class="action-btn primary-btn"
            @click="handleHistorySearch"
          />
        </div>

        <SeqSearchDialog
          v-model:visible="seqSearchVisible"
          :items="kamokuItems"
          @submit="handleSubmit"
        />
        <PrintSettingsDialog
          v-model:visible="showPrintSettingsDialog"
          @confirm="handlePrintSettingsConfirm"
        />
        <DialogDefaultFooter @confirm="confirmDialog" @cancel="closeDialog" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped src="./PrintRangeDialog.css"></style>
