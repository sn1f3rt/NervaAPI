<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue"

import { API_SPEC } from "../data/api-spec"

const props = defineProps<{ activeId: string; open?: boolean }>()
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

// Verb → token-coloured utility class for the method tag in each nav row.
const verbColor: Record<string, string> = {
  GET: "text-[var(--get)]",
  POST: "text-[var(--post)]",
  DELETE: "text-[var(--delete)]",
  PUT: "text-[var(--put)]",
  PATCH: "text-[var(--patch)]",
}

// Nav-row classes kept as consts (NerVault pattern) so utilities like
// before:content-[''] scan cleanly without attribute-quote escaping.
const linkBase =
  "mono relative my-[1px] flex items-center gap-[9px] rounded-[7px] px-[10px] py-[5px] text-[12.5px] transition-[color,background] hover:bg-surface hover:text-text [@media(pointer:coarse)]:min-h-11"
const linkActive =
  "nav-active text-text bg-[var(--accent-soft)] before:content-[''] before:absolute before:left-[-5px] before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-[2px] before:rounded-[2px] before:bg-[image:var(--grad)]"

const version = API_SPEC.meta.version
const query = ref("")
const collapsed = reactive<Record<string, boolean>>({})
const searchEl = ref<HTMLInputElement | null>(null)
const navEl = ref<HTMLElement | null>(null)

function toggle(id: string): void {
  collapsed[id] = !collapsed[id]
}
function isCollapsed(id: string): boolean {
  return collapsed[id] && !query.value
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
    navEl.value?.querySelector<HTMLElement>(".nav-active")?.scrollIntoView({ block: "nearest" })
  },
)

onMounted(() => window.addEventListener("keydown", onKey))
onUnmounted(() => window.removeEventListener("keydown", onKey))
</script>

<template>
  <aside
    class="fixed top-0 left-0 z-40 flex h-screen w-[var(--sidebar-w)] flex-col border-r border-border bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] print:hidden max-[860px]:w-[300px] max-[860px]:transition-transform max-[860px]:duration-[250ms]"
    :class="open ? 'max-[860px]:translate-x-0' : 'max-[860px]:-translate-x-full'"
  >
    <div class="flex items-center gap-3 border-b border-border px-[22px] pt-[22px] pb-[18px]">
      <img class="size-[38px] flex-none rounded-[10px] shadow-[0_0_0_1px_var(--border-2),0_8px_20px_-10px_rgba(92,198,245,0.6)]"
        src="/nerva.png" alt="Nerva logo" />
      <div>
        <span class="mono block text-[15px] font-semibold leading-[1.15] tracking-[0.04em]">Nerva<b class="grad">API</b></span>
        <span class="mono mt-[2px] block text-[10.5px] uppercase tracking-[0.22em] text-muted">Public &middot; <span class="normal-case">v{{ version }}</span></span>
      </div>
    </div>

    <div class="relative px-4 pt-4 pb-2">
      <svg class="pointer-events-none absolute left-[27px] top-[26px] size-[14px] text-muted"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input ref="searchEl" v-model="query" type="text" placeholder="Filter endpoints…"
        autocomplete="off" spellcheck="false" aria-label="Filter endpoints"
        class="mono w-full rounded-[9px] border border-border bg-surface py-[9px] pr-[40px] pl-[32px] text-[13px] text-text outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-[var(--accent-line)] focus:shadow-[0_0_0_3px_var(--accent-soft)] focus-visible:outline-none" />
      <kbd class="mono pointer-events-none absolute right-6 top-6 rounded-[5px] border border-border bg-surface-2 px-[6px] text-[11px] leading-[1.45] text-muted">/</kbd>
    </div>

    <nav ref="navEl" class="flex-1 overflow-y-auto px-3 pt-[6px] pb-7">
      <div v-for="g in filtered" :key="g.id" class="mt-[14px]">
        <button type="button" @click="toggle(g.id)"
          class="mono flex w-full cursor-pointer items-center gap-2 rounded-[7px] border-0 bg-none px-[10px] py-[6px] text-[11px] font-semibold uppercase tracking-[0.18em] text-text-dim hover:bg-surface hover:text-text [@media(pointer:coarse)]:min-h-10">
          <span>{{ g.name }}</span>
          <svg class="ml-auto opacity-60 transition-transform" :class="{ '-rotate-90': isCollapsed(g.id) }"
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul v-show="!isCollapsed(g.id)" class="mt-1 list-none border-l border-border pl-1">
          <li v-for="l in g.links" :key="l.id">
            <a :href="'#' + l.id" @click="$emit('navigate')"
              :class="[linkBase, l.id === activeId ? linkActive : 'text-text-dim']">
              <span class="w-[30px] flex-none text-right text-[9px] font-bold tracking-[0.05em] opacity-85"
                :class="verbColor[l.verb]">{{ l.verb }}</span>
              <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ l.name }}</span>
            </a>
          </li>
        </ul>
      </div>
      <div v-if="empty" class="px-[14px] py-3 text-[13px] text-muted">No matching endpoints.</div>
    </nav>
  </aside>
</template>
