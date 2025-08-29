<template>
  <div class="intro">
    <h1>智慧农业数据监控大屏</h1>
    <p class="lead">基于 Vue 3 + ECharts 的实时监控与可视化方案，覆盖环境气象、土壤墒情、灌溉设备、病虫害预警、产量与物流等核心模块，支持多端自适应展示。</p>

    <section class="grid">
      <div class="card">
        <h2>功能亮点</h2>
        <ul>
          <li>多模块展示：环境、土壤、灌溉、预警、产量、物流</li>
          <li>数据来源：支持 REST/WebSocket，内置 Mock 数据</li>
          <li>自适应布局：PC/平板/移动端响应式</li>
          <li>统一主题：深色主题、卡片容器、全屏切换</li>
        </ul>
      </div>
      <div class="card">
        <h2>技术栈</h2>
        <ul>
          <li>前端：Vue 3、TypeScript、Vite</li>
          <li>图表：ECharts 6</li>
          <li>样式：CSS 变量 + 响应式媒体查询</li>
        </ul>
      </div>
      <div class="card">
        <h2>快速开始</h2>
        <ol>
          <li>生成数据：<code>npm run mock:generate</code></li>
          <li>启动项目：<code>npm run dev</code></li>
          <li>查看大屏：点击下方按钮或访问 “Dashboard”</li>
        </ol>
      </div>
    </section>

    <div class="cta">
      <RouterLink class="btn" to="/dashboard">进入可视化大屏</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.intro { padding: 16px; color: var(--text); background: var(--bg); min-height: 100%; }
.lead { color: var(--subtext); max-width: 920px; }
.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 12px; }
.card { background: var(--card); border: 1px solid var(--card-border); border-radius: 8px; padding: 12px; }
.btn { display: inline-block; padding: 8px 14px; border: 1px solid var(--card-border); color: var(--subtext); border-radius: 6px; }
.cta { margin-top: 16px; }
@media (max-width: 1280px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>


