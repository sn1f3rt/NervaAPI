<script setup lang="ts">
import { useCopy } from "../composables/useCopy"

defineProps<{
  kind: "req" | "resp"
  titleHtml: string
  bodyHtml: string
  copyText: string
}>()

const { copied, copy } = useCopy()
</script>

<template>
  <div class="overflow-hidden rounded-card border border-border bg-surface shadow-[var(--shadow-popover)]">
    <div class="flex items-center gap-[9px] border-b border-border bg-surface-2 py-[9px] pr-[12px] pl-[14px]">
      <span class="mono text-[11.5px] text-text-dim [&_b]:font-semibold [&_b]:text-text" v-html="titleHtml" />
      <span class="flex-1" />
      <button type="button" @click="copy(copyText)"
        class="mono inline-flex cursor-pointer items-center gap-[6px] rounded-[7px] border px-[9px] py-[4px] text-[11px] transition-[color,border-color,background] [@media(pointer:coarse)]:py-[7px] [&_svg]:size-[13px]"
        :class="copied
          ? 'text-ok border-[color-mix(in_srgb,var(--ok)_45%,var(--border))] bg-surface-3'
          : 'text-text-dim border-border bg-surface-3 hover:text-text hover:border-border-2'">
        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </div>
    <pre v-html="bodyHtml"
      class="m-0 overflow-x-auto px-[16px] py-[15px] font-[family-name:var(--font-mono)] text-[12.8px] leading-[1.7] text-text"
      :class="kind === 'req' ? 'whitespace-pre-wrap break-words' : ''" />
  </div>
</template>
