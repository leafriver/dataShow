<template>
  <div ref="elRef" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { observeElementResize, safeResizeChart, type Unsubscribe } from '../../../utils/resize'

const elRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let debouncedResize: (() => void) | null = null
let unobserve: Unsubscribe | null = null

type Alert = { ts: number; level: 'info'|'warning'|'critical' }

async function fetchData(): Promise<Alert[]> {
  const res = await fetch('/mock/pest_alerts.json')
  return res.json()
}

function render(alerts: Alert[]) {
  if (!chart && elRef.value) chart = echarts.init(elRef.value)
  const day = 24 * 3600 * 1000
  const buckets = new Map<number, { info: number; warning: number; critical: number }>()
  for (const a of alerts) {
    const key = Math.floor(a.ts / day) * day
    if (!buckets.has(key)) buckets.set(key, { info: 0, warning: 0, critical: 0 })
    buckets.get(key)![a.level]++
  }
  const keys = Array.from(buckets.keys()).sort((a, b) => a - b)
  const info = keys.map(k => buckets.get(k)!.info)
  const warning = keys.map(k => buckets.get(k)!.warning)
  const critical = keys.map(k => buckets.get(k)!.critical)
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { top: 6, right: 8, data: ['info','warning','critical'], icon: 'roundRect', itemWidth: 14, itemHeight: 10, itemGap: 10, textStyle: { color: '#cfe3ff', fontSize: 14 } },
    grid: { left: 40, right: 20, top: 50, bottom: 30, containLabel: true },
    xAxis: { type: 'time', axisLabel: { color: '#9ecbff', fontSize: 12 } },
    yAxis: { type: 'value', axisLabel: { color: '#9ecbff', fontSize: 12 } },
    series: [
      { name: 'info', type: 'bar', stack: 'total', data: keys.map((k, i) => [k, info[i]]), animationDurationUpdate: 0 },
      { name: 'warning', type: 'bar', stack: 'total', data: keys.map((k, i) => [k, warning[i]]), animationDurationUpdate: 0 },
      { name: 'critical', type: 'bar', stack: 'total', data: keys.map((k, i) => [k, critical[i]]), animationDurationUpdate: 0 }
    ]
  })
  chart?.resize()
}

function handleResize() { safeResizeChart(chart, elRef.value) }

onMounted(async () => {
  const data = await fetchData()
  requestAnimationFrame(() => setTimeout(() => render(data), 40))
  if (elRef.value) unobserve = observeElementResize(elRef.value, handleResize)
  
  // Debounced window resize
  let resizeTimer: number | null = null
  debouncedResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(handleResize, 220)
  }
  window.addEventListener('resize', debouncedResize)
})

onBeforeUnmount(() => {
  if (unobserve) { unobserve(); unobserve = null }
  if (debouncedResize) window.removeEventListener('resize', debouncedResize)
  chart?.dispose(); chart = null
})
</script>

<style scoped>
.chart { width: 100%; height: 100%; min-height: 260px; }
</style>


