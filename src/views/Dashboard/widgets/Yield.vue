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

type Item = { crop: string; ts: number; tonnage: number }

async function fetchData(): Promise<{ crops: string[]; series: Item[] }> {
  const res = await fetch('/mock/yield_stats.json')
  return res.json()
}

function render(payload: { crops: string[]; series: Item[] }) {
  if (!chart && elRef.value) chart = echarts.init(elRef.value)
  const crops = payload.crops
  const byCrop = new Map<string, Array<[number, number]>>()
  for (const c of crops) byCrop.set(c, [])
  for (const it of payload.series) {
    byCrop.get(it.crop)?.push([it.ts, it.tonnage])
  }
  const series = crops.map(crop => ({ name: crop, type: 'line', showSymbol: false, data: byCrop.get(crop) || [] }))
  chart?.setOption({
    tooltip: { trigger: 'axis' },
    legend: { top: 6, right: 8, data: crops, icon: 'roundRect', itemWidth: 14, itemHeight: 10, itemGap: 10, textStyle: { color: '#cfe3ff', fontSize: 14 } },
    grid: { left: 40, right: 40, top: 50, bottom: 50, containLabel: true },
    xAxis: { type: 'time', axisLabel: { color: '#9ecbff', fontSize: 12 } },
    yAxis: { type: 'value', axisLabel: { color: '#9ecbff', fontSize: 12 } },
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, filterMode: 'none', zoomOnMouseWheel: true, moveOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'slider', xAxisIndex: 0, height: 16, bottom: 6, brushSelect: false }
    ],
    series: series.map(s => ({ ...s, progressive: 1500, progressiveThreshold: 3000, animationDurationUpdate: 0 }))
  })
  chart?.resize()
}

function handleResize() { safeResizeChart(chart, elRef.value) }

onMounted(async () => {
  const data = await fetchData()
  requestAnimationFrame(() => setTimeout(() => render(data), 48))
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


