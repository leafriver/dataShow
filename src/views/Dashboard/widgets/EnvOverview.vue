<template>
  <div ref="elRef" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { observeElementResize, safeResizeChart, type Unsubscribe } from '../../../utils/resize'

const elRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let unobserve: Unsubscribe | null = null
let debouncedResize: (() => void) | null = null

async function fetchData() {
  const res = await fetch('/mock/env_timeseries.json')
  return res.json() as Promise<Array<{ ts: number; temperatureC: number; humidityPct: number }>>
}

function render(data: Array<{ ts: number; temperatureC: number; humidityPct: number }>) {
  if (!chart && elRef.value) {
    chart = echarts.init(elRef.value)
  }
  const times = data.map(d => d.ts)
  const temps = data.map(d => d.temperatureC)
  const hums = data.map(d => d.humidityPct)
  chart?.setOption({
    backgroundColor: 'transparent',
    grid: { left: 40, right: 40, top: 50, bottom: 50, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: { top: 6, right: 8, icon: 'roundRect', itemWidth: 14, itemHeight: 10, itemGap: 10, textStyle: { color: '#cfe3ff', fontSize: 14 } },
    xAxis: { type: 'time', axisLabel: { color: '#9ecbff', fontSize: 12 } },
    yAxis: [
      { type: 'value', name: '°C', axisLabel: { color: '#9ecbff', fontSize: 12 } },
      { type: 'value', name: '%', axisLabel: { color: '#9ecbff', fontSize: 12 } }
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, filterMode: 'none', zoomOnMouseWheel: true, moveOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'slider', xAxisIndex: 0, height: 16, bottom: 6, brushSelect: false }
    ],
    series: [
      {
        name: '温度(°C)',
        type: 'line',
        smooth: true,
        symbol: 'none',
        progressive: 1500,
        progressiveThreshold: 3000,
        animationDurationUpdate: 0,
        data: times.map((t, i) => [t, temps[i]]),
        lineStyle: { color: '#ff875b' }
      },
      {
        name: '湿度(%)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        progressive: 1500,
        progressiveThreshold: 3000,
        animationDurationUpdate: 0,
        data: times.map((t, i) => [t, hums[i]]),
        lineStyle: { color: '#42d6ff' }
      }
    ]
  })
  chart?.resize()
}

function handleResize() {
  safeResizeChart(chart, elRef.value)
}

onMounted(async () => {
  const data = await fetchData()
  requestAnimationFrame(() => setTimeout(() => render(data), 16))
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
  chart?.dispose()
  chart = null
})
</script>

<style scoped>
.chart { width: 100%; height: 100%; min-height: 280px; }
</style>


