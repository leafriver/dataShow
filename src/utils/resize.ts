export type Unsubscribe = () => void

export function createDebounced<T extends (...args: any[]) => void>(fn: T, delay = 80) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

export function observeElementResize(el: Element, onResize: () => void): Unsubscribe {
  const debounced = createDebounced(onResize, 60)
  let lastW = 0
  let lastH = 0
  const ro = new ResizeObserver(entries => {
    const entry = entries[0]
    const cr = entry.contentRect
    const w = Math.round(cr.width)
    const h = Math.round(cr.height)
    if (Math.abs(w - lastW) > 1 || Math.abs(h - lastH) > 1) {
      lastW = w; lastH = h
      debounced()
    }
  })
  ro.observe(el)
  // Fallback: window resize
  const win = createDebounced(() => {
    const rect = (el as HTMLElement).getBoundingClientRect()
    const w = Math.round(rect.width)
    const h = Math.round(rect.height)
    if (Math.abs(w - lastW) > 1 || Math.abs(h - lastH) > 1) {
      lastW = w; lastH = h
      onResize()
    }
  }, 120)
  window.addEventListener('resize', win)
  return () => {
    try { ro.disconnect() } catch {}
    window.removeEventListener('resize', win)
  }
}

export function safeResizeChart(chart: { resize: (opt?: any) => void } | null, el: HTMLElement | null) {
  if (!chart || !el) return
  const rect = el.getBoundingClientRect()
  const width = Math.max(1, Math.round(rect.width))
  const height = Math.max(1, Math.round(rect.height))
  // Explicit width/height helps ECharts recalc properly after layout transitions
  chart.resize({ width, height, animation: false })
}


