<script setup lang="ts">
import SectionHead from "./ui/SectionHead.vue"
</script>

<template>
  <section class="pt-[30px]" id="status-codes" data-spy>
    <SectionHead kicker="Conventions" title="Status codes">Standard HTTP status codes are used throughout.</SectionHead>
    <div class="my-4 overflow-x-auto rounded-card border border-border">
      <table
        class="w-full border-collapse text-[14px] [&_th]:border-b [&_th]:border-border [&_th]:bg-surface-2 [&_th]:px-[16px] [&_th]:py-[10px] [&_th]:text-left [&_th]:font-[family-name:var(--font-mono)] [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-muted [&_td]:border-b [&_td]:border-border [&_td]:px-[16px] [&_td]:py-[10px] [&_td]:text-left [&_td]:text-text-dim [&_td:first-child]:font-[family-name:var(--font-mono)] [&_td:first-child]:w-[90px] [&_tr:last-child_td]:border-b-0">
        <thead>
          <tr>
            <th>Code</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>200</td><td>Success.</td></tr>
          <tr>
            <td>400</td>
            <td>Bad request — missing or invalid parameters, or the daemon returned an error.</td>
          </tr>
          <tr><td>404</td><td>Resource not found.</td></tr>
          <tr><td>405</td><td>Method not allowed for this endpoint.</td></tr>
          <tr><td>429</td><td>Too many requests — rate limit exceeded.</td></tr>
          <tr><td>500</td><td>Internal server error.</td></tr>
          <tr><td>504</td><td>The request to the daemon timed out.</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
