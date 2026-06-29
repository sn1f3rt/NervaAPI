<script setup lang="ts">
import { API_SPEC } from "../data/api-spec"
import { API_HOST } from "../lib/curl"

const version = API_SPEC.meta.version

// Fact-card classes kept as consts to stay DRY across the four cards.
const card =
  "relative overflow-hidden rounded-card border border-border bg-surface px-[20px] py-[18px] after:absolute after:inset-y-0 after:left-0 after:w-[3px] after:bg-[image:var(--grad)] after:opacity-80 after:content-['']"
const factKey = "mono text-[11px] uppercase tracking-[0.14em] text-text-dim"
const factVal =
  "mt-2 text-[19px] font-semibold text-text [&_small]:text-[14px] [&_small]:font-normal [&_small]:text-text-dim"
</script>

<template>
  <section class="pt-[64px] pb-[30px]" id="introduction" data-spy>
    <span
      class="rise inline-flex items-center gap-2 rounded-full border border-[var(--accent-line)] bg-[var(--accent-soft)] py-[5px] px-[13px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent"
      style="animation-delay: 0ms"
      ><span class="size-[6px] rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)] animate-[pulse_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />Public API
      &middot; <span class="normal-case">v{{ version }}</span></span
    >
    <h1 class="rise mt-5 text-[clamp(34px,5vw,52px)] font-bold leading-[1.05] tracking-[-0.02em]"
      style="animation-delay: 70ms">The Nerva <span class="grad">(XNV) Public API</span></h1>
    <p class="rise mt-4 max-w-[60ch] text-[18px] text-text-dim" style="animation-delay: 140ms">
      A lightweight REST interface to the Nerva blockchain. Query the daemon, read live market
      data and collect node analytics over plain HTTP — no keys, no SDK, just JSON.
    </p>

    <div class="rise mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4"
      style="animation-delay: 210ms">
      <div :class="card">
        <div :class="factKey">Base URL</div>
        <div class="mono mt-2 text-[15px] font-semibold tracking-[-0.01em] text-text">{{ API_HOST }}</div>
      </div>
      <div :class="card">
        <div :class="factKey">Format</div>
        <div :class="factVal">JSON <small>over HTTP</small></div>
      </div>
      <div :class="card">
        <div :class="factKey">Rate limit</div>
        <div :class="factVal">120 <small>req / min</small></div>
      </div>
      <div :class="card">
        <div :class="factKey">Auth</div>
        <div :class="factVal">None <small>public</small></div>
      </div>
    </div>
  </section>
</template>
