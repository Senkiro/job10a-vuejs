import type { HeaderMenuItem } from "@/components/AppHeader.vue";

export const headerMenusJob10a: HeaderMenuItem[] = [
  {
    label: "ファイル(F)",
    children: [{ label: "印刷(P)...F2" }],
  },
  {
    label: "オプション(O)",
    children: [{ label: "出力設定(O)...F4" }],
  },
  {
    label: "処理月変更(R)",
    children: [{ label: "処理期選択(S)...F8" }],
  },
  {
    label: "バージョン(A)",
    children: [{ label: "バージョン情報(A)..." }],
  },
];

export const headerMenusJob30: HeaderMenuItem[] = [
  {
    label: "ファイル(F)",
    children: [
      { label: "全月合併(I)" },
      { label: "全月選択クリア(C)", separatorAfter: true },
      { label: "合併パターン(S)... F4" },
      { label: "合併パターン印刷(O)", separatorAfter: true },
      { label: "科目未登録一覧表印刷(P)" },
    ],
  },
  {
    label: "オプション(O)",
    children: [{ label: "オプション設定" }],
  },
  {
    label: "バージョン(A)",
    children: [{ label: "バージョン情報(A)..." }],
  },
];
