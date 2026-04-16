<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "primevue/usetoast";

import Toast from "primevue/toast";
import Select from "primevue/select";

type CompanyOption = {
  label: string;
  value: string;
};

const router = useRouter();
const authStore = useAuthStore();
const companyId = ref("");
const selectedCompany = ref("");
const isLoading = ref(false);

const companies = ref<CompanyOption[]>([
  { label: "-- 会社を選択します -- ", value: "" },
  { label: "5000 自2026年1月1日～2026年12月31日", value: "5000" },
  // { label: "5001 自2026年1月1日～2026年12月31日", value: "5001" },
  // { label: "5002 自2026年1月1日～2026年12月31日", value: "5002" },
  // { label: "5003 自2026年1月1日～2026年12月31日", value: "5003" },
  { label: "5004 自2026年1月1日～2026年12月31日", value: "5004" },
  // { label: "5005 自2026年1月1日～2026年12月31日", value: "5005" },
  // { label: "5006 自2026年1月1日～2026年12月31日", value: "5006" },
  // { label: "5007 自2026年1月1日～2026年12月31日", value: "5007" },
  { label: "5008 自2026年1月1日～2026年12月31日", value: "5008" },
  { label: "7000 自2026年1月1日～2026年12月31日", value: "7000" },
]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleAdd() {
  if (!companyId.value.trim()) return;

  const newValue = companyId.value.trim();
  const existed = companies.value.some((item) => item.value === newValue);

  if (!existed) {
    companies.value.push({
      label: `会社 ${newValue}`,
      value: newValue,
    });
  }

  selectedCompany.value = newValue;
  companyId.value = "";
}

async function handleOk() {
  if (!selectedCompany.value.trim()) {
    toast.add({
      severity: "warn",
      summary: "警告",
      detail: "会社を選択してください。",
      life: 3000,
    });
    return;
  }

  const payload = {
    userCode: "01",
    password: "ICS",
    companyId: selectedCompany.value.trim(),
  };

  try {
    isLoading.value = true;

    await authStore.loginAction(payload);

    toast.add({
      severity: "success",
      summary: "通知",
      detail: "ログインに成功しました!",
      life: 3000,
    });

    //await sleep(3000);
    router.push("/");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "エラー",
      detail: "ログインに失敗しました!",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

const toast = useToast();
</script>

<template>
  <Toast />
  <div class="page-bg">
    <div class="bg-shape bg-shape-top"></div>
    <div class="bg-shape bg-shape-right"></div>
    <div class="curve-line"></div>

    <div class="modal-card">
      <div class="brand">OPEN21 SIAS</div>
      <div class="subtitle">会社を変更する</div>

      <div class="form-group">
        <label class="form-label">会社ID</label>
        <div class="id-row">
          <div class="input-wrap has-icon">
            <span class="input-icon"><i class="bi bi-buildings"></i></span>
            <input v-model="companyId" type="text" class="text-input" />
          </div>
          <button class="small-btn" type="button" @click="handleAdd">
            追加
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">会社一覧</label>
        <div class="select-wrap">
          <Select
            v-model="selectedCompany"
            :options="companies"
            filter
            optionLabel="label"
            optionValue="value"
            placeholder="-- 会社を選択してください --"
            class="select-input"
          />
        </div>
      </div>

      <div class="action-row">
        <button
          class="primary-btn"
          type="button"
          @click="handleOk"
          :disabled="isLoading"
        >
          {{ isLoading ? "Loading..." : "OK" }}
        </button>

        <RouterLink to="/" class="secondary-btn">
          <span>キャンセル</span>
        </RouterLink>
      </div>
    </div>

    <div class="copyright">Copyright@2015 株式会社ICSパートナーズ</div>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.page-bg {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf2f7;
}

.bg-shape {
  position: absolute;
  background: rgba(201, 209, 219, 0.5);
  pointer-events: none;
}

.bg-shape-top {
  top: -60px;
  left: -80px;
  width: 620px;
  height: 320px;
  border-radius: 0 0 220px 220px;
}

.bg-shape-right {
  right: -120px;
  bottom: -90px;
  width: 760px;
  height: 420px;
  border-radius: 50% 50% 0 0;
  opacity: 0.35;
}

.curve-line {
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: 120px;
  height: 220px;
  border-top: 1px solid rgba(202, 210, 220, 0.7);
  border-radius: 50%;
}

.modal-card {
  position: relative;
  z-index: 2;
  width: 416px;
  background: #ffffff;
  border: 1px solid #d8dee6;
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(27, 43, 65, 0.12);
  padding: 34px 36px 36px;
}

.brand {
  text-align: center;
  font-size: 26px;
  color: #003366;
  letter-spacing: 0.3px;
  font-weight: 700;
}

.subtitle {
  margin-top: 6px;
  text-align: center;
  font-size: 13px;
  color: #71809a;
}

.form-group {
  margin-top: 30px;
}

.form-label {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #003366;
  font-weight: 700;
}

.id-row {
  display: grid;
  grid-template-columns: 1fr 56px;
  gap: 8px;
}

.input-wrap,
.select-wrap {
  position: relative;
}

.has-icon .text-input {
  padding-left: 40px;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: #6a7f99;
  font-size: 15px;
  line-height: 1;
}

.text-input,
.select-input {
  width: 100%;
  height: 48px;
  border: 1px solid #d2dae5;
  border-radius: 10px;
  background: #fff;
  font-size: 15px;
  color: #22324a;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.text-input {
  padding: 0 14px;
}

.select-input {
  padding: 0 14px;
  appearance: auto;
}

.text-input:focus,
.select-input:focus {
  border-color: #8ca6c7;
  box-shadow: 0 0 0 3px rgba(24, 93, 169, 0.08);
}

.small-btn {
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #d9e0ea;
  color: #183a68;
  font-size: 15px;
  cursor: pointer;
  font-weight: 700;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
}

.primary-btn,
.secondary-btn {
  height: 52px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  border-radius: 10px;
  background: #d9e0ea;
  color: #253e61;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.primary-btn {
  background: #003366;
  color: #fff;
}

.copyright {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 12px;
  color: #60758f;
}

.company-option {
  text-align: center;
}
</style>
