import { ref } from "vue"

function fallbackCopy(text: string): void {
  const ta = document.createElement("textarea")
  ta.value = text
  ta.style.position = "fixed"
  ta.style.opacity = "0"
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand("copy")
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta)
}

export function useCopy(timeout = 1500) {
  const copied = ref(false)
  let timer: number | undefined

  async function copy(text: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else fallbackCopy(text)
    } catch {
      fallbackCopy(text)
    }
    copied.value = true
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = false), timeout)
  }

  return { copied, copy }
}
