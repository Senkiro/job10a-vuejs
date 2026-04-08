<script setup lang="ts">
export type HeaderMenuChild = {
  label: string;
  key?: number;
  disabled?: boolean;
  separatorAfter?: boolean;
  actionKey?: number;
};

export type HeaderMenuItem = {
  label: string;
  children?: HeaderMenuChild[];
};

defineProps<{
  userName: string;
  title: string;
  periodText: string;
  screenCode: string;
  menus?: HeaderMenuItem[];
  showHelp?: boolean;
  showShortcut?: boolean;
}>();

const emit = defineEmits<{
  (
    e: "menu-click",
    payload: {
      menu: HeaderMenuItem;
      child: HeaderMenuChild;
    },
  ): void;
}>();

function handleChildClick(menu: HeaderMenuItem, child: HeaderMenuChild) {
  if (child.disabled) return;
  emit("menu-click", { menu, child });
}
</script>

<template>
  <header class="header-bar">
    <div class="top-row px-4">
      <a>
        {{ userName }}
        <span style="margin-left: 5px">
          <i class="bi bi-person-circle"></i> </span
        >,
      </a>
    </div>

    <div class="header-top">
      <span style="font-weight: bold">{{ title }}</span>
      <span>{{ periodText }}</span>
      <span class="code">{{ screenCode }}</span>
    </div>

    <div class="header-bot">
      <div class="sub-function">
        <div v-for="menu in menus ?? []" :key="menu.label" class="menu-item">
          {{ menu.label }}

          <ul v-if="menu.children?.length" class="submenu">
            <li
              v-for="child in menu.children"
              :key="child.label"
              :class="{
                'disabled-item': child.disabled,
                'separator-after': child.separatorAfter,
              }"
              @click.stop="handleChildClick(menu, child)"
            >
              {{ child.label }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="showHelp" class="right-tools">
        <div class="help">
          <i class="bi bi-question-circle-fill"></i>
          <span>ヘルプ(H)</span>
        </div>
      </div>
    </div>

    <div v-if="showShortcut" class="shortcut">
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
  gap: 16px;
}

.menu-item {
  position: relative;
  cursor: pointer;
  padding: 4px 8px;
  user-select: none;
  color: black;
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

.submenu li {
  padding: 6px 12px;
  white-space: nowrap;
}

.submenu li:hover {
  background: #dbe9ff;
}

.separator-after {
  border-bottom: 1px solid #cfcfcf;
  margin-bottom: 4px;
  padding-bottom: 8px;
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

.disabled-item {
  color: #aaa;
  pointer-events: none;
}
</style>
