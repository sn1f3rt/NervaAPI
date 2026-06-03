import { onMounted, onUnmounted, ref } from "vue"

// Tracks which [data-spy] section is currently at the top of the viewport so the
// sidebar can highlight the matching link. Each spy target's id matches a nav link.
export function useScrollSpy() {
  const activeId = ref<string>("")
  let targets: HTMLElement[] = []
  let ticking = false

  function collect(): void {
    targets = Array.from(document.querySelectorAll<HTMLElement>("[data-spy]"))
  }

  function update(): void {
    const threshold = 120
    let found = ""
    for (const t of targets) {
      if (t.getBoundingClientRect().top - threshold <= 0) found = t.id
      else break
    }
    if (!found && targets.length) found = targets[0].id
    activeId.value = found
  }

  function onScroll(): void {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      update()
      ticking = false
    })
  }

  onMounted(() => {
    collect()
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
  })
  onUnmounted(() => window.removeEventListener("scroll", onScroll))

  return { activeId }
}
