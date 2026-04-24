<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { nextTick, ref, watch } from "vue";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import SeqSearchDialog from "@/components/dialogs/job10a/seq-search/SeqSearchDialog.vue";
import PrintSettingsDialog from "../print-settings/PrintSettingsDialog.vue";
import { openPdfAndPrintFromBlob } from "@/utils/printPdf";
import {
  getKamokuList,
  printHistory,
  type HistoryPrintRequest,
  type KamokuListResponse,
} from "@/services/job10aService";
import { storeToRefs } from "pinia"; 
import { useJob10aStore } from "@/stores/job10aStore";
import { toNumberOrNull } from "@/utils/number";
import { ShowMessageDialog } from "@/services/messageDialogService";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

type GetKamokuDto = {
  kicd: string | null;
  kcod: string | null;
  kana: string | null;
  shortName: string | null;
  longName: string | null;
};

type ActiveField = "from" | "to";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{    
  (e: "update:visible", value: boolean): void;
  (e: "confirm", payload: { from: string; to: string }): void;
}>();

const job10aStore = useJob10aStore();
const { workingKesn } = storeToRefs(job10aStore);

const kamokuCache = ref<GetKamokuDto[]>([]);

const fromValue = ref("");
const toValue = ref("");

const fromText = ref("");
const toText = ref("");

const fromCodeText = ref("");
const toCodeText = ref("");

const isEditingFrom = ref(false);
const isEditingTo = ref(false);

const activeField = ref<ActiveField>("from");

const seqSearchVisible = ref(false);
const showPrintSettingsDialog = ref(false);

const fromInputRef = ref();
const toInputRef = ref();

function getKesn(): number {
  return toNumberOrNull(workingKesn.value) ?? 0;
}

function mapKamokuItem(item: KamokuListResponse): GetKamokuDto {
  return {
    kicd: item.kicd ?? null,
    kcod: item.kcod ?? null,
    kana: item.kana ?? null,
    shortName: item.shortName ?? null,
    longName: item.longName ?? null,
  };
}

async function loadKamokuCache() {
  try {
    const data = await getKamokuList(getKesn());
    kamokuCache.value = data.map(mapKamokuItem);
  } catch (error) {
    console.error("Failed to load kamoku list:", error);
    kamokuCache.value = [];
  }
}  

function resetState() {
  fromValue.value = "";
  toValue.value = "";
  fromText.value = "";
  toText.value = "";      
  fromCodeText.value = "";
  toCodeText.value = "";
  isEditingFrom.value = false;
  isEditingTo.value = false;
  activeField.value = "from";
  seqSearchVisible.value = false;
  showPrintSettingsDialog.value = false;
}
     
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      resetState();
      await loadKamokuCache();
      return;
    }

    resetState();
  },
);

function closeDialog() {
  emit("update:visible", false);
}

async function confirmDialog() {
  const validationMessage = validateRange();
  if (validationMessage) {
    await ShowMessageDialog(
      validationMessage,
      "範囲指定",
      MessageBoxIcon.Warning,
    );
    return;
  }

  emit("confirm", {
    from: fromValue.value,
    to: toValue.value,
  });

  showPrintSettingsDialog.value = true;
}

function digitsOnly(value?: string | null): string {
  return (value ?? "").replace(/\D/g, "").slice(0, 15);
}

function normalizeKicd15(value?: string | null): string {
  const digits = digitsOnly(value);
  if (!digits) return "";
  return digits.padStart(15, "0");
}

function findKamokuByCode(code: string): GetKamokuDto | undefined {
  return kamokuCache.value.find((x) => normalizeKicd15(x.kicd) === code);
}

function clearFrom() {
  fromValue.value = "";
  fromText.value = "";
  fromCodeText.value = "";
}

function clearTo() {
  toValue.value = "";
  toText.value = "";
  toCodeText.value = "";
}

function syncFromDisplayAfterCodeChange() {
  if (!fromValue.value) {
    clearFrom();
    return;
  }

  const found = findKamokuByCode(fromValue.value);
  fromText.value = found?.shortName ?? "";
}

function syncToDisplayAfterCodeChange() {
  if (!toValue.value) {
    clearTo();
    return;
  }

  const found = findKamokuByCode(toValue.value);
  toText.value = found?.shortName ?? "";
}

function validateRange(): string | null {
  if (fromValue.value && toValue.value && fromValue.value > toValue.value) {
    return "開始 > 終了になっています";
  }

  return null;
}

async function beginEditFrom() {
  activeField.value = "from";
  if (isEditingFrom.value) return;

  isEditingFrom.value = true;
  isEditingTo.value = false;

  fromCodeText.value = fromValue.value;

  await nextTick();
  fromInputRef.value?.$el?.focus?.();
  fromInputRef.value?.$el?.select?.();
}

async function beginEditTo() {
  activeField.value = "to";
  if (isEditingTo.value) return;

  isEditingTo.value = true;
  isEditingFrom.value = false;

  toCodeText.value = toValue.value;

  await nextTick();
  toInputRef.value?.$el?.focus?.();
  toInputRef.value?.$el?.select?.();
}

function onFromCodeInput(value?: string) {
  if (!isEditingFrom.value) return;

  const digits = digitsOnly(value);
  fromCodeText.value = digits;
  fromValue.value = digits;
}

function onToCodeInput(value?: string) {
  if (!isEditingTo.value) return;

  const digits = digitsOnly(value);
  toCodeText.value = digits;
  toValue.value = digits;
}

async function endEditFrom() {
  isEditingFrom.value = false;

  if (!fromValue.value.trim()) {
    clearFrom();
    return;
  }

  fromValue.value = normalizeKicd15(fromValue.value);
  fromCodeText.value = fromValue.value;

  syncFromDisplayAfterCodeChange();
}

async function endEditTo() {
  isEditingTo.value = false;

  if (!toValue.value.trim()) {
    clearTo();
    return;
  }

  toValue.value = normalizeKicd15(toValue.value);
  toCodeText.value = toValue.value;

  syncToDisplayAfterCodeChange();
}

async function onFromKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await endEditFrom();
    return;
  }

  if (event.key === "Escape") {
    fromCodeText.value = fromValue.value;
    isEditingFrom.value = false;
  }
}

async function onToKeyDown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    await endEditTo();
    return;
  }

  if (event.key === "Escape") {
    toCodeText.value = toValue.value;
    isEditingTo.value = false;
  }
}

function openSeqSearch() {
  seqSearchVisible.value = true;
}

function handleSearch() {
  openSeqSearch();
}

function handleHistorySearch() {
  openSeqSearch();
}

async function handleSubmit(row: GetKamokuDto) {
  const kicd = normalizeKicd15(row.kicd);

  if (!kicd) return;

  if (activeField.value === "from") {
    fromValue.value = kicd;
    fromCodeText.value = kicd;
    fromText.value = row.shortName ?? "";
    isEditingFrom.value = false;
  } else {
    toValue.value = kicd;
    toCodeText.value = kicd;
    toText.value = row.shortName ?? "";
    isEditingTo.value = false;
  }
}

async function handlePrintSettingsConfirm(printSettings: any) {
  try {
    const payload: HistoryPrintRequest = {
      kesn: getKesn(),
      startKamokuCode: fromValue.value || "000000000000000",
      endKamokuCode: toValue.value || "000000000000000",
      syorikiId: 0,
      printOption: {
        programId: "KNMRI",
        isPrintKaisyaLabelTitle: printSettings.outputTitle,
        isPrintKaisyaCode: printSettings.outputCode,
        isPrintDate: printSettings.outputDate,
        isPrintTime: printSettings.outputTime,
        isPrintSeiriMonth: printSettings.outputPeriod,
        isPrintPageRange: printSettings.outputPageRange,
        pageFrom: printSettings.pageFrom,
        pageTo: printSettings.pageTo,
      },
      rioptSetting: {
        userCode: 1,
        selectOption: 1,
        date: Number(
          `${printSettings.year}${String(printSettings.month).padStart(2, "0")}${String(printSettings.day).padStart(2, "0")}`,
        ),
        time: 133510,
        add: 1,
        update: 1,
        del: 1,
      },
    };

    const fileBlob = await printHistory(payload);

    openPdfAndPrintFromBlob(fileBlob);
  } catch (error) {
    console.error("Lỗi khi in PDF:", error);
  }
}
</script>
/script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="印刷範囲指定"
    :closable="true"
    :draggable="false"
    :style="{ width: '820px' }"
    position="top"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-focustrap>
      <div class="dialog-body">
        <div class="form-row">
          <div class="field-label">科目</div>

          <div class="range-area">
            <InputText
              ref="fromInputRef"
              :modelValue="isEditingFrom ? fromCodeText : fromText"
              class="range-input"
              inputmode="numeric"
              maxlength="15"
              autofocus
              @mousedown="activeField = 'from'"
              @focus="beginEditFrom"
              @update:modelValue="onFromCodeInput"
              @blur="endEditFrom"
              @keydown="onFromKeyDown"
            />
            <span class="range-separator">～</span>
            <InputText
              ref="toInputRef"
              :modelValue="isEditingTo ? toCodeText : toText"
              class="range-input"
              inputmode="numeric"
              maxlength="15"
              @mousedown="activeField = 'to'"
              @focus="beginEditTo"
              @update:modelValue="onToCodeInput"
              @blur="endEditTo"
              @keydown="onToKeyDown"
            />
          </div>
        </div>

        <div class="hint-text">(科目は内部コードで指定します)</div>
      </div>
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

        <SeqSearchDialog
          v-model:visible="seqSearchVisible"
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
