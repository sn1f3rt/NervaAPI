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
  <div class="code" :class="kind">
    <div class="code__bar">
      <span class="code__title" v-html="titleHtml" />
      <span class="code__spacer" />
      <button class="copy" :class="{ copied }" type="button" @click="copy(copyText)">
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
    <pre v-html="bodyHtml" />
  </div>
</template>
