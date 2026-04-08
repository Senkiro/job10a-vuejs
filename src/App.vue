<script setup lang="ts">
import AppConfirmDialog from "@/components/dialogs/common/AppConfirmDialog.vue";
import AppMessageDialog from "@/components/dialogs/common/AppMessageDialog.vue";
</script>

<template>
  <router-view />
  <AppConfirmDialog />
  <AppMessageDialog />
</template>
