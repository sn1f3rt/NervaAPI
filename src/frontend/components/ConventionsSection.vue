<script setup lang="ts">
import { highlightJson, prettyJson } from "../lib/highlight"
import CodeBlock from "./CodeBlock.vue"
import SectionHead from "./ui/SectionHead.vue"

const success = { status: "success", result: { count: 3215467, status: "OK" } }
const error = {
  status: "error",
  error: "You must provide either a block hash or a block height",
}

const successHtml = highlightJson(success)
const successText = prettyJson(success)
const errorHtml = highlightJson(error)
const errorText = prettyJson(error)

const successTitle = '<b>Success</b> &middot; <span style="color:var(--ok)">200</span>'
const errorTitle = '<b>Error</b> &middot; <span style="color:var(--err)">400</span>'
</script>

<template>
  <section class="pt-[30px]" id="conventions" data-spy>
    <SectionHead kicker="Conventions" title="Response format">
      Every endpoint responds with JSON. Successful responses wrap their payload in a
      <code>status</code> + <code>result</code> envelope.
    </SectionHead>

    <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 pt-[18px] max-[1080px]:grid-cols-1 max-[1080px]:gap-[18px]">
      <div class="min-w-0 max-w-[74ch] text-text-dim [&_h3]:mt-[26px] [&_h3]:mb-2 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-text [&_p]:mb-3 [&_a]:font-medium">
        <h3>Success</h3>
        <p>
          On success, <code>status</code> is <code>"success"</code> and the payload lives under
          <code>result</code> — an object for most endpoints, and an array for
          <a href="#analytics-fetch">/analytics/fetch</a>. Market endpoints also include an
          <code>exchange</code> label and the list of <code>pairs</code>.
        </p>
        <h3>Errors</h3>
        <p>
          Endpoint-level errors set <code>status</code> to <code>"error"</code> with a human-readable
          message. Daemon and market endpoints use an <code>error</code> field; the analytics
          endpoints use <code>message</code>.
        </p>
        <div class="mt-[18px] flex gap-3 rounded-field border border-border border-l-[3px] border-l-accent bg-surface px-[16px] py-[13px] text-[14px] text-text-dim [&_svg]:mt-[2px] [&_svg]:size-[17px] [&_svg]:flex-none [&_svg]:text-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div>
            Framework-level failures (bad routes, rate limits, timeouts) return a bare
            <code>{ "error": "…" }</code> object without a <code>status</code> field.
          </div>
        </div>
      </div>
      <div class="min-w-0">
        <div class="sticky top-[80px] flex flex-col gap-4 max-[1080px]:static">
          <CodeBlock kind="resp" :title-html="successTitle" :body-html="successHtml"
            :copy-text="successText" />
          <CodeBlock kind="resp" :title-html="errorTitle" :body-html="errorHtml"
            :copy-text="errorText" />
        </div>
      </div>
    </div>
  </section>
</template>
