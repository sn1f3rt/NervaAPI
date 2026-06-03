import { onMounted, onUnmounted, ref } from "vue"

// Reactive read-position helpers: `progress` (0..1 down the page) drives the top
// progress bar, `showTop` toggles the back-to-top button.
export function useScrollProgress(threshold = 600) {
  const progress = ref(0)
  const showTop = ref(false)
  let ticking = false

  function compute(): void {
    const el = document.documentElement
    const max = el.scrollHeight - el.clientHeight
    progress.value = max > 0 ? Math.min(1, el.scrollTop / max) : 0
    showTop.value = el.scrollTop > threshold
  }

  function onScroll(): void {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      compute()
      ticking = false
    })
  }

  onMounted(() => {
    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
  })
  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onScroll)
  })

  return { progress, showTop }
}
