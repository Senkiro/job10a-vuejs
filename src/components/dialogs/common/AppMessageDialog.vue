<script setup lang="ts">
import Dialog from "primevue/dialog";
import { computed } from "vue";
import {
  messageDialogState,
  closeMessageDialog,
} from "@/services/messageDialogService";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";
import DialogOkFooter from "./DialogOkFooter.vue";

const iconClass = computed(() => {
  switch (messageDialogState.icon) {
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
</script>

<template>
  <Dialog
    v-model:visible="messageDialogState.visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: '28rem' }"
    :header="messageDialogState.title"
    position="top"
  >
    <div class="message-body">
      <i v-if="iconClass" :class="iconClass" class="message-icon" />
      <div class="message-text">
        {{ messageDialogState.message }}
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <DialogOkFooter @confirm="closeMessageDialog" autofocus />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.message-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
}

.message-icon {
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 2px;
}

.message-text {
  flex: 1;
  white-space: pre-line;
  font-size: 16px;
}

.message-footer {
  display: flex;
  justify-content: flex-end;
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
