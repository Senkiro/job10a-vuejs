<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Select from "primevue/select";

import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import { getSyorikiList } from "@/services/job10aService";

type PeriodItem = {
  kesn: string;
  label: string;
  syorikikanLabel: string;
};

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm", payload: { kesn: string; syorikikanLabel: string }): void;
  (e: "cancel"): void;
}>();

const periods = ref<PeriodItem[]>([]);
const selectedKesn = ref("");
const loading = ref(false);

async function loadData() {
  loading.value = true;

  try {
    const data = await getSyorikiList();

    periods.value = data.map((item) => ({
      kesn: String(item.kesn),
      label: item.label,
      syorikikanLabel: item.syorikikanLabel,
    }));

    const exists = periods.value.some((x) => x.kesn === selectedKesn.value);
    localStorage.setItem(
      "syorikikan_label",
      periods.value[0]?.syorikikanLabel ?? "",
    );
    if (!exists) {
      selectedKesn.value = periods.value[0]?.kesn ?? "";
    }
  } catch (error) {
    console.error("Failed to load syoriki list:", error);
    periods.value = [];
    selectedKesn.value = "";
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      await loadData();
    }
  },
  { immediate: true },
);

function closeDialog() {
  emit("update:visible", false);
  emit("cancel");
}

function confirmDialog() {
  const selected = periods.value.find((x) => x.kesn === selectedKesn.value);
  if (!selected) return;

  emit("confirm", {
    kesn: selected.kesn,
    syorikikanLabel: selected.syorikikanLabel,
  });

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
            placeholder="処理期を選択してください"
            class="w-full"
            appendTo="body"
            autofocus
          />
        </div>
      </div>
    </div>

    <template #footer>
      <DialogDefaultFooter
        :ok-disabled="loading || !selectedKesn"
        @confirm="confirmDialog"
        @cancel="closeDialog"
      />
    </template>
  </Dialog>
</template>

<style scoped src="./ProcessingPeriodDialog.css"></style>
