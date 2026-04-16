<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useRouter } from "vue-router";

import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useJob10aStore } from "@/stores/job10aStore";

import PrintRangeDialog from "@/components/dialogs/job10a/print-range/PrintRangeDialog.vue";
import OutputSettingsDialog from "@/components/dialogs/job10a/output-settings/OutputSettingsDialog.vue";
import ProcessingPeriodDialog from "@/components/dialogs/job10a/processing-period/ProcessingPeriodDialog.vue";

import { footerJob10a } from "@/constants/footerButtonsConfigs";
import { headerMenusJob10a } from "@/constants/headerConfigs";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

import {
  checkRirekiStatus,
  getDetailHistory,
  getNames,
  latestKmrkiDisplay,
  saveOption,
  type LatestKmrkiDisplayRequest,
  type LatestKmrkiDisplayResponse,
  type SaveOptionRequest,
} from "@/services/job10aService";

import { ShowConfirmDialog } from "@/services/confirmDialogService";
import { ShowMessageDialog } from "@/services/messageDialogService";
import { toNumberOrNull } from "@/utils/number";
import { convertToReiwaFromNumber } from "@/utils/date";

/* =========================
 * types
 * ========================= */
type CheckRirekiStatusResponse = {
  rirekiType: number;
  currentSyorikiDensiTyouboHozonUsage: number;
  isCurrentKaisyaDensiTyouboHozonUsage: boolean;
};

type LeftRow = {
  del: string;
  kicd: string;
  code: string;
  name: string;
};

type RightRow = {
  kesn: number;
  kcod: string;
  knmx: string;
  knam: string;
  kicd: string;
  lmod: number;
  fmod: number;
  ltim: number;
  ftim: number;
  case: string;
};

type HeaderMenuPayload = {
  child?: {
    actionKey?: number;
  };
};

type HistoryLikeRow = {
  kesn: number;
  kcod: string;
  knmx: string;
  knam: string;
  kicd: string;
  lmod: number;
  fmod: number;
  ltim: number;
  ftim: number;
  case: string;
};

type ProcessingPeriodPayload = {
  kesn: string;
  syorikikanLabel: string;
};

/* =========================
 * constants
 * ========================= */
const router = useRouter();

const authStore = useAuthStore();
const job10aStore = useJob10aStore();

const { currentKesn, currentSyorikikan } = storeToRefs(authStore);
const { workingKesn, periodLabel } = storeToRefs(job10aStore);

function initScreenStoreFromAuth() {
  if (job10aStore.initialized) return;

  job10aStore.initFromAuth({
    kesn: currentKesn.value,
    periodLabel: currentSyorikikan.value,
  });
}

const SCREEN_TITLES = {
  main: "科目履歴一覧",
  outputSettings: "履歴出力設定",
  periodChange: "処理期変更",
} as const;

const SCREEN_MESSAGES = {
  noData: "出力対象となるデータはありません。",
  noDataPrint: "印刷データがありません。",
  requireDate: "指定日を入力してください。",
  requireTargets: "検索対象を指定してください。",
  outputSettingsNotSelected:
    "履歴の出力設定が選択されていません。\n科目履歴一覧を終了しますか。",
  masterUnavailable:
    "・電子帳簿保存を使用するマスター\n" +
    "・内部統制機能強化モードマスター\n" +
    "・履歴を保存するマスター(履歴処理)\n" +
    "のいずれでもありません。\n" +
    "業務を終了します。",
  confirmChangePeriod: "当期は処理できません。\n処理期を変更しますか。",
  confirmNoPeriodSelected:
    "処理期が選択されていません。\n科目履歴一覧を終了しますか。",
  confirmChangePeriodAgain:
    "指定処理期は処理できません。\n処理期を変更しますか。",
} as const;

/* =========================
 * utils
 * ========================= */
function normalizeDigits(value: string | null | undefined): string {
  return value?.replace(/\D/g, "") ?? "";
}

function hasNoSearchTarget(payload: SaveOptionRequest): boolean {
  return payload.add === 0 && payload.upd === 0 && payload.del === 0;
}

function extractResponseObject(response: unknown): Record<string, unknown> {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data?: unknown }).data;
    return data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};
  }

  return response && typeof response === "object"
    ? (response as Record<string, unknown>)
    : {};
}

/* =========================
 * storage helpers
 * ========================= */
function getKesnFromStore(): number {
  return toNumberOrNull(workingKesn.value) ?? 0;
}

function setKesnToStore(kesn: number) {
  job10aStore.workingKesn = String(kesn);
}

function saveStatusToStore(status: CheckRirekiStatusResponse) {
  job10aStore.saveStatus(status);
}

/* =========================
 * mappers
 * ========================= */
function mapStatusResponse(response: unknown): CheckRirekiStatusResponse {
  const raw = extractResponseObject(response);

  return {
    rirekiType: Number(raw.rirekiType ?? 0),
    currentSyorikiDensiTyouboHozonUsage: Number(
      raw.currentSyorikiDensiTyouboHozonUsage ?? 0,
    ),
    isCurrentKaisyaDensiTyouboHozonUsage: Boolean(
      raw.isCurrentKaisyaDensiTyouboHozonUsage ?? false,
    ),
  };
}

function mapToLeftRow(item: LatestKmrkiDisplayResponse[number]): LeftRow {
  return {
    del: item.div,
    kicd: item.kicd,
    code: item.kcod,
    name: item.knmx,
  };
}

function mapToRightRow(item: HistoryLikeRow): RightRow {
  return {
    kesn: item.kesn,
    kcod: item.kcod,
    knmx: item.knmx,
    knam: item.knam,
    kicd: item.kicd,
    lmod: item.lmod,
    fmod: item.fmod,
    ltim: item.ltim,
    ftim: item.ftim,
    case: item.case,
  };
}

/* =========================
 * state
 * ========================= */
const currentRequest = ref<LatestKmrkiDisplayRequest | null>(null);

const showPrintRangeDialog = ref(false);
const showOutputSettingsDialog = ref(false);
const showProcessingPeriodSelectDialog = ref(false);

const screenReady = ref(false);
const message = ref("");
const periodText = computed(() => periodLabel.value);

const outputSettingKesn = ref(0);
const selectedLeftIndex = ref<number | null>(null);

const leftRows = ref<LeftRow[]>([]);
const rightRows = ref<RightRow[]>([]);

/* =========================
 * computed
 * ========================= */
const rightStickyRow = computed<RightRow | null>(
  () => rightRows.value[0] ?? null,
);
const filteredRightRows = computed<RightRow[]>(() => rightRows.value.slice(1));

/* =========================
 * dialog controller helper
 * ========================= */
function createBooleanDialogController(visible: Ref<boolean>) {
  const handled = ref(false);
  let resolver: ((value: boolean) => void) | null = null;

  function open(): Promise<boolean> {
    handled.value = false;
    visible.value = true;

    return new Promise<boolean>((resolve) => {
      resolver = resolve;
    });
  }

  function resolve(result: boolean) {
    if (!resolver) return;
    resolver(result);
    resolver = null;
  }

  function close() {
    visible.value = false;
  }

  return {
    handled,
    open,
    resolve,
    close,
  };
}

const outputSettingsDialog = createBooleanDialogController(
  showOutputSettingsDialog,
);
const processingPeriodDialog = createBooleanDialogController(
  showProcessingPeriodSelectDialog,
);

/* =========================
 * loaders
 * ========================= */
async function fetchLeftRows(
  request: LatestKmrkiDisplayRequest,
): Promise<LeftRow[]> {
  const rows = await latestKmrkiDisplay(request);
  return rows.map(mapToLeftRow);
}

async function fetchRightRows(kicd: string): Promise<RightRow[]> {
  const headerPromise = getNames({
    kesn: outputSettingKesn.value,
    kicd,
  }).then((rows) => rows.map(mapToRightRow));

  const detailPromise = currentRequest.value
    ? getDetailHistory({
        ...currentRequest.value,
        kicd,
      }).then((rows) => rows.map(mapToRightRow))
    : Promise.resolve<RightRow[]>([]);

  const [headerRows, detailRows] = await Promise.all([
    headerPromise,
    detailPromise,
  ]);

  return [...headerRows, ...detailRows];
}

async function selectLeftRow(index: number) {
  const selected = leftRows.value[index];
  if (!selected) return;

  selectedLeftIndex.value = index;
  rightRows.value = [];

  try {
    rightRows.value = await fetchRightRows(selected.kicd);
  } catch (error) {
    console.error("Load rightRows failed:", error);
  }
}

async function applyDisplayRequest(
  request: LatestKmrkiDisplayRequest,
  preferredKicd: string | null = null,
) {
  currentRequest.value = request;
  selectedLeftIndex.value = null;
  rightRows.value = [];

  leftRows.value = await fetchLeftRows(request);

  if (leftRows.value.length === 0) {
    message.value = SCREEN_MESSAGES.noData;
    return;
  }

  message.value = "";

  const preferredIndex = preferredKicd
    ? leftRows.value.findIndex((row) => row.kicd === preferredKicd)
    : -1;

  await selectLeftRow(preferredIndex >= 0 ? preferredIndex : 0);
}

/* =========================
 * action / menu
 * ========================= */
function openDialogByActionKey(actionKey: number) {
  switch (actionKey) {
    case 2:
      if (leftRows.value.length === 0) {
        ShowMessageDialog(
          SCREEN_MESSAGES.noDataPrint,
          SCREEN_TITLES.main,
          MessageBoxIcon.Warning,
        );
        return;
      }
      showPrintRangeDialog.value = true;
      break;
    case 4:
      showOutputSettingsDialog.value = true;
      break;
    case 8:
      showProcessingPeriodSelectDialog.value = true;
      break;
  }
}

function handleDialogAction(input: number | HeaderMenuPayload) {
  const actionKey = typeof input === "number" ? input : input.child?.actionKey;
  if (!actionKey) return;

  openDialogByActionKey(actionKey);
}

function handlePrintRange() {
  console.log("Thực hiện in");
}

/* =========================
 * F4 - output settings
 * ========================= */
const isInitialOutputSettingsFlow = ref(false);
const isHandlingOutputSettingsCancel = ref(false);

function showF4Modal(isInitial = false): Promise<boolean> {
  isInitialOutputSettingsFlow.value = isInitial;
  return outputSettingsDialog.open();
}

async function confirmExitFromOutputSettings(): Promise<boolean> {
  return ShowConfirmDialog(
    SCREEN_MESSAGES.outputSettingsNotSelected,
    SCREEN_TITLES.main,
    MessageBoxIcon.Question,
  );
}

function buildDisplayRequest(
  payload: SaveOptionRequest,
  normalizedDate: string,
  normalizedTime: string,
): LatestKmrkiDisplayRequest {
  return {
    userCode: payload.userCode,
    selectOption: payload.selectOption,
    date: normalizedDate,
    time: normalizedTime,
    add: payload.add,
    upd: payload.upd,
    del: payload.del,
    kesn: payload.kesn,
    kicd: "",
  };
}

async function handleOutputSettings(payload: SaveOptionRequest) {
  try {
    const normalizedDate = normalizeDigits(payload.date);
    const normalizedTime = normalizeDigits(payload.time);

    if (!normalizedDate) {
      await ShowMessageDialog(
        SCREEN_MESSAGES.requireDate,
        SCREEN_TITLES.outputSettings,
        MessageBoxIcon.Warning,
      );
      return;
    }

    if (hasNoSearchTarget(payload)) {
      await ShowMessageDialog(
        SCREEN_MESSAGES.requireTargets,
        SCREEN_TITLES.outputSettings,
        MessageBoxIcon.Warning,
      );
      return;
    }

    await saveOption({
      userCode: payload.userCode,
      programId: payload.programId,
      selectOption: payload.selectOption,
      date: normalizedDate,
      time: normalizedTime,
      add: payload.add,
      upd: payload.upd,
      del: payload.del,
      kesn: payload.kesn,
    });

    outputSettingKesn.value = payload.kesn;

    await applyDisplayRequest(
      buildDisplayRequest(payload, normalizedDate, normalizedTime),
    );

    outputSettingsDialog.handled.value = true;
    isInitialOutputSettingsFlow.value = false;

    outputSettingsDialog.resolve(true);
    outputSettingsDialog.close();
  } catch (error) {
    console.error("Save output settings failed:", error);
  }
}

async function handleOutputSettingsCancel() {
  if (isHandlingOutputSettingsCancel.value) return;

  isHandlingOutputSettingsCancel.value = true;

  try {
    outputSettingsDialog.handled.value = true;
    outputSettingsDialog.close();

    if (!isInitialOutputSettingsFlow.value) {
      return;
    }

    const shouldExit = await confirmExitFromOutputSettings();

    if (shouldExit) {
      isInitialOutputSettingsFlow.value = false;
      outputSettingsDialog.resolve(false);
      await router.push("/");
      return;
    }

    outputSettingsDialog.handled.value = false;
    showOutputSettingsDialog.value = true;
  } finally {
    isHandlingOutputSettingsCancel.value = false;
  }
}

watch(showOutputSettingsDialog, (visible) => {
  if (!visible && !outputSettingsDialog.handled.value) {
    void handleOutputSettingsCancel();
  }
});

/* =========================
 * F8 - processing period
 * ========================= */
function showF8Modal(): Promise<boolean> {
  return processingPeriodDialog.open();
}

async function handleProcessingPeriod(payload: ProcessingPeriodPayload) {
  const parsedKesn = toNumberOrNull(payload.kesn);

  if (parsedKesn === null) {
    processingPeriodDialog.resolve(false);
    processingPeriodDialog.close();
    return;
  }

  processingPeriodDialog.handled.value = true;
  processingPeriodDialog.close();

  try {
    await reloadScreenByKesn(parsedKesn);
    job10aStore.setProcessingPeriod(payload.kesn, payload.syorikikanLabel);
    processingPeriodDialog.resolve(true);
  } catch (error) {
    console.error("Reload by kesn failed:", error);
    processingPeriodDialog.resolve(false);
  }
}

function handleProcessingPeriodCancel() {
  processingPeriodDialog.handled.value = true;
  processingPeriodDialog.resolve(false);
  processingPeriodDialog.close();
}

watch(showProcessingPeriodSelectDialog, (visible) => {
  if (!visible && !processingPeriodDialog.handled.value) {
    processingPeriodDialog.resolve(false);
  }
});

/* =========================
 * business flow
 * ========================= */
async function fetchRirekiStatus(
  kesn: number,
): Promise<CheckRirekiStatusResponse> {
  const response = await checkRirekiStatus(kesn);
  return mapStatusResponse(response);
}

async function exitToMenu(): Promise<false> {
  await router.push("/");
  return false;
}

async function showMasterUnavailableMessage(): Promise<false> {
  await ShowMessageDialog(
    SCREEN_MESSAGES.masterUnavailable,
    SCREEN_TITLES.main,
    MessageBoxIcon.Error,
  );

  return exitToMenu();
}

async function confirmChangePeriod(): Promise<boolean> {
  return ShowConfirmDialog(
    SCREEN_MESSAGES.confirmChangePeriod,
    SCREEN_TITLES.periodChange,
    MessageBoxIcon.Question,
  );
}

async function confirmExitWhenNoPeriodSelected(): Promise<boolean> {
  return ShowConfirmDialog(
    SCREEN_MESSAGES.confirmNoPeriodSelected,
    SCREEN_TITLES.periodChange,
    MessageBoxIcon.Question,
  );
}

async function confirmChangePeriodAgain(): Promise<boolean> {
  return ShowConfirmDialog(
    SCREEN_MESSAGES.confirmChangePeriodAgain,
    SCREEN_TITLES.periodChange,
    MessageBoxIcon.Question,
  );
}

async function reloadScreenByKesn(kesn: number) {
  const status = await fetchRirekiStatus(kesn);
  saveStatusToStore(status);

  outputSettingKesn.value = kesn;
  setKesnToStore(kesn);

  if (!currentRequest.value) {
    return;
  }

  const preferredKicd =
    selectedLeftIndex.value !== null
      ? (leftRows.value[selectedLeftIndex.value]?.kicd ?? null)
      : null;

  const nextRequest: LatestKmrkiDisplayRequest = {
    ...currentRequest.value,
    kesn,
    kicd: "",
  };

  await applyDisplayRequest(nextRequest, preferredKicd);
}

async function handlePeriodSelectionLoop(): Promise<boolean> {
  while (true) {
    const selected = await showF8Modal();

    if (!selected) {
      const shouldExit = await confirmExitWhenNoPeriodSelected();
      if (shouldExit) return exitToMenu();
      continue;
    }

    const selectedKesn = outputSettingKesn.value;
    const selectedStatus = await fetchRirekiStatus(selectedKesn);
    saveStatusToStore(selectedStatus);

    if (selectedStatus.currentSyorikiDensiTyouboHozonUsage === 0) {
      const shouldRetry = await confirmChangePeriodAgain();

      if (!shouldRetry) {
        return exitToMenu();
      }

      continue;
    }

    setKesnToStore(selectedKesn);
    return true;
  }
}

async function ensureRirekiStatusReady(): Promise<boolean> {
  const kesnToCheck = getKesnFromStore();

  if (kesnToCheck === 0) {
    return exitToMenu();
  }

  try {
    const status = await fetchRirekiStatus(kesnToCheck);
    saveStatusToStore(status);

    if (status.rirekiType !== 0) {
      outputSettingKesn.value = kesnToCheck;
      setKesnToStore(kesnToCheck);
      return true;
    }

    if (!status.isCurrentKaisyaDensiTyouboHozonUsage) {
      return showMasterUnavailableMessage();
    }

    if (status.currentSyorikiDensiTyouboHozonUsage === 0) {
      const shouldChange = await confirmChangePeriod();

      if (!shouldChange) {
        return exitToMenu();
      }

      return handlePeriodSelectionLoop();
    }

    outputSettingKesn.value = kesnToCheck;
    setKesnToStore(kesnToCheck);
    return true;
  } catch (error) {
    console.error("ensureRirekiStatusReady error:", error);
    return exitToMenu();
  }
}

/* =========================
 * lifecycle
 * ========================= */
onMounted(async () => {
  initScreenStoreFromAuth();

  const isReady = await ensureRirekiStatusReady();
  if (!isReady) return;

  const isF4Completed = await showF4Modal(true);
  if (!isF4Completed) return;

  screenReady.value = true;
});
</script>

<template>
  <div class="layout">
    <AppSidebar />

    <div class="content-area">
      <AppHeader
        userName="User 0001"
        title="科目履歴一覧"
        :periodText="periodText"
        screenCode="KNMRI-1"
        :menus="headerMenusJob10a"
        :showHelp="true"
        :showShortcut="true"
        @menu-click="handleDialogAction"
      />

      <main v-if="screenReady" class="page-container">
        <div class="main-container">
          <div class="title-bar">
            <div
              class="my-validation-summary f4-validation-top"
              :class="{ 'msg-hidden': !message?.trim() }"
            >
              {{ message?.trim() || "\u00A0" }}
            </div>
          </div>

          <div class="main-layout">
            <div class="main-content">
              <div class="content-grid">
                <div class="left-panel">
                  <table class="table-left">
                    <thead>
                      <tr>
                        <th style="width: 40px">削</th>
                        <th style="width: 200px">内部コード</th>
                        <th style="width: 90px">コード</th>
                        <th>科目名称(画面)</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="(item, idx) in leftRows"
                        :key="`${item.kicd}-${idx}`"
                        class="row-selectable"
                        :class="{ 'selected-row': selectedLeftIndex === idx }"
                        @click="selectLeftRow(idx)"
                      >
                        <td style="text-align: center">{{ item.del }}</td>
                        <td>{{ item.kicd }}</td>
                        <td>{{ item.code }}</td>
                        <td>{{ item.name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="right-panel">
                  <table class="table-right">
                    <thead>
                      <tr class="right-header-row">
                        <th style="width: 120px">変更日</th>
                        <th style="width: 70px">コード</th>
                        <th style="width: 150px">科目名称(画面)</th>
                        <th style="width: 150px">科目名称(印刷)</th>
                        <th style="width: 50px">区分</th>
                      </tr>

                      <tr v-if="rightStickyRow" class="right-sticky-row">
                        <th style="width: 120px; text-align: left">
                          {{ convertToReiwaFromNumber(rightStickyRow.lmod) }}
                        </th>
                        <th style="width: 70px">
                          {{ rightStickyRow.kcod }}
                        </th>
                        <th style="width: 150px; text-align: left">
                          {{ rightStickyRow.knmx }}
                        </th>
                        <th style="width: 150px; text-align: left">
                          {{ rightStickyRow.knam }}
                        </th>
                        <th style="width: 50px">
                          {{ rightStickyRow.case }}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="(row, index) in filteredRightRows"
                        :key="`${row.kicd}-${index}`"
                      >
                        <td>{{ convertToReiwaFromNumber(row.lmod) }}</td>
                        <td>{{ row.kcod }}</td>
                        <td>{{ row.knmx }}</td>
                        <td>{{ row.knam }}</td>
                        <td>{{ row.case }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PrintRangeDialog
        v-model:visible="showPrintRangeDialog"
        @confirm="handlePrintRange"
      />

      <OutputSettingsDialog
        v-model:visible="showOutputSettingsDialog"
        @confirm="handleOutputSettings"
        @cancel="handleOutputSettingsCancel"
      />

      <ProcessingPeriodDialog
        v-model:visible="showProcessingPeriodSelectDialog"
        @confirm="handleProcessingPeriod"
        @cancel="handleProcessingPeriodCancel"
      />

      <AppFooter
        v-if="screenReady"
        :buttons="footerJob10a"
        :enabled-keys="[2, 4, 8]"
        @key-click="handleDialogAction"
      />
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  margin: 10px 0 10px;
  text-align: center;
  font-size: 18px;
}

.main-layout {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.main-content {
  flex: 1;
}

.content-grid {
  padding: 0 15px;
  display: grid;
  grid-template-columns: 0.7fr 1fr;
  gap: 20px;
}

.table-left,
.table-right {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 15px;
  background: #fff;
  table-layout: fixed;
}

.table-left th,
.table-right th {
  text-align: center;
  padding: 10px 8px;
  background: #f6f8fb;
  white-space: nowrap;
}

.table-left td,
.table-right td {
  padding: 8px 10px;
  border-bottom: 1px solid #9fb0c6;
  border-right: 1px solid #b8c6d8;
  height: 36px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-left td:first-child,
.table-right td:first-child,
.table-left th:first-child,
.table-right th:first-child {
  border-left: 1px solid #e9eef6;
}

.table-left tbody tr:nth-child(odd),
.table-right tbody tr:nth-child(odd) {
  background: #e5f3ff;
}

.table-left tbody tr:nth-child(even),
.table-right tbody tr:nth-child(even) {
  background: #ffffff;
}

.table-left thead th,
.table-right thead th {
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  border-left: 1px solid #b8c6d8;
  border-right: 1px solid #b8c6d8;
  box-shadow: inset 0 -2px 0 #5f7fa6;
  font-weight: 400;
}

.table-left thead th:first-child,
.table-right thead th:first-child {
  border-left: 1px solid #e9eef6;
}

.table-left thead th:last-child,
.table-right thead th:last-child {
  border-right: 1px solid #e9eef6;
}

.row-selectable {
  cursor: pointer;
  transition:
    background 0.12s ease,
    color 0.12s ease;
}

.selected-row td {
  background: #0078d7 !important;
  color: #fff;
  border-left: 1px solid #b8c6d8 !important;
  border-right: 1px solid #b8c6d8 !important;
  border-bottom-color: rgba(255, 255, 255, 0.25);
  border-right-color: rgba(255, 255, 255, 0.15);
}

.left-panel,
.right-panel {
  border: 1px solid #d1d3d5;
  height: 640px;
  overflow-x: auto;
  overflow-y: scroll;
  background: #fff;
  box-shadow: 0 2px 12px rgba(32, 32, 32, 0.3);
  scrollbar-gutter: stable;
}

.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar {
  width: 10px;
}

.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb {
  background: #c7d3e2;
  border-radius: 8px;
  border: 2px solid #fff;
}

.left-panel::-webkit-scrollbar-thumb:hover,
.right-panel::-webkit-scrollbar-thumb:hover {
  background: #b3c2d6;
}

.table-left td:nth-child(1),
.table-left td:nth-child(3),
.table-right td:nth-child(2),
.table-right td:nth-child(5) {
  text-align: center;
  white-space: nowrap;
}

.table-right td:nth-child(1) {
  white-space: nowrap;
}

.table-right thead .right-header-row th {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #fff;
}

.table-right thead .right-sticky-row th {
  position: sticky;
  top: 43px;
  z-index: 25;
  background: #e5f3ff;
  padding: 10px 8px;
  white-space: nowrap;
  box-shadow: inset 0 -2px 0 #5f7fa6;
}

.msg-hidden {
  visibility: hidden;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .left-panel,
  .right-panel {
    height: auto;
    max-height: 260px;
  }
}

@media (max-width: 768px) {
  .page-container {
    font-size: 12px;
  }

  table {
    font-size: 11px;
  }
}
</style>
