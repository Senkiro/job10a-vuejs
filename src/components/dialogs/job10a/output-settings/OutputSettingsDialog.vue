<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Dialog from "primevue/dialog";

import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import {
  getOption,
  getUprki,
  type GetUprkiResponseDto,
  type SaveOptionRequest,
} from "@/services/job10aService";
import { toNumberOrNull } from "@/utils/number";

/* ========================= CONSTANTS ========================= */
const STORAGE_KEYS = {
  KESN: "current_kesn",
  USER: "user_code",
};

const PROGRAM_ID = "KNMRI";

const CHILD_ITEMS = {
  ALL: "全履歴を出力",
  DATE: "指定日以降の検索対象を出力",
  ADD: "追加",
  UPD: "変更",
  DEL: "削除",
} as const;

/* ========================= TYPES ========================= */
type ChildItem = (typeof CHILD_ITEMS)[keyof typeof CHILD_ITEMS];
type ActiveItem = "EditMode" | "Date" | "Search";

type HistoryRow = {
  id: number;
  processDateTime: string;
  processType: string;
  processContent: string;
  processUser: string;
  rmod: number;
  rtim: number;
};

/* ========================= PROPS / EMITS ========================= */
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits(["update:visible", "confirm", "cancel"]);

/* ========================= STATE ========================= */
const activeTitle = ref<ActiveItem>("EditMode");
const isAllMode = ref(true);
const selectedChildItem = ref<ChildItem>(CHILD_ITEMS.ALL);

const dateText = ref("");
const timeText = ref("");

const model = ref({
  add: false,
  upd: false,
  del: false,
});

const histories = ref<HistoryRow[]>([]);
const selectedRowIndex = ref<number | null>(null);

/* ========================= COMPUTED ========================= */
const selectedRow = computed(() =>
  selectedRowIndex.value !== null
    ? (histories.value[selectedRowIndex.value] ?? null)
    : null,
);

/* ========================= STORAGE ========================= */
const getUserCode = () => localStorage.getItem(STORAGE_KEYS.USER) ?? "";

const getKesn = () =>
  toNumberOrNull(localStorage.getItem(STORAGE_KEYS.KESN)) ?? 0;

/* ========================= MAPPERS ========================= */
const mapRow = (item: GetUprkiResponseDto): HistoryRow => ({
  id: item.no,
  processDateTime: item.processDateTime,
  processType: item.processType,
  processContent: item.processContent,
  processUser: item.processUser,
  rmod: item.rmod,
  rtim: item.rtim,
});

/* ========================= STATE HELPERS ========================= */
function setMode(isAll: boolean) {
  isAllMode.value = isAll;
  selectedChildItem.value = isAll ? CHILD_ITEMS.ALL : CHILD_ITEMS.DATE;
  activeTitle.value = "EditMode";
}

function resetState() {
  setMode(true);
  histories.value = [];
  selectedRowIndex.value = null;
}

/* ========================= DATA LOADING ========================= */
async function loadData() {
  const kesn = getKesn();
  if (!kesn) {
    histories.value = [];
    return;
  }

  try {
    const [option, uprki] = await Promise.all([
      getOption({
        userCode: getUserCode(),
        programId: PROGRAM_ID,
      }),
      getUprki(kesn),
    ]);

    histories.value = uprki.map(mapRow);
    selectedRowIndex.value = null;

    setMode(option.selectOption === 0);

    model.value = {
      add: option.add === 1,
      upd: option.upd === 1,
      del: option.del === 1,
    };

    dateText.value = formatDateFromInt(Number(option.date ?? 0));
    timeText.value = formatTimeFromInt(Number(option.time ?? 0));
  } catch (err) {
    console.error("Load data failed:", err);
    histories.value = [];
  }
}

/* ========================= FORMATTERS ========================= */
const digitsOnly = (s: string) => (s || "").replace(/\D/g, "");

function formatDateTyping(input: string) {
  const d = digitsOnly(input).slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}/${d.slice(4)}`;
  return `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6)}`;
}

function formatTimeTyping(input: string) {
  const d = digitsOnly(input).slice(0, 6);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}:${d.slice(2)}`;
  return `${d.slice(0, 2)}:${d.slice(2, 4)}:${d.slice(4)}`;
}

function formatDateFromInt(num: number) {
  if (!num) return "";
  const s = num.toString().padStart(8, "0");
  return `${s.slice(0, 4)}/${s.slice(4, 6)}/${s.slice(6)}`;
}

function formatTimeFromInt(num: number) {
  if (!num) return "";
  const s = num.toString().padStart(6, "0");
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4)}`;
}

/* ========================= UI HANDLERS ========================= */
function onModeChanged(mode: number) {
  setMode(mode === 0);
  if (mode === 0) {
    selectedRowIndex.value = null;
  }
}

function onRowClicked(idx: number) {
  if (isAllMode.value) return;

  const row = histories.value[idx];
  if (!row) return;

  selectedRowIndex.value = idx;
  dateText.value = formatDateFromInt(row.rmod);
  timeText.value = formatTimeFromInt(row.rtim);
}

function onDateInput(e: Event) {
  const input = e.target as HTMLInputElement;
  dateText.value = formatDateTyping(input.value);
}

function onTimeInput(e: Event) {
  const input = e.target as HTMLInputElement;
  timeText.value = formatTimeTyping(input.value);
}

function onDateClicked() {
  if (!isAllMode.value) activeTitle.value = "Date";
}

function onSearchClicked(item: ChildItem) {
  if (!isAllMode.value) {
    selectedChildItem.value = item;
    activeTitle.value = "Search";
  }
}

/* ========================= ACTIONS ========================= */
function confirmDialog() {
  const payload: SaveOptionRequest = {
    userCode: getUserCode(),
    programId: PROGRAM_ID,
    selectOption: isAllMode.value ? 0 : 1,
    date: dateText.value,
    time: timeText.value,
    add: model.value.add ? 1 : 0,
    upd: model.value.upd ? 1 : 0,
    del: model.value.del ? 1 : 0,
    kesn: getKesn(),
  };

  emit("confirm", payload);
}

function closeDialog() {
  emit("update:visible", false);
  emit("cancel");
}

/* ========================= WATCH ========================= */
watch(
  () => props.visible,
  async (visible) => {
    if (visible) await loadData();
    else resetState();
  },
  { immediate: true },
);
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="履歴出力設定"
    :closable="true"
    :draggable="false"
    :style="{ width: '950px' }"
    position="top"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-focustrap>
      <div class="dialog-body">
        <div class="section">
          <div class="header-row">
            <div
              autofocus
              :class="
                activeTitle === 'EditMode' ? 'title-active' : 'title-inactive'
              "
            >
              出力選択
            </div>
          </div>

          <div class="radio-group">
            <label
              :class="
                selectedChildItem === '全履歴を出力'
                  ? 'selected-child-item'
                  : ''
              "
            >
              <input
                type="radio"
                name="mode"
                :checked="isAllMode"
                @change="onModeChanged(0)"
              />
              全履歴を出力
            </label>

            <label
              :class="
                selectedChildItem === '指定日以降の検索対象を出力'
                  ? 'selected-child-item'
                  : ''
              "
              style="margin-left: 40px"
            >
              <input
                type="radio"
                name="mode"
                :checked="!isAllMode"
                @change="onModeChanged(1)"
              />
              指定日以降の検索対象を出力
            </label>
          </div>
        </div>

        <div class="section">
          <div
            :class="activeTitle === 'Date' ? 'title-active' : 'title-inactive'"
          >
            指定日
          </div>
        </div>

        <div class="grid-container" :class="{ 'grid-disabled': isAllMode }">
          <table class="grid">
            <thead>
              <tr>
                <th style="width: 20px"></th>
                <th style="width: 50px">No</th>
                <th style="width: 150px">処理日時</th>
                <th style="width: 100px">処理種別</th>
                <th style="width: 150px">処理内容</th>
                <th style="width: 200px">処理ユーザー</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(row, idx) in histories"
                :key="row.id"
                :class="{ 'selected-row': selectedRowIndex === idx }"
                @click="onRowClicked(idx)"
              >
                <td></td>
                <td>{{ idx + 1 }}</td>
                <td>{{ row.processDateTime }}</td>
                <td>{{ row.processType }}</td>
                <td>{{ row.processContent }}</td>
                <td>{{ row.processUser }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="input-date">
            <div class="section-title-input">
              <input
                v-model="dateText"
                type="text"
                class="input-inside"
                :disabled="isAllMode"
                inputmode="numeric"
                maxlength="10"
                @input="onDateInput"
                @click="onDateClicked"
                placeholder="YYYY/MM/DD"
              />
            </div>

            <div class="section-title-input">
              <input
                v-model="timeText"
                type="text"
                class="input-inside"
                :disabled="isAllMode"
                inputmode="numeric"
                maxlength="8"
                @input="onTimeInput"
                @click="onDateClicked"
                placeholder="HH:MM:SS"
              />
            </div>
          </div>
        </div>

        <div
          :class="activeTitle === 'Search' ? 'title-active' : 'title-inactive'"
        >
          検索対象
        </div>

        <div
          class="radio-group checkbox-area"
          :class="{ 'checkbox-disabled': isAllMode }"
        >
          <label
            :class="selectedChildItem === '追加' ? 'selected-child-item' : ''"
          >
            <input
              v-model="model.add"
              type="checkbox"
              :disabled="isAllMode"
              @click="onSearchClicked('追加')"
            />
            追加
          </label>

          <label
            :class="selectedChildItem === '変更' ? 'selected-child-item' : ''"
            style="margin-left: 40px"
          >
            <input
              v-model="model.upd"
              type="checkbox"
              :disabled="isAllMode"
              @click="onSearchClicked('変更')"
            />
            変更
          </label>

          <label
            :class="selectedChildItem === '削除' ? 'selected-child-item' : ''"
            style="margin-left: 40px"
          >
            <input
              v-model="model.del"
              type="checkbox"
              :disabled="isAllMode"
              @click="onSearchClicked('削除')"
            />
            削除
          </label>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <DialogDefaultFooter @confirm="confirmDialog" @cancel="closeDialog" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
@import "./OutputSettingsDialog.css";
</style>
