<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <header class="app-header">
    <div style="display:flex;gap:10px;align-items:center;">
      <img alt="Logo" src="/favicon.ico" width="20" height="20" />
      <strong>Dashboard Development</strong>
    </div>
    <nav style="display:flex;gap:8px;">
      <RouterLink to="/home" class="nav" active-class="active">Home</RouterLink>
      <RouterLink to="/dashboard" class="nav" active-class="active">Dashboard</RouterLink>
      <RouterLink to="/bilibili" class="nav" active-class="active">Bilibili</RouterLink>
      <RouterLink to="/about" class="nav" active-class="active">About</RouterLink>
    </nav>
  </header>
  <div class="page">
    <RouterView />
  </div>
  <AppFooter />
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  background: var(--bg);
  color: var(--text);
  border-bottom: 1px solid var(--card-border);
}
.page { min-height: calc(100vh - 48px); background: var(--bg); }
.nav { padding: 4px 8px; border-radius: 4px; color: var(--subtext); }
.active { background: var(--card); border: 1px solid var(--card-border); color: var(--text); }
</style>

