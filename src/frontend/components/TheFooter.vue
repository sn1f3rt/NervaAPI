<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="ml-[var(--sidebar-w)] print:ml-0 flex flex-wrap items-center gap-x-[18px] gap-y-[6px] border-t border-border px-[clamp(20px,4vw,52px)] py-[26px] text-[13.5px] text-muted"
  >
    <span
      >&copy; {{ year }}
      <a class="text-text-dim hover:text-text" href="https://sn1f3rt.dev" target="_blank" rel="noopener"
        >Sayan "sn1f3rt" Bhattacharyya</a
      ></span
    >
    <span class="opacity-40">&middot;</span>
    <a class="text-text-dim hover:text-text" href="https://nerva.one" target="_blank" rel="noopener"
      >The Nerva Project</a
    >
  </footer>
</template>
