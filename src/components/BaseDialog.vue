<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";

type Props = {
  visible: boolean;
  title?: string;
  width?: string;
  modal?: boolean;
  closable?: boolean;
  draggable?: boolean;
  position?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "topleft"
    | "topright"
    | "bottomleft"
    | "bottomright";
  okLabel?: string;
  cancelLabel?: string;
  showFooter?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  title: "Thông báo",
  width: "820px",
  modal: true,
  closable: true,
  draggable: false,
  position: "top",
  okLabel: "OK(X)",
  cancelLabel: "キャンセル(C)",
  showFooter: true,
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "close"): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function closeDialog() {
  emit("update:visible", false);
  emit("cancel");
  emit("close");
}

function confirmDialog() {
  emit("confirm");
  emit("update:visible", false);
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    :modal="props.modal"
    :closable="props.closable"
    :draggable="props.draggable"
    :position="props.position"
    :style="{ width: props.width }"
    class="base-dialog"
    @update:visible="emit('update:visible', $event)"
    @hide="emit('close')"
  >
    <template #header>
      <div class="dialog-title">{{ props.title }}</div>
    </template>

    <div class="dialog-body">
      <slot />
    </div>

    <template v-if="props.showFooter" #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <div class="footer-right">
            <Button
              :label="props.okLabel"
              class="action-btn primary-btn"
              @click="confirmDialog"
            />
            <Button
              :label="props.cancelLabel"
              class="action-btn secondary-btn"
              @click="closeDialog"
            />
          </div>
        </div>
      </slot>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-title {
  font-size: 22px;
  font-weight: 600;
  color: #000;
}

.dialog-body {
  padding: 4px 0 10px 0;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 14px;
}

.footer-right {
  display: flex;
  gap: 10px;
}
</style>
