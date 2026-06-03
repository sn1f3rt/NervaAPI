<template>
  <section class="section" id="rate-limits" data-spy>
    <div class="section__head">
      <div class="section__kicker">Conventions</div>
      <h2>Rate limiting</h2>
      <p class="section__summary">
        All endpoints are limited to <strong>120 requests per minute</strong>, counted
        independently per category — daemon, market and analytics each get their own budget.
        Exceeding the limit returns <code>429</code> with
        <code>{ "error": "Too many requests" }</code>. This documentation page itself is exempt.
      </p>
    </div>
  </section>
</template>
