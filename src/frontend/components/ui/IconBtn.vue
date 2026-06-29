<script setup lang="ts">
defineProps<{ href?: string }>()

const cls =
  "inline-flex items-center justify-center gap-[7px] h-9 min-w-9 px-[10px] rounded-[9px] border border-border bg-surface text-[13px] text-text-dim cursor-pointer transition-colors hover:text-text hover:border-border-2 [&_svg]:size-4"
</script>

<template>
  <a v-if="href" :href="href" :class="cls"><slot /></a>
  <button v-else :class="cls" type="button"><slot /></button>
</template>
