<script setup lang="ts">
import { computed } from "vue";

export type FooterButton = {
  key: number;
  text: string;
};

const props = defineProps<{
  enabledKeys?: number[];
  buttons: FooterButton[];
}>();

const emit = defineEmits<{
  (e: "keyClick", key: number): void;
}>();

const enabledKeySet = computed(() => new Set(props.enabledKeys ?? []));

function onFooterButtonClicked(key: number) {
  if (!enabledKeySet.value.has(key)) return;
  emit("keyClick", key);
}
</script>

<template>
  <div class="footer-buttons">
    <div v-for="btn in buttons" :key="btn.key" class="f-item">
      <button
        class="btn-f"
        :disabled="!enabledKeySet.has(btn.key)"
        @click="onFooterButtonClicked(btn.key)"
      >
        <span class="f-key">{{ `F${btn.key}` }}</span>
        <span class="f-text">{{ btn.text }}</span>
      </button>
    </div>
  </div>
</template>

<style>
.footer-buttons {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
}

.f-item {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
}

.btn-f {
  background: #e3f0ff;
  padding: 6px 12px;
  border: 1px solid #8ab2e0;
  font-size: 14px;
  cursor: pointer;
  color: #455c99;
  font-weight: bold;
  white-space: nowrap;
  border-radius: 6px;
  width: 120px;
}

.btn-f:hover:not(:disabled) {
  background: #d4e7ff;
  border-color: #6b9dd6;
}

.btn-f:disabled {
  background: #eeeeee;
  border: 1px solid #bfbfbf;
  color: #a0a0a0;
  cursor: default;
  opacity: 1;
  box-shadow: inset 0 0 0 1px #dcdcdc;
}

.f-text {
  padding-left: 5px;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .footer-buttons {
    gap: 12px;
    padding-right: 5px;
  }
}

@media (max-width: 768px) {
  .btn-f {
    padding: 5px 10px;
    font-size: 13px;
  }

  .f-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .footer-buttons {
    justify-content: center;
    gap: 8px;
    padding-right: 0;
  }

  .btn-f {
    font-size: 12px;
    padding: 4px 8px;
  }

  .f-text {
    font-size: 10px;
  }
}
</style>
