<script setup lang="ts">
import Dialog from "primevue/dialog";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import { computed } from "vue";
import {
  confirmDialogState,
  resolveConfirmDialog,
} from "@/services/confirmDialogService";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

const iconClass = computed(() => {
  switch (confirmDialogState.icon) {
    case MessageBoxIcon.Info:
      return "pi pi-info-circle text-sky";
    case MessageBoxIcon.Warning:
      return "pi pi-exclamation-triangle text-orange";
    case MessageBoxIcon.Error:
      return "pi pi-times-circle text-red";
    case MessageBoxIcon.Question:
      return "pi pi-question-circle text-indigo";
    case MessageBoxIcon.Success:
      return "pi pi-check-circle text-green";
    default:
      return "";
  }
});

function handleCancel() {
  resolveConfirmDialog(false);
}

function handleOk() {
  resolveConfirmDialog(true);
}

function handleHide() {
  if (confirmDialogState.visible === false && confirmDialogState.resolve) {
    resolveConfirmDialog(false);
  }
}
</script>

<template>
  <Dialog
    v-model:visible="confirmDialogState.visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: '28rem' }"
    :header="confirmDialogState.title"
    position="top"
    @hide="handleHide"
  >
    <div class="confirm-body" v-focustrap>
      <i v-if="iconClass" :class="iconClass" class="confirm-icon" />
      <div class="confirm-message" autofocus>
        {{ confirmDialogState.message }}
      </div>
    </div>

    <template #footer>
      <div class="confirm-footer">
        <DialogDefaultFooter @confirm="handleOk" @cancel="handleCancel" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.confirm-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
}

.confirm-icon {
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 2px;
}

.confirm-message {
  flex: 1;
  white-space: pre-line;
  font-size: 16px;
}

.confirm-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.text-sky {
  color: #0284c7;
}
.text-orange {
  color: #ea580c;
}
.text-red {
  color: #dc2626;
}
.text-indigo {
  color: #4f46e5;
}
.text-green {
  color: #16a34a;
}
</style>
