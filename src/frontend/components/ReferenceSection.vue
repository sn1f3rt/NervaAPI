<script setup lang="ts">
import type { Section } from "../data/api-spec"
import EndpointCard from "./EndpointCard.vue"
import SectionHead from "./ui/SectionHead.vue"

defineProps<{ section: Section; first: boolean }>()
</script>

<template>
  <section class="pt-[30px]" :id="section.id">
    <SectionHead kicker="Reference" :title="section.name" :first="first">
      <span v-html="section.summary" />
    </SectionHead>
    <EndpointCard v-for="ep in section.endpoints" :key="ep.id" :endpoint="ep" />
  </section>
</template>
