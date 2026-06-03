<script setup lang="ts">
import { ref, watch } from "vue"

import AppSidebar from "./components/AppSidebar.vue"
import ConventionsSection from "./components/ConventionsSection.vue"
import HeroSection from "./components/HeroSection.vue"
import RateLimitSection from "./components/RateLimitSection.vue"
import ReferenceSection from "./components/ReferenceSection.vue"
import StatusCodesSection from "./components/StatusCodesSection.vue"
import TheFooter from "./components/TheFooter.vue"
import TheTopbar from "./components/TheTopbar.vue"
import { useScrollProgress } from "./composables/useScrollProgress"
import { useScrollSpy } from "./composables/useScrollSpy"
import { API_SPEC } from "./data/api-spec"

const { activeId } = useScrollSpy()
const { progress, showTop } = useScrollProgress()
const navOpen = ref(false)

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
  <div class="progress" :style="{ transform: `scaleX(${progress})` }" />
  <div class="backdrop" @click="closeNav" />

  <AppSidebar :active-id="activeId" @navigate="closeNav" />

  <div class="shell">
    <TheTopbar @toggle-nav="navOpen = !navOpen" />

    <main class="content">
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

  <Transition name="fade">
    <button v-if="showTop" class="to-top" type="button" aria-label="Back to top" @click="scrollTop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  </Transition>
</template>
