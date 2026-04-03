<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import DialogDefaultFooter from "../../common/DialogDefaultFooter.vue";
import InputText from "primevue/inputtext";

type GetKamokuDto = {
  kicd?: string | null;
  kcod?: string | null;
  kana?: string | null;
  shortName?: string | null;
  longName?: string | null;
};

type ActiveTitle = "Kata" | "NumberChoose" | "Name";

const props = defineProps<{
  visible: boolean;
  items?: GetKamokuDto[];
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit", value: GetKamokuDto): void;
}>();

const filters1 = ["出力", "入力", "内部", "カナ"] as const;
const filters2 = [
  "あ",
  "か",
  "さ",
  "た",
  "な",
  "は",
  "ま",
  "や",
  "ら",
  "わ",
] as const;

const modalTabActive = ref<string>("内部");
const activeTitle = ref<ActiveTitle>("Kata");

const searchKana = ref("");
const searchName = ref("");
const selectedIndex = ref("");
const selectedRow = ref<string | null>(null);

const model = ref<GetKamokuDto>({
  kicd: null,
  kcod: null,
  kana: null,
  shortName: null,
  longName: null,
});

const scrollContainerRef = ref<HTMLElement | null>(null);
const suppressIndexScroll = ref(false);
const sourceItems = ref<GetKamokuDto[]>([]);

function setActive(item: ActiveTitle) {
  activeTitle.value = item;
}

function handleClose() {
  emit("update:visible", false);
}

function handleSubmit() {
  emit("submit", { ...model.value });
  emit("update:visible", false);
}

function getRowId(index: number) {
  return `kamoku-row-${index}`;
}

function resetModel() {
  model.value = {
    kicd: null,
    kcod: null,
    kana: null,
    shortName: null,
    longName: null,
  };
}

function resetSelectionOnFilterChange() {
  selectedRow.value = null;

  suppressIndexScroll.value = true;
  selectedIndex.value = "";
  suppressIndexScroll.value = false;

  resetModel();
}

function resetIndexToFirstBeforeSearch() {
  selectedRow.value = null;

  suppressIndexScroll.value = true;
  selectedIndex.value = "";
  suppressIndexScroll.value = false;
}

function toFullWidthKatakana(s: string) {
  if (!s) return "";

  const map: Record<string, string> = {
    ｱ: "ア",
    ｲ: "イ",
    ｳ: "ウ",
    ｴ: "エ",
    ｵ: "オ",
    ｶ: "カ",
    ｷ: "キ",
    ｸ: "ク",
    ｹ: "ケ",
    ｺ: "コ",
    ｻ: "サ",
    ｼ: "シ",
    ｽ: "ス",
    ｾ: "セ",
    ｿ: "ソ",
    ﾀ: "タ",
    ﾁ: "チ",
    ﾂ: "ツ",
    ﾃ: "テ",
    ﾄ: "ト",
    ﾅ: "ナ",
    ﾆ: "ニ",
    ﾇ: "ヌ",
    ﾈ: "ネ",
    ﾉ: "ノ",
    ﾊ: "ハ",
    ﾋ: "ヒ",
    ﾌ: "フ",
    ﾍ: "ヘ",
    ﾎ: "ホ",
    ﾏ: "マ",
    ﾐ: "ミ",
    ﾑ: "ム",
    ﾒ: "メ",
    ﾓ: "モ",
    ﾔ: "ヤ",
    ﾕ: "ユ",
    ﾖ: "ヨ",
    ﾗ: "ラ",
    ﾘ: "リ",
    ﾙ: "ル",
    ﾚ: "レ",
    ﾛ: "ロ",
    ﾜ: "ワ",
    ｦ: "ヲ",
    ﾝ: "ン",
    ｧ: "ァ",
    ｨ: "ィ",
    ｩ: "ゥ",
    ｪ: "ェ",
    ｫ: "ォ",
    ｬ: "ャ",
    ｭ: "ュ",
    ｮ: "ョ",
    ｯ: "ッ",
    ｰ: "ー",
  };

  const dakutenMap: Record<string, string> = {
    カ: "ガ",
    キ: "ギ",
    ク: "グ",
    ケ: "ゲ",
    コ: "ゴ",
    サ: "ザ",
    シ: "ジ",
    ス: "ズ",
    セ: "ゼ",
    ソ: "ゾ",
    タ: "ダ",
    チ: "ヂ",
    ツ: "ヅ",
    テ: "デ",
    ト: "ド",
    ハ: "バ",
    ヒ: "ビ",
    フ: "ブ",
    ヘ: "ベ",
    ホ: "ボ",
    ウ: "ヴ",
  };

  const handakutenMap: Record<string, string> = {
    ハ: "パ",
    ヒ: "ピ",
    フ: "プ",
    ヘ: "ペ",
    ホ: "ポ",
  };

  const chars: string[] = [];
  const dakuten = "ﾞ";
  const handakuten = "ﾟ";

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!c) continue;

    const mapped = map[c];

    if (mapped) {
      const fw = mapped;

      if (i + 1 < s.length && s[i + 1] === dakuten) {
        chars.push(dakutenMap[fw] ?? fw);
        i++;
        continue;
      }

      if (i + 1 < s.length && s[i + 1] === handakuten) {
        chars.push(handakutenMap[fw] ?? fw);
        i++;
        continue;
      }

      chars.push(fw);
      continue;
    }

    chars.push(c);
  }

  return chars.join("");
}

function katakanaToHiragana(text: string) {
  return text.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  );
}

function getGojuonRowKeyNoNormalizeForm(kana?: string | null) {
  if (!kana?.trim()) return "";

  const normalizedKana = toFullWidthKatakana(kana.trim());
  const firstChar = normalizedKana[0];
  if (!firstChar) return "";

  let c = firstChar;

  if (c >= "\u30A1" && c <= "\u30F6") {
    c = String.fromCharCode(c.charCodeAt(0) - 0x60);
  }

  const convertMap: Record<string, string> = {
    が: "か",
    ぎ: "か",
    ぐ: "か",
    げ: "か",
    ご: "か",
    ざ: "さ",
    じ: "さ",
    ず: "さ",
    ぜ: "さ",
    ぞ: "さ",
    だ: "た",
    ぢ: "た",
    づ: "た",
    で: "た",
    ど: "た",
    ば: "は",
    び: "は",
    ぶ: "は",
    べ: "は",
    ぼ: "は",
    ぱ: "は",
    ぴ: "は",
    ぷ: "は",
    ぺ: "は",
    ぽ: "は",
  };

  c = convertMap[c] ?? c;

  if ("あいうえお".includes(c)) return "あ";
  if ("かきくけこ".includes(c)) return "か";
  if ("さしすせそ".includes(c)) return "さ";
  if ("たちつてと".includes(c)) return "た";
  if ("なにぬねの".includes(c)) return "な";
  if ("はひふへほ".includes(c)) return "は";
  if ("まみむめも".includes(c)) return "ま";
  if ("やゆよ".includes(c)) return "や";
  if ("らりるれろ".includes(c)) return "ら";
  if ("わをん".includes(c)) return "わ";

  const lower = c.toLowerCase();
  if ("aeiou".includes(lower)) return "あ";
  if (lower === "k" || lower === "c") return "か";
  if (lower === "s") return "さ";
  if (lower === "t") return "た";
  if (lower === "n") return "な";
  if (lower === "h" || lower === "f") return "は";
  if (lower === "m") return "ま";
  if (lower === "y") return "や";
  if (lower === "r" || lower === "l") return "ら";
  if (lower === "w") return "わ";

  return "";
}

function toHiraganaForSort(kana?: string | null) {
  if (!kana?.trim()) return "";

  let normalized = toFullWidthKatakana(kana.trim());
  normalized = katakanaToHiragana(normalized);

  return normalized
    .replace(/ぁ/g, "あ")
    .replace(/ぃ/g, "い")
    .replace(/ぅ/g, "う")
    .replace(/ぇ/g, "え")
    .replace(/ぉ/g, "お")
    .replace(/ゃ/g, "や")
    .replace(/ゅ/g, "ゆ")
    .replace(/ょ/g, "よ")
    .replace(/っ/g, "つ");
}

function getRowOrderIndex(hiraHead?: string) {
  if (!hiraHead) return 99;
  if ("あいうえお".includes(hiraHead)) return 0;
  if ("かきくけこ".includes(hiraHead)) return 1;
  if ("さしすせそ".includes(hiraHead)) return 2;
  if ("たちつてと".includes(hiraHead)) return 3;
  if ("なにぬねの".includes(hiraHead)) return 4;
  if ("はひふへほ".includes(hiraHead)) return 5;
  if ("まみむめも".includes(hiraHead)) return 6;
  if ("やゆよ".includes(hiraHead)) return 7;
  if ("らりるれろ".includes(hiraHead)) return 8;
  if ("わをん".includes(hiraHead)) return 9;
  return 99;
}

const filteredItems = computed<GetKamokuDto[]>(() => {
  let query = [...sourceItems.value];

  if (filters2.includes(modalTabActive.value as (typeof filters2)[number])) {
    query = query.filter(
      (x) => getGojuonRowKeyNoNormalizeForm(x.kana) === modalTabActive.value,
    );
  }

  if (searchName.value.trim()) {
    const name = searchName.value.trim().toLowerCase();
    query = query.filter((x) =>
      (x.shortName ?? "").toLowerCase().includes(name),
    );
  }

  if (searchKana.value.trim()) {
    const kanaInput = toHiraganaForSort(searchKana.value);
    query = query.filter((x) =>
      toHiraganaForSort(x.kana).startsWith(kanaInput),
    );
  }

  if (filters1.includes(modalTabActive.value as (typeof filters1)[number])) {
    switch (modalTabActive.value) {
      case "入力":
        query.sort((a, b) => (a.kcod ?? "").localeCompare(b.kcod ?? ""));
        break;
      case "内部":
        query.sort((a, b) => (a.kicd ?? "").localeCompare(b.kicd ?? ""));
        break;
      case "カナ":
        query.sort((a, b) =>
          toHiraganaForSort(a.kana).localeCompare(toHiraganaForSort(b.kana)),
        );
        break;
      default:
        break;
    }
  } else if (
    filters2.includes(modalTabActive.value as (typeof filters2)[number])
  ) {
    query.sort((a, b) => {
      const hiraA = toHiraganaForSort(a.kana);
      const hiraB = toHiraganaForSort(b.kana);

      const firstA = hiraA[0];
      const firstB = hiraB[0];

      const orderA = firstA ? getRowOrderIndex(firstA) : 99;
      const orderB = firstB ? getRowOrderIndex(firstB) : 99;

      if (orderA !== orderB) return orderA - orderB;

      const cmp = hiraA.localeCompare(hiraB);
      if (cmp !== 0) return cmp;

      return (a.kicd ?? "").localeCompare(b.kicd ?? "");
    });
  }

  return query;
});

function onRowClick(item: GetKamokuDto, index: number) {
  selectedRow.value = item.kicd ?? null;

  suppressIndexScroll.value = true;
  selectedIndex.value = String(index + 1);
  suppressIndexScroll.value = false;

  model.value = { ...item };
}

function onRowDbClick(item: GetKamokuDto, index: number) {
  onRowClick(item, index);
  handleSubmit();
}

function applyDefaultSelection() {
  const rows = filteredItems.value;

  if (selectedRow.value) {
    const idx = rows.findIndex((x) => x.kicd === selectedRow.value);
    const row = idx >= 0 ? rows[idx] : undefined;

    if (row) {
      onRowClick(row, idx);
      return;
    }
  }

  const first = rows[0];
  if (first) {
    onRowClick(first, 0);
    return;
  }

  selectedRow.value = null;

  suppressIndexScroll.value = true;
  selectedIndex.value = "";
  suppressIndexScroll.value = false;

  resetModel();
}

function initializeSelection() {
  applyDefaultSelection();
}

function setBtnFilter(filter: string) {
  modalTabActive.value = filter;
  resetSelectionOnFilterChange();
  applyDefaultSelection();
}

async function scrollToRowByIndex(input?: string) {
  if (!input?.trim()) return;
  if (!filteredItems.value.length) return;

  const n = Number.parseInt(input.trim(), 10);
  if (Number.isNaN(n)) return;

  let idx = n - 1;
  if (idx < 0) idx = 0;
  if (idx >= filteredItems.value.length) idx = filteredItems.value.length - 1;

  suppressIndexScroll.value = true;
  selectedIndex.value = String(idx + 1);
  suppressIndexScroll.value = false;

  const row = filteredItems.value[idx];
  if (!row) return;

  onRowClick(row, idx);

  await nextTick();

  const rowEl = document.getElementById(getRowId(idx));
  rowEl?.scrollIntoView({ block: "nearest" });
}

watch(
  () => props.items,
  (val) => {
    sourceItems.value = [...(val ?? [])];
    initializeSelection();
  },
  { immediate: true },
);

watch(
  () => props.visible,
  async (val) => {
    if (!val) return;

    modalTabActive.value = "内部";
    searchKana.value = "";
    searchName.value = "";
    selectedIndex.value = "";
    selectedRow.value = null;
    activeTitle.value = "Kata";

    await nextTick();
    initializeSelection();
  },
);

watch(selectedIndex, async (value) => {
  if (suppressIndexScroll.value) return;
  await scrollToRowByIndex(value);
});

watch(searchKana, () => {
  resetIndexToFirstBeforeSearch();
  applyDefaultSelection();
});

watch(searchName, () => {
  resetIndexToFirstBeforeSearch();
  applyDefaultSelection();
});

onMounted(() => {
  initializeSelection();
});
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="科目名称検索"
    :closable="true"
    :draggable="false"
    :style="{ width: '900px' }"
    position="top"
    @update:visible="(val) => emit('update:visible', val)"
  >
    <div class="dialog-body">
      <div>
        <menu class="modal-menu">
          <div>
            <input
              v-for="filter in filters1"
              :key="filter"
              type="button"
              :value="filter"
              class="modal-menu-item"
              :class="{ active: modalTabActive === filter }"
              @click="setBtnFilter(filter)"
            />
          </div>

          <div>
            <input
              v-for="filter in filters2"
              :key="filter"
              type="button"
              :value="filter"
              class="modal-menu-item"
              :class="{ active: modalTabActive === filter }"
              @click="setBtnFilter(filter)"
            />
          </div>
        </menu>
      </div>

      <div class="search-box">
        <div class="search-row">
          <div class="search-item">
            <label
              :class="
                activeTitle === 'Kata' ? 'title-active' : 'title-inactive'
              "
            >
              カナ
            </label>
            <InputText
              v-model="searchKana"
              type="text"
              class="input-info"
              @focus="setActive('Kata')"
              autofocus
            />
          </div>

          <div class="search-item">
            <label
              :class="
                activeTitle === 'NumberChoose'
                  ? 'title-active'
                  : 'title-inactive'
              "
            >
              選択番号
            </label>
            <InputText
              v-model="selectedIndex"
              type="number"
              class="input-info"
              @focus="setActive('NumberChoose')"
            />
          </div>
        </div>

        <div class="search-row name-row">
          <div class="search-item full-width">
            <label
              :class="
                activeTitle === 'Name' ? 'title-active' : 'title-inactive'
              "
            >
              名称
            </label>
            <InputText
              v-model="searchName"
              type="text"
              class="input-info name-input"
              @focus="setActive('Name')"
            />
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <div ref="scrollContainerRef" class="scroll-container">
          <table class="table-bordered table">
            <thead>
              <tr>
                <th></th>
                <th>削</th>
                <th>科目コード</th>
                <th>コード</th>
                <th>カナ</th>
                <th>科目名称</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in filteredItems"
                :id="getRowId(index)"
                :key="`${item.kicd ?? ''}-${index}`"
                :class="{ active: selectedRow === item.kicd }"
                class="row-selectable"
                @click="onRowClick(item, index)"
                @dblclick="onRowDbClick(item, index)"
              >
                <td>{{ index + 1 }}</td>
                <td></td>
                <td>{{ item.kicd }}</td>
                <td>{{ item.kcod }}</td>
                <td>{{ item.kana }}</td>
                <td>{{ item.shortName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <DialogDefaultFooter @confirm="handleSubmit" @cancel="handleClose" />
    </template>
  </Dialog>
</template>

<style scoped src="./SeqSearchDialog.css"></style>
