<template>
  <!-- your admin chrome here -->
  <div class="admin-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// optional admin layout logic
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
