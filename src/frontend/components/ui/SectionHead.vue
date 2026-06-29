<script setup lang="ts">
defineProps<{ kicker: string; title: string; first?: boolean }>()
</script>

<template>
  <div class="border-t border-border pt-[26px] pb-[10px] mt-[26px]" :class="first ? 'border-t-0 mt-0' : ''">
    <div class="mono text-[11px] uppercase tracking-[0.2em] text-accent-2">{{ kicker }}</div>
    <h2 class="mt-2 text-[27px] font-bold tracking-[-0.01em]">{{ title }}</h2>
    <p class="mt-[10px] max-w-[72ch] text-text-dim"><slot /></p>
  </div>
</template>
