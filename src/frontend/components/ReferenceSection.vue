<script setup lang="ts">
import type { Section } from "../data/api-spec"
import EndpointCard from "./EndpointCard.vue"

defineProps<{ section: Section; first: boolean }>()
</script>

<template>
  <section class="section" :class="{ first }" :id="section.id">
    <div class="section__head">
      <div class="section__kicker">Reference</div>
      <h2>{{ section.name }}</h2>
      <p class="section__summary" v-html="section.summary" />
    </div>
    <EndpointCard v-for="ep in section.endpoints" :key="ep.id" :endpoint="ep" />
  </section>
</template>
