<template>
  <section :class="['card', { fullscreen: isFullscreen }]" ref="cardRef">
    <div class="card-header">
      <strong>{{ title }}</strong>
      <div class="card-actions">
        <button class="action-btn" @click="emit('refresh')">刷新</button>
        <button class="action-btn" @click="toggleFullscreen">{{ isFullscreen ? '退出全屏' : '全屏' }}</button>
      </div>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ title: string }>()
const emit = defineEmits<{ (e: 'refresh'): void }>()

const isFullscreen = ref(false)
const cardRef = ref<HTMLElement | null>(null)

function syncFullscreenState() {
  isFullscreen.value = document.fullscreenElement === cardRef.value
}

function triggerResize() {
  // Let ECharts and layout recalc in fullscreen transitions
  window.dispatchEvent(new Event('resize'))
  setTimeout(() => window.dispatchEvent(new Event('resize')), 60)
}

async function enterFullscreen() {
  if (cardRef.value && !document.fullscreenElement) {
    try {
      await cardRef.value.requestFullscreen()
    } catch {}
  }
}

async function exitFullscreen() {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen()
    } catch {}
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) exitFullscreen(); else enterFullscreen()
}

function onFsChange() {
  syncFullscreenState()
  // Ensure layout fully restored before final resize
  setTimeout(triggerResize, 16)
  setTimeout(triggerResize, 120)
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFsChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

<style scoped>
.card-body { padding: 8px; height: 100%; }
</style>


