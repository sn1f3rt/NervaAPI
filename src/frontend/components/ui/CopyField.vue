<script setup lang="ts">
import { useCopy } from "../../composables/useCopy"

defineProps<{
  value: string
  display?: string
  wrap?: boolean
}>()

const { copied, copy } = useCopy()
</script>

<template>
  <div
    class="flex items-center gap-2 bg-bg-2 border border-border rounded-field py-[0.35rem] pr-[0.35rem] pl-[0.7rem] font-[family-name:var(--font-mono)] text-[0.82rem]"
  >
    <span
      class="flex-1 min-w-0 text-left"
      :class="wrap ? 'whitespace-normal break-all' : 'whitespace-nowrap overflow-hidden text-ellipsis'"
      >{{ display ?? value }}</span
    >
    <button
      type="button"
      :aria-label="copied ? 'Copied' : 'Copy'"
      class="shrink-0 inline-flex items-center justify-center size-[30px] rounded-field bg-transparent cursor-pointer hover:bg-surface"
      :class="copied ? 'text-accent hover:text-accent' : 'text-text-dim hover:text-text'"
      @click="copy(value)"
    >
      <svg v-if="copied" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <svg v-else class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  </div>
</template>
