<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import logoSias from "@/assets/images/logo-sias.png";

type MenuItem = {
  label: string;
  to: string;
  icon?: "home" | "file";
};

type MenuGroup = {
  title?: string;
  items: MenuItem[];
};

const props = defineProps<{
  systemName?: string;
  companyCode?: string | number;
}>();

const route = useRoute();

const menuGroups: MenuGroup[] = [
  {
    items: [{ label: "ホーム", to: "/", icon: "home" }],
  },
  {
    title: "マスター履歴一覧",
    items: [{ label: "科目履歴一覧", to: "/job10a", icon: "file" }],
  },
  {
    title: "月次処理",
    items: [{ label: "残高合併", to: "/job30", icon: "file" }],
  },
  {
    title: "消費税処理",
    items: [{ label: "消費税額試算表", to: "/job60", icon: "file" }],
  },
];

const companyCode = computed(() => props.companyCode ?? "5000");

const isActive = (path: string) => route.path === path;

const getMenuIcon = (icon?: MenuItem["icon"]) => {
  switch (icon) {
    case "home":
      return "bi bi-house-door";
    case "file":
    default:
      return "bi bi-file-earmark-text";
  }
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <img class="sidebar__logo-image" :src="logoSias" alt="SIAS logo" />
    </div>

    <div class="sidebar__content">
      <section
        v-for="(group, groupIndex) in menuGroups"
        :key="groupIndex"
        class="menu-group"
      >
        <div v-if="group.title" class="menu-group__title">
          {{ group.title }}
        </div>

        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="menu-item"
          :class="{ 'menu-item--active': isActive(item.to) }"
        >
          <span class="menu-item__icon">
            <i :class="getMenuIcon(item.icon)"></i>
          </span>

          <span class="menu-item__label">{{ item.label }}</span>
        </RouterLink>
      </section>
    </div>

    <div class="sidebar__footer">
      <div class="footer-top">
        <RouterLink to="/company-change" class="footer-company-link">
          <span class="footer-icon" aria-label="logout">
            <i class="bi bi-box-arrow-left"></i>
          </span>

          <span class="footer-icon" aria-label="company">
            <i class="bi bi-file-earmark-text"></i>
          </span>

          <span class="footer-code">
            {{ companyCode }}
          </span>
        </RouterLink>
      </div>

      <div class="footer-system">ICSP財務システム</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  height: 100vh;
  background: #003f82;
  color: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cfd8e3;
}

.sidebar__logo {
  background: #fff;
  border-bottom: 1px solid #d8e0ea;
}

.sidebar__logo-image {
  display: block;
  width: 100%;
  height: 100px;
  min-height: 100px;
}

.sidebar__content {
  flex: 1;
  padding: 18px 10px 16px;
  overflow-y: auto;
}

.menu-group + .menu-group {
  margin-top: 22px;
}

.menu-group__title {
  font-size: 14px;
  color: #8fb1d8;
  margin: 0 12px 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 14px;
  margin: 6px 6px 0;
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu-item--active {
  background: #0d5eb5;
}

.menu-item__icon {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-item__icon i {
  font-size: 18px;
  line-height: 1;
}

.menu-item__label {
  font-size: 17px;
  letter-spacing: 0.2px;
}

.sidebar__footer {
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  padding: 12px 16px 14px;
}

.footer-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.sidebar__footer {
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  padding: 12px 16px 14px;
}

.footer-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.footer-icon {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.footer-icon i {
  font-size: 18px;
  line-height: 1;
}

.footer-company-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 36px;
  padding: 6px 10px;
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.footer-company-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.footer-code {
  font-size: 18px;
  line-height: 1;
}

.footer-system {
  font-size: 16px;
  line-height: 1.3;
}
</style>
