<script setup lang="ts">
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import { ref, watch } from "vue";

type PeriodItem = {
  kesn: string;
  label: string;
};

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm", kesn: string): void;
  (e: "cancel"): void;
}>();

const periods = ref<PeriodItem[]>([
  { kesn: "202601", label: "2026年01月" },
  { kesn: "202602", label: "2026年02月" },
  { kesn: "202603", label: "2026年03月" },
]);

const selectedKesn = ref("");

watch(
  () => props.visible,
  (val) => {
    if (val) {
      selectedKesn.value = periods.value[0]?.kesn ?? "";
    }
  },
  { immediate: true },
);

function closeDialog() {
  emit("update:visible", false);
  emit("cancel");
}

function confirmDialog() {
  emit("confirm", selectedKesn.value);
  emit("update:visible", false);
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="処理期選択"
    :closable="true"
    :draggable="false"
    :style="{ width: '360px' }"
    position="top"
    class="processing-period-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-focustrap>
      <div class="p-body">
        <div class="p-row">
          <Select
            v-model="selectedKesn"
            :options="periods"
            optionLabel="label"
            optionValue="kesn"
            autofocus
          />
        </div>
      </div>
    </div>

    <template #footer>
      <DialogDefaultFooter
        ok-label="OK"
        cancel-label="キャンセル"
        @ok="confirmDialog"
        @cancel="closeDialog"
      />
    </template>
  </Dialog>
</template>

<style scoped src="./ProcessingPeriodDialog.css"></style>
