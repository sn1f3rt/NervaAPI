<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue"

import { API_SPEC } from "../data/api-spec"

const props = defineProps<{ activeId: string }>()
defineEmits<{ (e: "navigate"): void }>()

interface NavLink {
  id: string
  name: string
  verb: string
}
interface NavGroup {
  id: string
  name: string
  links: NavLink[]
}

const groups: NavGroup[] = [
  {
    id: "start",
    name: "Get started",
    links: [
      { id: "introduction", name: "Introduction", verb: "" },
      { id: "conventions", name: "Response format", verb: "" },
      { id: "rate-limits", name: "Rate limiting", verb: "" },
      { id: "status-codes", name: "Status codes", verb: "" },
    ],
  },
  ...API_SPEC.sections.map((sec) => ({
    id: sec.id,
    name: sec.name,
    links: sec.endpoints.map((ep) => ({
      id: ep.id,
      name: ep.path.replace(/^\/[^/]+\//, ""),
      verb: ep.method,
    })),
  })),
]

const query = ref("")
const collapsed = reactive<Record<string, boolean>>({})
const searchEl = ref<HTMLInputElement | null>(null)
const navEl = ref<HTMLElement | null>(null)

function toggle(id: string): void {
  collapsed[id] = !collapsed[id]
}
function verbClass(verb: string): string {
  return verb ? "verb-" + verb.toLowerCase() : ""
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return groups
    .map((g) => ({
      ...g,
      links: g.links.filter((l) => !q || (l.verb + " " + l.name).toLowerCase().includes(q)),
    }))
    .filter((g) => g.links.length > 0)
})

const empty = computed(() => filtered.value.length === 0)

// Keyboard: "/" or Cmd/Ctrl+K focuses the filter; Escape clears it.
function onKey(e: KeyboardEvent): void {
  const tag = (e.target as HTMLElement | null)?.tagName
  const typing = tag === "INPUT" || tag === "TEXTAREA"
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault()
    searchEl.value?.focus()
  } else if (e.key === "/" && !typing) {
    e.preventDefault()
    searchEl.value?.focus()
  } else if (e.key === "Escape" && typing) {
    query.value = ""
    searchEl.value?.blur()
  }
}

// Keep the active link visible as the reader scrolls.
watch(
  () => props.activeId,
  async () => {
    await nextTick()
    navEl.value?.querySelector<HTMLElement>(".nav__link.active")?.scrollIntoView({ block: "nearest" })
  },
)

onMounted(() => window.addEventListener("keydown", onKey))
onUnmounted(() => window.removeEventListener("keydown", onKey))
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <img class="brand__logo" src="/nerva.png" alt="Nerva logo" />
      <div>
        <span class="brand__name">Nerva<b>API</b></span>
        <span class="brand__tag">Public &middot; v1.0.0</span>
      </div>
    </div>

    <div class="search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input ref="searchEl" v-model="query" type="text" placeholder="Filter endpoints…"
        autocomplete="off" spellcheck="false" aria-label="Filter endpoints" />
      <kbd class="search__kbd">/</kbd>
    </div>

    <nav ref="navEl" class="nav">
      <div v-for="g in filtered" :key="g.id" class="nav__group"
        :class="{ collapsed: collapsed[g.id] && !query }">
        <button class="nav__grouphead" type="button" @click="toggle(g.id)">
          <span>{{ g.name }}</span>
          <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul class="nav__list">
          <li v-for="l in g.links" :key="l.id">
            <a class="nav__link" :class="{ active: l.id === activeId }" :href="'#' + l.id"
              @click="$emit('navigate')">
              <span class="nav__verb" :class="verbClass(l.verb)">{{ l.verb }}</span>
              <span class="nav__name">{{ l.name }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div v-if="empty" class="nav__empty" style="display: block">No matching endpoints.</div>
    </nav>
  </aside>
</template>
