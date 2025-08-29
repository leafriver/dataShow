<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <section class="brand">
        <div class="logo-row">
          <img alt="Logo" src="/favicon.ico" width="20" height="20" />
          <strong>Dashboard Development</strong>
        </div>
        <p class="muted">© {{ year }} Smart Agriculture · 可视化监控大屏示例</p>
      </section>
      <section class="links">
        <h4>资源</h4>
        <ul>
          <li><a href="/docs/agri-smart-dashboard-dev-process.md" target="_blank" rel="noreferrer">开发流程</a></li>
          <li><a href="https://echarts.apache.org" target="_blank" rel="noreferrer">ECharts</a></li>
          <li><a href="https://vuejs.org" target="_blank" rel="noreferrer">Vue 3</a></li>
          <li><a href="https://vite.dev" target="_blank" rel="noreferrer">Vite</a></li>
        </ul>
      </section>
      <section class="contact">
        <h4>联系</h4>
        <ul>
          <li>✉︎ contact@example.com</li>
          <li>☎︎ 010-12345678</li>
        </ul>
        <div class="badges">
          <span class="badge">Mock 数据</span>
          <span class="badge">多端适配</span>
        </div>
      </section>
    </div>
  </footer>
  
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  border-top: 1px solid var(--card-border);
  background: var(--bg);
  color: var(--subtext);
}
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  padding: 16px 12px;
  max-width: 1440px;
  margin: 0 auto;
}
.brand .logo-row { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.links h4, .contact h4 { color: var(--subtext); margin: 0 0 6px 0; font-size: 14px; }
.links ul, .contact ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
a { color: var(--subtext); }
a:hover { color: var(--text); background: var(--card); border-radius: 4px; }
.muted { opacity: 0.8; }
.badges { margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
.badge { border: 1px solid var(--card-border); background: var(--card); color: var(--subtext); border-radius: 999px; padding: 2px 8px; font-size: 12px; }

@media (max-width: 768px) {
  .footer-inner { grid-template-columns: 1fr; }
}
</style>


