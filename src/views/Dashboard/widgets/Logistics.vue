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

type Route = { status: 'in_transit'|'arrived'|'delayed' }

async function fetchData(): Promise<Route[]> {
  const res = await fetch('/mock/logistics.json')
  return res.json()
}

function render(routes: Route[]) {
  if (!chart && elRef.value) chart = echarts.init(elRef.value)
  const counts = routes.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: Object.keys(counts), axisLabel: { color: '#9ecbff', fontSize: 12 } },
    yAxis: { type: 'value', axisLabel: { color: '#9ecbff', fontSize: 12 } },
    series: [{ type: 'bar', data: Object.values(counts), animationDurationUpdate: 0 }]
  })
  chart?.resize()
}

function handleResize() { safeResizeChart(chart, elRef.value) }

onMounted(async () => {
  const data = await fetchData()
  requestAnimationFrame(() => setTimeout(() => render(data), 56))
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


