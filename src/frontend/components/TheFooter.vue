<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <span>&copy; {{ year }} NervaAPI</span>
    <span class="sep">&middot;</span>
    <a href="https://sn1f3rt.dev" target="_blank" rel="noopener">Sayan "sn1f3rt" Bhattacharyya</a>
    <span class="sep">&middot;</span>
    <a href="https://nerva.one" target="_blank" rel="noopener">The Nerva Project</a>
    <span class="sep">&middot;</span>
    <a href="https://github.com/Sn1F3rt/NervaAPI" target="_blank" rel="noopener">Source</a>
  </footer>
</template>
