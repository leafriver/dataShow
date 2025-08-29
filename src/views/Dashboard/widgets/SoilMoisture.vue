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

type Cell = { x: number; y: number; moisturePct: number }
type Grid = { cols: number; rows: number; cells: Array<Cell> }

async function fetchData(): Promise<Grid> {
  const res = await fetch('/mock/soil_moisture.json')
  return res.json()
}

function render(grid: Grid) {
  if (!chart && elRef.value) chart = echarts.init(elRef.value)
  const data = grid.cells.map(c => [c.x, c.y, c.moisturePct])
  chart?.setOption({
    tooltip: { trigger: 'item', formatter: (p: any) => `X ${p.value[0]} · Y ${p.value[1]}<br/>墒情: ${p.value[2]}%` },
    grid: { left: 40, right: 40, top: 74, bottom: 50, containLabel: true },
    xAxis: { type: 'category', data: Array.from({ length: grid.cols }, (_, i) => i), axisLabel: { color: '#9ecbff', fontSize: 12 }, splitArea: { show: false } },
    yAxis: { type: 'category', data: Array.from({ length: grid.rows }, (_, i) => i), axisLabel: { color: '#9ecbff', fontSize: 12 }, splitArea: { show: false } },
    visualMap: {
      min: 0,
      max: 60,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 6,
      itemWidth: 14,
      itemHeight: 10,
      textStyle: { color: '#cfe3ff', fontSize: 12 },
      inRange: { color: ['#153b6e','#1f78b4','#41b6c4','#a1dab4','#ffffcc'] }
    },
    dataZoom: [
      { type: 'inside', xAxisIndex: 0, filterMode: 'none', zoomOnMouseWheel: true, moveOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'inside', yAxisIndex: 0, filterMode: 'none' },
      { type: 'slider', xAxisIndex: 0, height: 22, top: 28, left: 40, right: 40, handleSize: 16, brushSelect: false, borderRadius: 6, handleStyle: { color: '#cfe3ff' } },
      { type: 'slider', yAxisIndex: 0, width: 14, right: 6, handleSize: 16 }
    ],
    series: [
      {
        name: '墒情(%)',
        type: 'heatmap',
        data,
        progressive: 2000,
        progressiveThreshold: 5000,
        animationDurationUpdate: 0,
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
      }
    ]
  })
  chart?.resize()
}

function handleResize() { safeResizeChart(chart, elRef.value) }

onMounted(async () => {
  const data = await fetchData()
  requestAnimationFrame(() => setTimeout(() => render(data), 24))
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
.chart { width: 100%; height: 100%; min-height: 280px; }
</style>


