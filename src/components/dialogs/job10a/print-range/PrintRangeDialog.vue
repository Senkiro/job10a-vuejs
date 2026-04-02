<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref, watch } from "vue";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";

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
  emit("confirm", {
    from: fromValue.value,
    to: toValue.value,
  });
  emit("update:visible", false);
}

function handleSearch() {
  emit("search");
}

function handleHistorySearch() {
  emit("historySearch");
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
            @click="handleSearch"
          />
          <Button
            label="履歴検索"
            class="action-btn primary-btn"
            @click="handleHistorySearch"
          />
        </div>

        <DialogDefaultFooter @confirm="confirmDialog" @cancel="closeDialog" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-body {
  padding: 20px 0 10px 0;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.field-label {
  min-width: 170px;
  height: 34px;
  background: #2f73c9;
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}

.range-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.range-input {
  width: 270px;
  height: 34px;
}

.range-separator {
  font-size: 22px;
  color: #333;
  line-height: 1;
}

.hint-text {
  margin-top: 6px;
  margin-left: 2px;
  font-size: 18px;
  color: #000;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
}

.footer-left {
  display: flex;
  gap: 10px;
}
</style>
