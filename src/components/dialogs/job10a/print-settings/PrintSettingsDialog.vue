<script setup lang="ts">
import Dialog from "primevue/dialog";
import { computed, ref, watch } from "vue";
import DialogDefaultFooter from "@/components/dialogs/common/DialogDefaultFooter.vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm", payload: any): void;
}>();

type PrintItem =
  | "Title"
  | "Code"
  | "CreatedDate"
  | "Time"
  | "Period"
  | "PageRange"
  | "Printer"
  | "PaperTray"
  | "Ori"
  | "Size"
  | "NumberOfCopy";

type HintType = "CreatedDate" | "PageRange" | "Setup" | null;
type PaperSize = "A3" | "A4" | "B4" | "B5";

const activeTitle = ref<PrintItem>("Title");
const activeHint = ref<HintType>(null);

const outputTitle = ref(true);
const outputCode = ref(true);
const outputDate = ref(true);
const outputTime = ref(true);
const outputPeriod = ref(true);
const outputPageRange = ref(true);
const outputOri = ref(true);

const selectedSize = ref<PaperSize>("A4");

const year = ref(2025);
const month = ref(12);
const day = ref(4);

const pageFrom = ref(1);
const pageTo = ref(9999);

const printer = ref("Microsoft Print to PDF");
const paperTray = ref("Microsoft Print to PDF");
const copies = ref(1);
const enablePrinterSetting = ref(false);

const printerOptions = ["Microsoft Print to PDF", "Adobe PDF", "Canon LBP2900"];

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      activeHint.value = null;
    }
  },
);

function setActive(item: PrintItem) {
  activeTitle.value = item;
  activeHint.value = null;
}

function onDateCreateClicked() {
  setActive("CreatedDate");
  activeHint.value = "CreatedDate";
}

function onPageRangeClicked() {
  setActive("PageRange");
  activeHint.value = "PageRange";
}

function onSetUpClicked() {
  activeHint.value = "Setup";
}

function closeDialog() {
  emit("update:visible", false);
}

function handleOk() {
  emit("confirm", {
    outputTitle: outputTitle.value,
    outputCode: outputCode.value,
    outputDate: outputDate.value,
    outputTime: outputTime.value,
    outputPeriod: outputPeriod.value,
    outputPageRange: outputPageRange.value,
    outputOri: outputOri.value,
    selectedSize: selectedSize.value,
    year: year.value,
    month: month.value,
    day: day.value,
    pageFrom: pageFrom.value,
    pageTo: pageTo.value,
    printer: printer.value,
    paperTray: paperTray.value,
    copies: copies.value,
    enablePrinterSetting: enablePrinterSetting.value,
  });

  emit("update:visible", false);
}

const hintText = computed(() => {
  if (activeHint.value === "CreatedDate") {
    return "和暦(年2桁)で年月日を指定して下さい。";
  }
  if (activeHint.value === "PageRange") {
    return "1~9999までの範囲を指定する事ができます。";
  }
  if (activeHint.value === "Setup") {
    return "プロパティ設定で設定した内容を使用して印刷します。";
  }
  return "";
});
</script>

<template>
  <Dialog
    :visible="props.visible"
    modal
    header="プリンタ設定"
    :closable="true"
    :draggable="false"
    :style="{ width: '820px' }"
    v-focustrap
    position="top"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="print-group">
      <div class="print-group-title">印刷項目</div>

      <table class="print-table">
        <tr>
          <td
            :class="activeTitle === 'Title' ? 'title-active' : 'title-inactive'"
          >
            会社タイトル
          </td>
          <td>
            <label>
              <input
                type="radio"
                name="title"
                :checked="outputTitle"
                @change="
                  () => {
                    outputTitle = true;
                    setActive('Title');
                  }
                "
              />
              出力する
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="title"
                :checked="!outputTitle"
                @change="
                  () => {
                    outputTitle = false;
                    setActive('Title');
                  }
                "
              />
              出力しない
            </label>
          </td>
        </tr>

        <tr>
          <td
            :class="activeTitle === 'Code' ? 'title-active' : 'title-inactive'"
          >
            会社コード
          </td>
          <td>
            <label>
              <input
                type="radio"
                name="code"
                :checked="outputCode"
                @change="
                  () => {
                    outputCode = true;
                    setActive('Code');
                  }
                "
              />
              出力する
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="code"
                :checked="!outputCode"
                @change="
                  () => {
                    outputCode = false;
                    setActive('Code');
                  }
                "
              />
              出力しない
            </label>
          </td>
        </tr>

        <tr>
          <td
            :class="
              activeTitle === 'CreatedDate' ? 'title-active' : 'title-inactive'
            "
          >
            作成日
          </td>
          <td class="date-row">
            <label>
              <input
                type="radio"
                name="date"
                :checked="outputDate"
                @change="
                  () => {
                    outputDate = true;
                    setActive('CreatedDate');
                  }
                "
              />
              出力する
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="date"
                :checked="!outputDate"
                @change="
                  () => {
                    outputDate = false;
                    outputTime = false;
                    setActive('CreatedDate');
                  }
                "
              />
              出力しない
            </label>

            <input
              v-model="year"
              type="number"
              class="date-input-60 pg border1"
              :disabled="!outputDate"
              @click="onDateCreateClicked"
            />
            年

            <input
              v-model="month"
              type="number"
              class="date-input-40 pg border1"
              :disabled="!outputDate"
              @click="onDateCreateClicked"
            />
            月

            <input
              v-model="day"
              type="number"
              class="date-input-40 pg border1"
              :disabled="!outputDate"
              @click="onDateCreateClicked"
            />
            日
          </td>
        </tr>

        <tr>
          <td
            :class="activeTitle === 'Time' ? 'title-active' : 'title-inactive'"
          >
            時 刻
          </td>
          <td class="time-row">
            <label>
              <input
                type="radio"
                name="time"
                :checked="outputTime"
                :disabled="!outputDate"
                @change="outputTime = true"
                @click="setActive('Time')"
              />
              出力する
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="time"
                :checked="!outputTime"
                :disabled="!outputDate"
                @change="outputTime = false"
                @click="setActive('Time')"
              />
              出力しない
            </label>
          </td>
        </tr>

        <tr>
          <td
            :class="
              activeTitle === 'Period' ? 'title-active' : 'title-inactive'
            "
          >
            整理月情報
          </td>
          <td>
            <label>
              <input
                type="radio"
                name="period"
                :checked="outputPeriod"
                @change="
                  () => {
                    outputPeriod = true;
                    setActive('Period');
                  }
                "
              />
              出力する
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="period"
                :checked="!outputPeriod"
                @change="
                  () => {
                    outputPeriod = false;
                    setActive('Period');
                  }
                "
              />
              出力しない
            </label>
          </td>
        </tr>

        <tr>
          <td
            :class="
              activeTitle === 'PageRange' ? 'title-active' : 'title-inactive'
            "
          >
            頁 範 囲
          </td>
          <td>
            <label>
              <input
                type="radio"
                name="pageRange"
                :checked="outputPageRange"
                @change="
                  () => {
                    outputPageRange = true;
                    setActive('PageRange');
                  }
                "
              />
              出力する
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="pageRange"
                :checked="!outputPageRange"
                @change="
                  () => {
                    outputPageRange = false;
                    setActive('PageRange');
                  }
                "
              />
              出力しない
            </label>

            <input
              v-model="pageFrom"
              style="margin-left: 30px"
              type="number"
              class="pg date-input-60 border1"
              :disabled="!outputPageRange"
              @click="onPageRangeClicked"
            />
            から

            <input
              v-model="pageTo"
              type="number"
              class="pg date-input-60 border1"
              :disabled="!outputPageRange"
              @click="onPageRangeClicked"
            />
            頁まで
          </td>
        </tr>
      </table>
    </div>

    <div class="print-group print-group-flex">
      <div class="print-group-title">印刷項目</div>

      <table class="print-table">
        <tr>
          <td
            :class="
              activeTitle === 'Printer' ? 'title-active' : 'title-inactive'
            "
          >
            プリンタ
          </td>
          <td>
            <select
              v-model="printer"
              class="print-select border1"
              @click="setActive('Printer')"
            >
              <option v-for="item in printerOptions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </td>
        </tr>

        <tr>
          <td
            :class="
              activeTitle === 'PaperTray' ? 'title-active' : 'title-inactive'
            "
          >
            用紙トレイ
          </td>
          <td>
            <select
              v-model="paperTray"
              class="print-select border1"
              @click="setActive('PaperTray')"
            >
              <option v-for="item in printerOptions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </td>
        </tr>

        <tr>
          <td
            :class="activeTitle === 'Ori' ? 'title-active' : 'title-inactive'"
          >
            用紙方向
          </td>
          <td>
            <label>
              <input
                type="radio"
                name="ori"
                :checked="outputOri"
                @change="
                  () => {
                    outputOri = true;
                    setActive('Ori');
                  }
                "
              />
              縦
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="ori"
                :checked="!outputOri"
                @change="
                  () => {
                    outputOri = false;
                    setActive('Ori');
                  }
                "
              />
              横
            </label>
          </td>
        </tr>

        <tr>
          <td
            :class="activeTitle === 'Size' ? 'title-active' : 'title-inactive'"
          >
            用紙サイズ
          </td>
          <td @click="setActive('Size')">
            <label>
              <input
                type="radio"
                name="size"
                :checked="selectedSize === 'A3'"
                @change="selectedSize = 'A3'"
              />
              A3
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="size"
                :checked="selectedSize === 'A4'"
                @change="selectedSize = 'A4'"
              />
              A4
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="size"
                :checked="selectedSize === 'B4'"
                @change="selectedSize = 'B4'"
              />
              B4
            </label>

            <label style="margin-left: 20px">
              <input
                type="radio"
                name="size"
                :checked="selectedSize === 'B5'"
                @change="selectedSize = 'B5'"
              />
              B5
            </label>
          </td>
        </tr>

        <tr>
          <td
            :class="
              activeTitle === 'NumberOfCopy' ? 'title-active' : 'title-inactive'
            "
          >
            部　数
          </td>
          <td>
            <input
              v-model="copies"
              type="number"
              class="date-input-40 pg"
              @click="setActive('NumberOfCopy')"
            />
            部
          </td>
        </tr>
      </table>

      <div class="printer-prop-box">
        <div class="printer-prop-title">プリンダ　プロパティ</div>
        <button type="button" class="btn-setting">設定（Ｐ）</button>

        <div style="margin-top: 10px">
          <label>
            <input
              v-model="enablePrinterSetting"
              type="checkbox"
              @click="onSetUpClicked"
            />
            設定値を有効にする
          </label>
        </div>
      </div>
    </div>
    <div v-if="hintText" class="hint-text">
      {{ hintText }}
    </div>
    <template #footer>
      <DialogDefaultFooter @confirm="handleOk" @cancel="closeDialog" />
    </template>
  </Dialog>
</template>

<style scoped src="./PrintSettingsDialog.css"></style>
