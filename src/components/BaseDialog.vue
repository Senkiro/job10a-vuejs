<script setup lang="ts">
import Dialog from "primevue/dialog";

type Props = {
  visible: boolean;
  title?: string;
  width?: string;
  modal?: boolean;
  closable?: boolean;
};

withDefaults(defineProps<Props>(), {
  title: "Thông báo",
  width: "30rem",
  modal: true,
  closable: true,
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "close"): void;
}>();

function handleClose() {
  emit("update:visible", false);
  emit("close");
}
</script>

<template>
  <Dialog
    :visible="visible"
    :modal="modal"
    :closable="closable"
    :style="{ width }"
    @update:visible="(val) => emit('update:visible', val)"
    @hide="handleClose"
  >
    <template #header>
      <div class="dialog-title">{{ title }}</div>
    </template>

    <div class="dialog-body">
      <slot />
    </div>

    <template #footer>
      <slot name="footer">
        <button class="dialog-btn" @click="handleClose">Đóng</button>
      </slot>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-title {
  font-size: 18px;
  font-weight: 600;
}

.dialog-body {
  padding: 8px 0;
}

.dialog-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
}
</style>
