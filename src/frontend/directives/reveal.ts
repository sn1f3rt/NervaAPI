import type { Directive } from "vue"

function prefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// v-reveal: fades + lifts an element into view the first time it intersects the
// viewport. Honours reduced-motion by revealing immediately.
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (prefersReduced()) {
      el.classList.add("is-revealed")
      return
    }
    el.classList.add("reveal")
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed")
            obs.unobserve(el)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    )
    observer.observe(el)
  },
}
