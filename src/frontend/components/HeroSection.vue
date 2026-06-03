<script setup lang="ts">
import { API_HOST } from "../lib/curl"
</script>

<template>
  <section class="hero" id="introduction" data-spy>
    <span class="hero__eyebrow rise" style="animation-delay: 0ms"><span class="dot" />Public API
      &middot; v1.0.0</span>
    <h1 class="rise" style="animation-delay: 70ms">The Nerva <span class="grad">(XNV) Public
        API</span></h1>
    <p class="hero__lead rise" style="animation-delay: 140ms">
      A lightweight REST interface to the Nerva blockchain. Query the daemon, read live market
      data and collect node analytics over plain HTTP — no keys, no SDK, just JSON.
    </p>

    <div class="facts rise" style="animation-delay: 210ms">
      <div class="fact">
        <div class="fact__k">Base URL</div>
        <div class="fact__v">{{ API_HOST }}</div>
      </div>
      <div class="fact">
        <div class="fact__k">Format</div>
        <div class="fact__v">JSON <small>over HTTP</small></div>
      </div>
      <div class="fact">
        <div class="fact__k">Rate limit</div>
        <div class="fact__v">60 <small>req / min</small></div>
      </div>
      <div class="fact">
        <div class="fact__k">Auth</div>
        <div class="fact__v">None <small>public</small></div>
      </div>
    </div>
  </section>
</template>
