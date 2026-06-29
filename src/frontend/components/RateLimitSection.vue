<script setup lang="ts">
import SectionHead from "./ui/SectionHead.vue"
</script>

<template>
  <section class="pt-[30px]" id="rate-limits" data-spy>
    <SectionHead kicker="Conventions" title="Rate limiting">
      All endpoints are limited to <strong>120 requests per minute</strong>, counted
      independently per category — daemon, market and analytics each get their own budget.
      Exceeding the limit returns <code>429</code> with
      <code>{ "error": "Too many requests" }</code>. This documentation page itself is exempt.
    </SectionHead>
  </section>
</template>
