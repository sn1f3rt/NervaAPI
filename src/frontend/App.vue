<script setup lang="ts">
import { ref, watch } from "vue"

import AppSidebar from "./components/AppSidebar.vue"
import ConventionsSection from "./components/ConventionsSection.vue"
import HeroSection from "./components/HeroSection.vue"
import RateLimitSection from "./components/RateLimitSection.vue"
import ReferenceSection from "./components/ReferenceSection.vue"
import StatusCodesSection from "./components/StatusCodesSection.vue"
import SupportModal from "./components/SupportModal.vue"
import TheFooter from "./components/TheFooter.vue"
import TheTopbar from "./components/TheTopbar.vue"
import { useScrollProgress } from "./composables/useScrollProgress"
import { useScrollSpy } from "./composables/useScrollSpy"
import { API_SPEC } from "./data/api-spec"

const { activeId } = useScrollSpy()
const { progress, showTop } = useScrollProgress()
const navOpen = ref(false)
const supportOpen = ref(false)

watch(navOpen, (open) => {
  document.body.classList.toggle("nav-open", open)
})

function closeNav(): void {
  navOpen.value = false
}

function scrollTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" })
}
</script>

<template>
  <a href="#content"
    class="fixed left-2 top-2 z-[80] -translate-y-[160%] rounded-[9px] border border-border-2 bg-surface px-[14px] py-2 text-[13px] text-text shadow-[var(--shadow)] transition-transform focus:translate-y-0 print:hidden">Skip to content</a>
  <div class="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[image:var(--grad)] will-change-transform print:hidden"
    :style="{ transform: `scaleX(${progress})` }" />
  <div
    class="fixed inset-0 z-[35] bg-[rgba(4,6,10,0.6)] backdrop-blur-[2px] transition-opacity print:hidden"
    :class="navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    @click="closeNav" />

  <AppSidebar :active-id="activeId" :open="navOpen" @navigate="closeNav" />

  <div class="min-h-screen ml-[var(--sidebar-w)] print:ml-0">
    <TheTopbar @toggle-nav="navOpen = !navOpen" @open-support="supportOpen = true" />

    <main id="content"
      class="mx-auto max-w-[var(--content-max)] px-[clamp(20px,4vw,52px)] pb-[120px] focus:outline-none print:max-w-none print:mx-0 print:px-0"
      tabindex="-1">
      <HeroSection />
      <ConventionsSection />
      <RateLimitSection />
      <StatusCodesSection />

      <div id="reference">
        <ReferenceSection v-for="(sec, i) in API_SPEC.sections" :key="sec.id" :section="sec"
          :first="i === 0" />
      </div>
    </main>

    <TheFooter />
  </div>

  <SupportModal :open="supportOpen" @close="supportOpen = false" />

  <Transition enter-active-class="transition-[opacity,transform] duration-200"
    leave-active-class="transition-[opacity,transform] duration-200"
    enter-from-class="opacity-0 translate-y-[6px]" leave-to-class="opacity-0 translate-y-[6px]">
    <button v-if="showTop" type="button" aria-label="Back to top" @click="scrollTop"
      class="fixed bottom-[22px] right-[22px] z-[45] grid size-[42px] cursor-pointer place-items-center rounded-[12px] border border-border-2 bg-surface text-text-dim shadow-[var(--shadow)] transition-[color,border-color,transform,background] hover:-translate-y-[2px] hover:border-[var(--accent-line)] hover:text-text [&_svg]:size-[18px] print:hidden">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  </Transition>
</template>
