<script setup lang="ts">
const apiBase = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-neutral-950 text-neutral-100">
    <div class="text-center">
      <img src="/nerva.png" alt="Nerva" class="mx-auto mb-5 h-14 w-14 rounded-xl" />
      <h1 class="text-3xl font-semibold tracking-tight">NervaAPI</h1>
      <p class="mt-2 text-neutral-400">Documentation — frontend scaffold</p>
      <p class="mt-4 font-mono text-xs text-neutral-600">API base · {{ apiBase }}</p>
    </div>
  </main>
</template>
