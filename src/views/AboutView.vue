<template>
  <div class="about">
    <section class="hero">
      <h1>关于项目</h1>
      <p>基于 Vue 3、TypeScript 与 ECharts 的智慧农业大屏，强调实时监控、模块化与多端适配。</p>
    </section>
    <section class="content card">
      <h2>模块</h2>
      <ul>
        <li>环境与气象：温湿度、风速、光照、气压</li>
        <li>土壤与地块：墒情热力、导电率</li>
        <li>灌溉设备：在线率、流量与压力</li>
        <li>病虫害预警：分级统计与时间趋势</li>
        <li>产量统计：多作物年度趋势</li>
        <li>物流与仓储：在途与到达、延误占比</li>
      </ul>
    </section>
    <section class="content card">
      <h2>技术</h2>
      <p>Vue 3 + Vite + TypeScript + ECharts 6，按需封装图表组件，统一主题与样式。</p>
    </section>
  </div>
  
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    color: var(--text);
    background: var(--bg);
    padding: 16px;
    flex-direction: column;
  }
  .hero { text-align: center; margin-bottom: 12px; }
  .content { max-width: 1440px; margin: 0 auto 12px; }
  .card { background: var(--card); border: 1px solid var(--card-border); border-radius: 8px; padding: 16px; }
}
</style>
