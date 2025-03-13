<script setup lang="ts">
import AppLayout from './components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
}
</style>
