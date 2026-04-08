<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import { footerJob10a } from "@/constants/footerButtonsConfigs";
import { headerMenusJob10a } from "@/constants/headerConfigs";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import PrintRangeDialog from "@/components/dialogs/job10a/print-range/PrintRangeDialog.vue";
import OutputSettingsDialog from "@/components/dialogs/job10a/output-settings/OutputSettingsDialog.vue";
import ProcessingPeriodDialog from "@/components/dialogs/job10a/processing-period/ProcessingPeriodDialog.vue";

import { checkRirekiStatus } from "@/services/job10aService";
import { ShowConfirmDialog } from "@/services/confirmDialogService";
import { ShowMessageDialog } from "@/services/messageDialogService";
import { MessageBoxIcon } from "@/constants/messageBoxIcon";

type CheckRirekiStatusResponse = {
  rirekiType: number;
  currentSyorikiDensiTyouboHozonUsage: number;
  isCurrentKaisyaDensiTyouboHozonUsage: boolean;
};

type LeftRow = {
  del: string;
  internalCode: string;
  code: string;
  name: string;
};

type RightRow = {
  changeDate: string;
  code: string;
  screenName: string;
  printName: string;
  type: string;
  leftCode: string;
};

const router = useRouter();

const CURRENT_KESN_KEY = "current_kesn";
const RIREKI_TYPE_KEY = "rirekiType";
const CURRENT_SYORIKI_KEY = "currentSyorikiDensiTyouboHozonUsage";
const CURRENT_KAISYA_DENSHI_KEY = "isCurrentKaisyaDensiTyouboHozonUsage";

const showPrintRangeDialog = ref(false);
const showOutputSettingsDialog = ref(false);
const showProcessingPeriodSelectDialog = ref(false);

const message = ref("");

const selectedLeftIndex = ref<number | null>(0);
const outputSettingKesn = ref<number>(0);

const leftRows = ref<LeftRow[]>([
  {
    del: "",
    internalCode: "1000000001",
    code: "101",
    name: "現金",
  },
  {
    del: "削",
    internalCode: "1000000002",
    code: "102",
    name: "普通預金",
  },
  {
    del: "",
    internalCode: "1000000003",
    code: "201",
    name: "売掛金",
  },
  {
    del: "",
    internalCode: "1000000004",
    code: "301",
    name: "備品",
  },
]);

const rightRows = ref<RightRow[]>([
  {
    changeDate: "2026/01/05",
    code: "101",
    screenName: "現金",
    printName: "現金",
    type: "追",
    leftCode: "101",
  },
  {
    changeDate: "2026/01/18",
    code: "101",
    screenName: "現金(本店)",
    printName: "現金本店",
    type: "変",
    leftCode: "101",
  },
  {
    changeDate: "2026/02/02",
    code: "102",
    screenName: "普通預金",
    printName: "普通預金",
    type: "追",
    leftCode: "102",
  },
  {
    changeDate: "2026/02/15",
    code: "201",
    screenName: "売掛金",
    printName: "売掛金",
    type: "変",
    leftCode: "201",
  },
  {
    changeDate: "2026/03/01",
    code: "301",
    screenName: "備品",
    printName: "備品",
    type: "追",
    leftCode: "301",
  },
]);

const selectedLeftRow = computed(() => {
  if (selectedLeftIndex.value === null) return null;
  return leftRows.value[selectedLeftIndex.value] ?? null;
});

const filteredRightRows = computed(() => {
  if (!selectedLeftRow.value) return [];
  return rightRows.value.filter(
    (row) => row.leftCode === selectedLeftRow.value?.code,
  );
});

const rightStickyRow = computed(() => {
  return filteredRightRows.value[0] ?? null;
});

function selectLeftRow(index: number) {
  selectedLeftIndex.value = index;
}

function handleDialogAction(
  input: number | { child?: { actionKey?: number } },
) {
  const key = typeof input === "number" ? input : input?.child?.actionKey;

  if (!key) return;

  switch (key) {
    case 2:
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

function handlePrintRange() {
  console.log("Thực hiện in");
}

function handleOutputSettings(payload: any) {
  console.log("Output settings:", payload);
}

function getCurrentKesnFromLocal(): number | null {
  const raw = localStorage.getItem(CURRENT_KESN_KEY);
  if (!raw) return null;

  const value = parseInt(raw, 10);
  return Number.isNaN(value) ? null : value;
}

function saveCurrentKesnToLocal() {
  localStorage.setItem(CURRENT_KESN_KEY, String(outputSettingKesn.value));
}

function saveStatusToLocal(status: CheckRirekiStatusResponse) {
  localStorage.setItem(RIREKI_TYPE_KEY, String(status.rirekiType));
  localStorage.setItem(
    CURRENT_SYORIKI_KEY,
    String(status.currentSyorikiDensiTyouboHozonUsage),
  );
  localStorage.setItem(
    CURRENT_KAISYA_DENSHI_KEY,
    String(status.isCurrentKaisyaDensiTyouboHozonUsage),
  );
}

function mapStatusResponse(response: any): CheckRirekiStatusResponse {
  const raw = response?.data?.data ?? response?.data ?? response;

  return {
    rirekiType: Number(raw?.rirekiType ?? 0),
    currentSyorikiDensiTyouboHozonUsage: Number(
      raw?.currentSyorikiDensiTyouboHozonUsage ?? 0,
    ),
    isCurrentKaisyaDensiTyouboHozonUsage: Boolean(
      raw?.isCurrentKaisyaDensiTyouboHozonUsage ?? false,
    ),
  };
}

// ===== F8 modal promise handling =====
let processingPeriodResolver: ((value: boolean) => void) | null = null;
const processingPeriodHandled = ref(false);

function showF8Modal(): Promise<boolean> {
  processingPeriodHandled.value = false;
  showProcessingPeriodSelectDialog.value = true;

  return new Promise<boolean>((resolve) => {
    processingPeriodResolver = resolve;
  });
}

function handleProcessingPeriod(kesn: string) {
  const parsedKesn = parseInt(kesn, 10);

  if (Number.isNaN(parsedKesn)) {
    if (processingPeriodResolver) {
      processingPeriodResolver(false);
      processingPeriodResolver = null;
    }
    showProcessingPeriodSelectDialog.value = false;
    return;
  }

  outputSettingKesn.value = parsedKesn;
  processingPeriodHandled.value = true;

  if (processingPeriodResolver) {
    processingPeriodResolver(true);
    processingPeriodResolver = null;
  }

  showProcessingPeriodSelectDialog.value = false;
}

watch(showProcessingPeriodSelectDialog, (visible) => {
  if (!visible && !processingPeriodHandled.value && processingPeriodResolver) {
    processingPeriodResolver(false);
    processingPeriodResolver = null;
  }
});

async function checkRirekiStatusAsync(): Promise<boolean> {
  const kesnToCheck = getCurrentKesnFromLocal() ?? 0;

  if (kesnToCheck === 0) {
    router.push("/");
    return false;
  }

  try {
    const response = await checkRirekiStatus(kesnToCheck);
    const status = mapStatusResponse(response);

    saveStatusToLocal(status);

    if (status.rirekiType !== 0) {
      outputSettingKesn.value = kesnToCheck;
      saveCurrentKesnToLocal();
      return true;
    }

    if (status.isCurrentKaisyaDensiTyouboHozonUsage === false) {
      await ShowMessageDialog(
        "・電子帳簿保存を使用するマスター\n" +
          "・内部統制機能強化モードマスター\n" +
          "・履歴を保存するマスター(履歴処理)\n" +
          "のいずれでもありません。\n" +
          "業務を終了します。",
        "科目履歴一覧",
        MessageBoxIcon.Error,
      );

      router.push("/");
      return false;
    }

    if (status.currentSyorikiDensiTyouboHozonUsage === 0) {
      const changePeriod = await ShowConfirmDialog(
        "当期は処理できません。\n処理期を変更しますか。",
        "処理期変更",
        MessageBoxIcon.Question,
      );

      if (!changePeriod) {
        router.push("/");
        return false;
      }

      while (true) {
        const selected = await showF8Modal();

        if (!selected) {
          const exit = await ShowConfirmDialog(
            "処理期が選択されていません。\n科目履歴一覧を終了しますか。",
            "処理期変更",
            MessageBoxIcon.Question,
          );

          if (exit) {
            router.push("/");
            return false;
          }

          continue;
        }

        const kesnSelected = outputSettingKesn.value;
        const responseAfterSelect = await checkRirekiStatus(kesnSelected);
        const statusAfterSelect = mapStatusResponse(responseAfterSelect);

        saveStatusToLocal(statusAfterSelect);

        if (statusAfterSelect.currentSyorikiDensiTyouboHozonUsage === 0) {
          const changeAgain = await ShowConfirmDialog(
            "指定処理期は処理できません。\n処理期を変更しますか。",
            "処理期変更",
            MessageBoxIcon.Question,
          );

          if (!changeAgain) {
            router.push("/");
            return false;
          }

          continue;
        }

        saveCurrentKesnToLocal();
        return true;
      }
    }

    outputSettingKesn.value = kesnToCheck;
    saveCurrentKesnToLocal();
    return true;
  } catch (error) {
    console.error("checkRirekiStatusAsync error:", error);
    router.push("/");
    return false;
  }
}

onMounted(async () => {
  const ok = await checkRirekiStatusAsync();

  if (!ok) return;

  showOutputSettingsDialog.value = true;
});
</script>

<template>
  <div class="layout">
    <AppSidebar />

    <div class="content-area">
      <AppHeader
        userName="User 0001"
        title="科目履歴一覧"
        periodText="当期：自 2026年 1月 1日 至 2026年12月31日"
        screenCode="KNMRI-1"
        :menus="headerMenusJob10a"
        :showHelp="true"
        :showShortcut="true"
        @menu-click="handleDialogAction"
      />

      <main class="page-container">
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
                        :key="`${item.internalCode}-${idx}`"
                        class="row-selectable"
                        :class="{ 'selected-row': selectedLeftIndex === idx }"
                        @click="selectLeftRow(idx)"
                      >
                        <td style="text-align: center">{{ item.del }}</td>
                        <td>{{ item.internalCode }}</td>
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
                          {{ rightStickyRow.changeDate }}
                        </th>
                        <th style="width: 70px">{{ rightStickyRow.code }}</th>
                        <th style="width: 150px; text-align: left">
                          {{ rightStickyRow.screenName }}
                        </th>
                        <th style="width: 150px; text-align: left">
                          {{ rightStickyRow.printName }}
                        </th>
                        <th style="width: 50px">{{ rightStickyRow.type }}</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="(row, idx) in filteredRightRows"
                        :key="`${row.leftCode}-${row.changeDate}-${idx}`"
                      >
                        <td>{{ row.changeDate }}</td>
                        <td>{{ row.code }}</td>
                        <td>{{ row.screenName }}</td>
                        <td>{{ row.printName }}</td>
                        <td>{{ row.type }}</td>
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
      />

      <ProcessingPeriodDialog
        v-model:visible="showProcessingPeriodSelectDialog"
        @confirm="handleProcessingPeriod"
      />

      <AppFooter
        :buttons="footerJob10a"
        :enabled-keys="[2, 4, 8]"
        @key-click="handleDialogAction"
      />
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  margin: 5px 0 5px;
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
  top: 38px;
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
