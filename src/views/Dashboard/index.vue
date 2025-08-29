<template>
  <div class="dashboard dashboard-root">
    <header class="header">
      <h1>智慧农业数据监控大屏</h1>
      <div class="meta">
        <span>Mock 数据</span>
        <router-link to="/">返回首页</router-link>
      </div>
    </header>
    <main class="grid">
      <CardWrapper class="area env" title="环境概览"><EnvOverview /></CardWrapper>
      <CardWrapper class="area soil" title="土壤墒情"><SoilMoisture /></CardWrapper>
      <CardWrapper class="area irr" title="灌溉设备"><Irrigation /></CardWrapper>
      <CardWrapper class="area pest" title="病虫害预警"><PestAlert /></CardWrapper>
      <CardWrapper class="area yield" title="产量统计"><Yield /></CardWrapper>
      <CardWrapper class="area logistics" title="物流统计"><Logistics /></CardWrapper>
    </main>
  </div>
  
</template>

<script setup lang="ts">
import EnvOverview from './widgets/EnvOverview.vue'
import SoilMoisture from './widgets/SoilMoisture.vue'
import Irrigation from './widgets/Irrigation.vue'
import PestAlert from './widgets/PestAlert.vue'
import Yield from './widgets/Yield.vue'
import Logistics from './widgets/Logistics.vue'
import CardWrapper from '../../components/CardWrapper.vue'
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  gap: 12px;
  max-width: 1440px;
  margin: 0 auto;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 340px 340px 340px;
  grid-template-areas:
    'env   env   env'
    'soil  irr   pest'
    'soil  yield logistics';
  gap: 12px;
}
.area.env { grid-area: env; }
.area.soil { grid-area: soil; grid-row: span 2; }
.area.irr { grid-area: irr; }
.area.pest { grid-area: pest; }
.area.yield { grid-area: yield; }
.area.logistics { grid-area: logistics; }

/* Fixed layout only; no responsive overrides */
</style>


