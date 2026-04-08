<script setup lang="ts">
import Button from "primevue/button";

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <div class="footer-right">
    <Button
      label="OK(X)"
      class="action-btn primary-btn"
      @click="emit('confirm')"
    />
  </div>
</template>

<style scoped>
.footer-right {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}
</style>
