<template>
  <div class="bili">
    <header v-if="showHeader" class="bili-header">
      <h1>哔哩哔哩数据可视化大屏</h1>
      <p class="desc">为 B 站视频/直播场景定制的可视化模板，可嵌入 OBS 或浏览器源。</p>
    </header>

    <section class="grid">
      <div class="card" style="grid-column: 1 / -1;">
        <h2 class="card-title">实时互动热度</h2>
        <div ref="chartEl" class="chart"></div>
      </div>
      <div class="card">
        <h2 class="card-title">作物产量对比（Mock）</h2>
        <div ref="barEl" class="chart"></div>
      </div>
      <div class="card">
        <h2 class="card-title">直播健康度</h2>
        <div ref="gaugeEl" class="chart"></div>
      </div>
      <div class="card" style="grid-column: 1 / -1; position: relative;">
        <div class="card-head">
          <h2 class="card-title">关键词云（模拟弹幕）</h2>
          <button class="mini-fs" @click="toggleCloudFullscreen">{{ isCloudFullscreen ? '退出全屏' : '全屏' }}</button>
        </div>
        <div ref="cloudWrapEl" class="cloud-wrap">
          <button v-if="isCloudFullscreen" class="cloud-exit" @click="toggleCloudFullscreen" title="退出全屏">×</button>
          <div ref="cloudEl" class="chart"></div>
        </div>
      </div>
      <div class="card">
        <h2>互动与弹幕</h2>
        <p>当前热度峰值：<strong>{{ peakValue }}</strong></p>
        <p>过去 60s 样本：<strong>{{ dataPoints.length }}</strong></p>
      </div>
      <div class="card">
        <h2>直播/视频信息</h2>
        <p>标题：B 站可视化模板演示</p>
        <p>分区：科技·计算机技术</p>
        <p>点赞 / 投币 / 收藏（模拟）：{{ likes }} / {{ coins }} / {{ favs }}</p>
      </div>
    </section>

    <footer class="tips">
      <ul>
        <li>建议分辨率：1920x1080（可自适应其他分辨率）。</li>
        <li>OBS 场景添加“浏览器源”，指向本页面 URL。</li>
        <li>URL 参数：?theme=dark|light&header=0|1</li>
      </ul>
    </footer>
  </div>
 </template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { observeElementResize, safeResizeChart } from '@/utils/resize'
import type { Unsubscribe } from '@/utils/resize'

type ThemeMode = 'dark' | 'light'

const route = useRoute()
const themeParam = String(route.query.theme || '').toLowerCase() as ThemeMode
const headerParam = String(route.query.header || '')

const themeMode = (themeParam === 'dark' || themeParam === 'light') ? themeParam : 'dark'
const showHeader = headerParam === '' ? true : headerParam !== '0'

const chartEl = ref<HTMLDivElement | null>(null)
const barEl = ref<HTMLDivElement | null>(null)
const gaugeEl = ref<HTMLDivElement | null>(null)
const cloudEl = ref<HTMLDivElement | null>(null)
const cloudWrapEl = ref<HTMLDivElement | null>(null)
const isCloudFullscreen = ref<boolean>(false)
let chart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
let gaugeChart: echarts.ECharts | null = null
let cloudChart: echarts.ECharts | null = null
let unsub: Unsubscribe | null = null
let unsubBar: Unsubscribe | null = null
let unsubGauge: Unsubscribe | null = null
let unsubCloud: Unsubscribe | null = null
let timer: any = null
let cloudTimer: any = null

// Mock data state
const dataPoints = ref<number[]>([])
const likes = ref<number>(1200)
const coins = ref<number>(320)
const favs = ref<number>(860)

const peakValue = computed(() => dataPoints.value.reduce((m, v) => Math.max(m, v), 0))

function generateMockPoint(prev: number | null): number {
  const base = prev == null ? 50 + Math.random() * 50 : prev
  const noise = (Math.random() - 0.5) * 20
  const trend = Math.sin(Date.now() / 3000) * 5
  const next = Math.max(0, base + noise + trend)
  return Math.round(next)
}

function initMockData() {
  const arr: number[] = []
  let prev: number | null = null
  for (let i = 0; i < 60; i++) {
    const v = generateMockPoint(prev)
    arr.push(v)
    prev = v
  }
  dataPoints.value = arr
}

function getColors(mode: ThemeMode) {
  if (mode === 'light') {
    return {
      text: '#334155',
      subtext: '#64748b',
      axis: '#94a3b8',
      grid: 'rgba(148,163,184,0.2)',
      area: 'rgba(30,136,229,0.18)',
      line: '#1E88E5'
    }
  }
  return {
    text: '#cfe3ff',
    subtext: '#7aa0d6',
    axis: '#3b587a',
    grid: 'rgba(59,88,122,0.35)',
    area: 'rgba(66,214,255,0.18)',
    line: '#42d6ff'
  }
}

function setChartOption() {
  if (!chart) return
  const c = getColors(themeMode)
  const x = Array.from({ length: dataPoints.value.length }, (_, i) => `${i - dataPoints.value.length + 1}s`)
  chart.setOption({
    backgroundColor: 'transparent',
    grid: { left: 28, right: 10, top: 24, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: x,
      boundaryGap: true,
      axisLabel: { color: c.subtext },
      axisLine: { lineStyle: { color: c.axis } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: c.subtext },
      splitLine: { lineStyle: { color: c.grid } },
    },
    series: [
      {
        type: 'line',
        name: '互动热度',
        smooth: true,
        showSymbol: false,
        data: dataPoints.value,
        lineStyle: { color: c.line, width: 2 },
        areaStyle: { color: c.area },
      },
    ],
    textStyle: { color: c.text },
  })
}

function bootChart() {
  if (!chartEl.value) return
  chart = echarts.init(chartEl.value)
  setChartOption()
  unsub = observeElementResize(chartEl.value, () => safeResizeChart(chart, chartEl.value))
}

// ----- Bar chart with mock data from public/mock/yield_stats.json -----
type YieldJson = { crops: string[]; series: Array<{ crop: string; ts: number; tonnage: number }> }
async function bootBarChart() {
  if (!barEl.value) return
  const c = getColors(themeMode)
  try {
    const res = await fetch('/mock/yield_stats.json', { cache: 'no-store' })
    const data = (await res.json()) as YieldJson
    const crops = data.crops
    // Aggregate: average tonnage per crop
    const map = new Map<string, { sum: number; n: number }>()
    for (const s of data.series) {
      const m = map.get(s.crop) || { sum: 0, n: 0 }
      m.sum += s.tonnage; m.n += 1
      map.set(s.crop, m)
    }
    const values = crops.map(crop => {
      const m = map.get(crop)
      return m && m.n > 0 ? +(m.sum / m.n).toFixed(2) : 0
    })
    barChart = echarts.init(barEl.value!)
    barChart.setOption({
      backgroundColor: 'transparent',
      grid: { left: 28, right: 10, top: 24, bottom: 24 },
      xAxis: { type: 'category', data: crops, axisLabel: { color: c.subtext }, axisLine: { lineStyle: { color: c.axis } } },
      yAxis: { type: 'value', axisLabel: { color: c.subtext }, splitLine: { lineStyle: { color: c.grid } } },
      tooltip: { trigger: 'axis' },
      series: [
        { type: 'bar', name: '平均产量', data: values, itemStyle: { color: c.line }, barWidth: '50%' },
      ],
      textStyle: { color: c.text },
    })
    unsubBar = observeElementResize(barEl.value!, () => safeResizeChart(barChart, barEl.value))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load yield_stats.json', e)
  }
}

// ----- Gauge chart -----
function bootGauge() {
  if (!gaugeEl.value) return
  const c = getColors(themeMode)
  gaugeChart = echarts.init(gaugeEl.value)
  gaugeChart.setOption({
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: { lineStyle: { width: 10, color: [[1, c.line]] } },
        pointer: { show: true, width: 4 },
        progress: { show: true, width: 10 },
        detail: { valueAnimation: true, formatter: '{value}%', color: c.text, fontSize: 18 },
        title: { show: true, color: c.subtext, fontSize: 12, offsetCenter: [0, '70%'] },
        data: [{ value: 66, name: '健康度' }],
      },
    ],
    textStyle: { color: c.text },
  })
  unsubGauge = observeElementResize(gaugeEl.value, () => safeResizeChart(gaugeChart, gaugeEl.value))
}

// ----- Keyword Cloud (force-graph imitation) -----
type Keyword = { text: string; weight: number }
const keywords = ref<Keyword[]>([])
const keywordPool = [
  'ECharts','OBS','可视化','弹幕','互动','直播','数据','农业','气象','土壤','灌溉','预警','物流','高能','加油','好耶','好看','起飞','安排','牛啊','绝了','稳','冲','关注','点赞','投币','收藏','转发','一键三连'
]

function seedKeywords() {
  const map = new Map<string, number>()
  for (let i = 0; i < 30; i++) {
    const w = keywordPool[Math.floor(Math.random() * keywordPool.length)]
    map.set(w, (map.get(w) || 0) + 1)
  }
  keywords.value = Array.from(map.entries()).map(([text, n]) => ({ text, weight: n }))
}

function bootCloud() {
  if (!cloudEl.value) return
  const c = getColors(themeMode)
  cloudChart = echarts.init(cloudEl.value)
  cloudChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { formatter: (p: any) => `${p.data.name}: ${p.data.value}` },
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        force: { repulsion: 180, gravity: 0.05, edgeLength: [20, 80] },
        label: { show: true, color: c.text, fontSize: 16 },
        data: keywords.value.map(k => ({ name: k.text, value: k.weight, symbolSize: 18 + k.weight * 8, label: { fontSize: 14 + Math.min(18, k.weight * 2) }, itemStyle: { color: c.line } })),
        edges: [],
      },
    ],
    textStyle: { color: c.text },
  })
  unsubCloud = observeElementResize(cloudEl.value, () => safeResizeChart(cloudChart, cloudEl.value))
}

function startCloudTicker() {
  cloudTimer = setInterval(() => {
    // simulate stream: randomly increment some keywords and add new ones
    const add = Math.random() < 0.4
    if (add) {
      const w = keywordPool[Math.floor(Math.random() * keywordPool.length)]
      const hit = keywords.value.find(k => k.text === w)
      if (hit) hit.weight += 1; else keywords.value.push({ text: w, weight: 1 })
    } else if (keywords.value.length) {
      const idx = Math.floor(Math.random() * keywords.value.length)
      keywords.value[idx].weight += 1
    }
    if (cloudChart) {
      const c = getColors(themeMode)
      cloudChart.setOption({
        series: [{
          type: 'graph',
          layout: 'force',
          data: keywords.value.map(k => ({ name: k.text, value: k.weight, symbolSize: 18 + k.weight * 8, label: { fontSize: 14 + Math.min(18, k.weight * 2) }, itemStyle: { color: c.line } })),
        }],
      })
    }
  }, 1200)
}

function startMockTicker() {
  timer = setInterval(() => {
    const last = dataPoints.value[dataPoints.value.length - 1] ?? null
    const next = generateMockPoint(last)
    dataPoints.value.push(next)
    if (dataPoints.value.length > 60) dataPoints.value.shift()
    // randomize side stats a bit
    if (Math.random() < 0.5) likes.value += Math.floor(Math.random() * 3)
    if (Math.random() < 0.3) coins.value += Math.floor(Math.random() * 2)
    if (Math.random() < 0.2) favs.value += 1
    setChartOption()
  }, 1000)
}

onMounted(() => {
  initMockData()
  bootChart()
  bootBarChart()
  bootGauge()
  seedKeywords()
  bootCloud()
  startCloudTicker()
  startMockTicker()
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  try { if (timer) clearInterval(timer) } catch {}
  try { if (unsub) unsub() } catch {}
  try { if (unsubBar) unsubBar() } catch {}
  try { if (unsubGauge) unsubGauge() } catch {}
  try { if (unsubCloud) unsubCloud() } catch {}
  try { chart?.dispose() } catch {}
  try { barChart?.dispose() } catch {}
  try { gaugeChart?.dispose() } catch {}
  try { cloudChart?.dispose() } catch {}
  chart = null
  barChart = null
  gaugeChart = null
  cloudChart = null
  try { if (cloudTimer) clearInterval(cloudTimer) } catch {}
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

function onFullscreenChange() {
  const fsEl = document.fullscreenElement as HTMLElement | null
  const active = !!fsEl && (fsEl === cloudWrapEl.value)
  isCloudFullscreen.value = active
  // Only ensure cloud chart resizes when toggling this block
  if (cloudChart) safeResizeChart(cloudChart, cloudEl.value)
}

async function toggleCloudFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await cloudWrapEl.value?.requestFullscreen()
    } else if (document.fullscreenElement === cloudWrapEl.value) {
      await document.exitFullscreen()
    } else {
      // If another element is fullscreen, exit it first
      await document.exitFullscreen()
      await cloudWrapEl.value?.requestFullscreen()
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Cloud fullscreen toggle failed', e)
  }
}
</script>

<style scoped>
.bili { padding: 16px; color: var(--text); background: var(--bg); min-height: 100%; }
.bili-header { margin-bottom: 12px; }
.desc { color: var(--subtext); }
.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.card { background: var(--card); border: 1px solid var(--card-border); border-radius: 8px; padding: 16px; }
.card-title { margin-bottom: 8px; }
.chart { width: 100%; height: 320px; }
.tips { margin-top: 12px; color: var(--subtext); }
.card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.mini-fs { padding: 4px 8px; border: 1px solid var(--card-border); background: var(--card); color: var(--text); border-radius: 6px; cursor: pointer; }
.cloud-wrap { position: relative; width: 100%; height: 280px; }
.cloud-wrap:fullscreen { width: 100vw; height: 100vh; background: var(--bg); }
.cloud-wrap:fullscreen .chart { width: 100vw; height: 100vh; }
.cloud-exit { position: absolute; right: 12px; top: 12px; z-index: 10; width: 36px; height: 36px; border: 1px solid var(--card-border); background: var(--card); color: var(--text); border-radius: 18px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.25); font-size: 18px; line-height: 32px; }
@media (max-width: 1280px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>


