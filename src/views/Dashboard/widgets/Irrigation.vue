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

type Device = { id: string; status: 'online'|'offline'|'maintenance'; flowLpm: number }

async function fetchData(): Promise<Device[]> {
  const res = await fetch('/mock/irrigation_devices.json')
  return res.json()
}

function render(devices: Device[]) {
  if (!chart && elRef.value) chart = echarts.init(elRef.value)
  const statusGroups = devices.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1
    return acc
  }, {})
  const displayName = (name: string) => {
    const map: Record<string, string> = {
      online: 'Online',
      offline: 'Offline',
      maintenance: 'Maintenance',
      maintance: 'Maintenance',
    }
    return map[name] || name
  }
  const seriesData = Object.entries(statusGroups).map(([name, value]) => ({ name: displayName(name), value }))
  chart?.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: 6, right: 8, orient: 'horizontal', itemGap: 12, icon: 'roundRect', itemWidth: 16, itemHeight: 12, data: ['Online','Offline','Maintenance'], textStyle: { color: '#cfe3ff', fontSize: 15 } },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        center: ['50%', '58%'],
        radius: ['28%', '50%'],
        roseType: 'radius',
        label: { color: '#cfe3ff', fontSize: 13, formatter: '{b}: {c}' },
        labelLine: { length: 12, length2: 10 },
        data: seriesData,
        animationDurationUpdate: 0
      }
    ]
  })
  chart?.resize()
}

function handleResize() { safeResizeChart(chart, elRef.value) }

onMounted(async () => {
  const data = await fetchData()
  requestAnimationFrame(() => setTimeout(() => render(data), 32))
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


