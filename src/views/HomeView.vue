<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero-text">
        <h1>智慧农业数据监控大屏</h1>
        <p>面向环境、土壤、灌溉、病虫害、产量与物流的可视化监控方案，支持多端自适应与实时刷新。</p>
        <div class="actions">
          <RouterLink class="btn primary" to="/dashboard">进入大屏</RouterLink>
          <a class="btn" href="docs/agri-smart-dashboard-dev-process.md" target="_blank">查看开发流程</a>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature">
        <h3>多模块</h3>
        <p>环境、土壤、灌溉、预警、产量、物流一站式呈现。</p>
      </div>
      <div class="feature">
        <h3>实时与模拟</h3>
        <p>支持 REST/WebSocket，内置 Mock 数据快速演示。</p>
      </div>
      <div class="feature">
        <h3>多端自适应</h3>
        <p>PC/平板/移动端响应式布局与主题统一。</p>
      </div>
    </section>

    <section class="getting-started card">
      <h2>快速开始</h2>
      <ol>
        <li>生成数据：<code>npm run mock:generate</code></li>
        <li>启动项目：<code>npm run dev</code></li>
      </ol>
    </section>
  </main>
</template>

<style scoped>
.home { padding: 0; color: var(--text); background: var(--bg); }
.hero { display: flex; align-items: center; justify-content: center; min-height: 320px; background: linear-gradient(180deg, rgba(66,214,255,0.12), rgba(0,0,0,0)); border-bottom: 1px solid var(--card-border); }
.hero-text { padding: 32px 16px; text-align: center; max-width: 900px; }
.hero h1 { font-size: 32px; margin-bottom: 8px; }
.hero p { color: var(--subtext); }
.actions { margin-top: 12px; display: flex; gap: 10px; justify-content: center; }
.btn { display: inline-block; padding: 8px 14px; border: 1px solid var(--card-border); color: var(--subtext); border-radius: 6px; }
.btn.primary { color: var(--text); background: var(--card); }

.features { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; padding: 16px 16px 0; max-width: 1440px; margin: 0 auto; }
.feature { background: var(--card); border: 1px solid var(--card-border); border-radius: 8px; padding: 16px; }

.getting-started { margin: 0 auto; max-width: 1440px; }
.card { background: var(--card); border: 1px solid var(--card-border); border-radius: 8px; padding: 16px; }

.hero-text { max-width: 1440px; margin: 0 auto; }
</style>
