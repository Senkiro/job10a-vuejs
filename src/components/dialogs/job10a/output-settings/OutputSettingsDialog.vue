<script setup lang="ts">
import { useHistoryOutputDialog } from "./useHistoryOutputDialog.ts";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";
import Dialog from "primevue/dialog";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (
    e: "confirm",
    payload: {
      isAllMode: boolean;
      date: string;
      time: string;
      add: boolean;
      upd: boolean;
      del: boolean;
      selectedRow: any;
    },
  ): void;
  (e: "cancel"): void;
}>();

const {
  activeTitle,
  selectedChildItem,
  isAllMode,
  dateText,
  timeText,
  model,
  selectedRowIndex,
  historys,
  onModeChanged,
  onRowClicked,
  onDateClicked,
  onSearchClicked,
  confirmDialog,
  closeDialog,
} = useHistoryOutputDialog(props, emit);
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
                autofocus
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
                v-for="(row, idx) in historys"
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
