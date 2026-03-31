<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="header-bar">
    <div class="top-row px-4">
      <a
        >User 0001<span style="margin-left: 5px"
          ><i class="bi bi-person-circle"></i></span
      ></a>
    </div>

    <div class="header-top">
      <span style="font-weight: bold">科目履歴一覧</span>
      <span>当期：自 2026年 1月 1日 至 2026年12月31日</span>
      <span class="code">KNMRI-1</span>
    </div>
    <div class="header-bot">
      <div class="sub-function">
        <div class="menu-item">
          ファイル(F)
          <ul class="submenu">
            <li>印刷(P)...F2</li>
          </ul>
        </div>
        <div class="menu-item">
          オプション(O)
          <ul class="submenu">
            <li>出力設定(O)...F4</li>
          </ul>
        </div>
        <div class="menu-item">
          処理月変更(R)
          <ul class="submenu">
            <li>処理期選択(S)...F8</li>
          </ul>
        </div>
        <div class="menu-item">
          バージョン(A)
          <ul class="submenu">
            <li>バージョン情報(A)...</li>
          </ul>
        </div>
      </div>

      <div class="right-tools">
        <div class="help">
          <i class="bi bi-question-circle-fill"></i>
          <span>ヘルプ(H)</span>
        </div>
      </div>
    </div>
    <div class="shortcut">
      <div class="shortcut-button">
        <i class="bi bi-caret-right-fill"></i>
        <span>ショートカットキー</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-row {
  background-color: #f7f7f7;
  border-bottom: 1px solid #d6d5d5;
  justify-content: flex-end;
  height: 33px;
  display: flex;
  align-items: center;
}

.header-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.header-top {
  color: black;
  background-color: #c7e8ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
}

.header-bot {
  padding: 3px 12px 3px 0px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #a39d9d;
}

.sub-function {
  display: flex;
  align-items: center;
}

.menu-item {
  color: black;
  padding: 0 10px;
  font-size: 14px;
  line-height: 20px;
  border-left: 1px solid #eeeeee;
}

.menu-item:first-child {
  border-left: none;
  padding-left: 12px;
}

.right-tools {
  padding-top: 3px;
  gap: 4px;
}

.help {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.shortcut {
  margin-top: 5px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.shortcut-button {
  padding-right: 5px;
  font-size: 14px;
}

.code {
  margin-left: 20px;
}

.sub-function {
  display: flex;
  gap: 16px;
}

.menu-item {
  position: relative;
  cursor: pointer;
  padding: 4px 8px;
  user-select: none;
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: #fff;
  border: 1px solid #999;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 4px 0;
  margin: 0;
  display: none;
  z-index: 1000;
}

.menu-item:hover .submenu {
  display: block;
}

.submenu li {
  padding: 6px 12px;
  white-space: nowrap;
}

.submenu li:hover {
  background: #dbe9ff;
}

.submenu .divider {
  height: 1px;
  margin: 4px 0;
  background: #ccc;
  padding: 0;
}

/* disabled */
.disabled-item {
  color: #aaa;
  pointer-events: none;
}
</style>
