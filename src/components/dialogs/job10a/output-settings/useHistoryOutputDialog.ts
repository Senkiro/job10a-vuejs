import { computed, ref, watch } from "vue";

type ChildItem =
  | "全履歴を出力"
  | "指定日以降の検索対象を出力"
  | "追加"
  | "変更"
  | "削除";

type ActiveItem = "EditMode" | "Date" | "Search";

type HistoryRow = {
  id: number;
  processDateTime: string;
  processType: string;
  processContent: string;
  processUser: string;
};

export function useHistoryOutputDialog(props: any, emit: any) {
  const activeTitle = ref<ActiveItem>("EditMode");
  const selectedChildItem = ref<ChildItem>("全履歴を出力");
  const isAllMode = ref(true);

  const dateText = ref("");
  const timeText = ref("");

  const model = ref({
    add: false,
    upd: false,
    del: false,
  });

  const selectedRowIndex = ref<number | null>(null);

  const historys = ref<HistoryRow[]>([
    {
      id: 1,
      processDateTime: "2026/03/20 10:30",
      processType: "追加",
      processContent: "商品マスタ登録",
      processUser: "TANAKA",
    },
  ]);

  const selectedRow = computed(() => {
    if (selectedRowIndex.value === null) return null;
    return historys.value[selectedRowIndex.value] ?? null;
  });

  watch(
    () => props.visible,
    (val) => {
      if (!val) resetForm();
    },
  );

  function resetForm() {
    activeTitle.value = "EditMode";
    selectedChildItem.value = "全履歴を出力";
    isAllMode.value = true;
    dateText.value = "";
    timeText.value = "";
    model.value = { add: false, upd: false, del: false };
    selectedRowIndex.value = null;
  }

  function closeDialog() {
    emit("update:visible", false);
    emit("cancel");
  }

  function onModeChanged(mode: number) {
    isAllMode.value = mode === 0;
    selectedChildItem.value =
      mode === 0 ? "全履歴を出力" : "指定日以降の検索対象を出力";
    activeTitle.value = "EditMode";

    if (isAllMode.value) {
      dateText.value = "";
      timeText.value = "";
      model.value.add = false;
      model.value.upd = false;
      model.value.del = false;
      selectedRowIndex.value = null;
    }
  }

  function onRowClicked(idx: number) {
    if (isAllMode.value) return;
    selectedRowIndex.value = idx;
    activeTitle.value = "Date";
  }

  function onDateClicked() {
    if (isAllMode.value) return;
    activeTitle.value = "Date";
  }

  function onSearchClicked(item: ChildItem) {
    if (isAllMode.value) return;
    selectedChildItem.value = item;
    activeTitle.value = "Search";
  }

  function confirmDialog() {
    emit("confirm", {
      isAllMode: isAllMode.value,
      date: dateText.value,
      time: timeText.value,
      add: model.value.add,
      upd: model.value.upd,
      del: model.value.del,
      selectedRow: selectedRow.value,
    });
    emit("update:visible", false);
  }

  return {
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
  };
}
