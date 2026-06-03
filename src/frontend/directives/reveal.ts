import type { Directive } from "vue"

function prefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

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
