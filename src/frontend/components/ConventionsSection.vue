<script setup lang="ts">
import { highlightJson, prettyJson } from "../lib/highlight"
import CodeBlock from "./CodeBlock.vue"

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
  <section class="section" id="conventions" data-spy>
    <div class="section__head">
      <div class="section__kicker">Conventions</div>
      <h2>Response format</h2>
      <p class="section__summary">
        Every endpoint responds with JSON. Successful responses wrap their payload in a
        <code>status</code> + <code>result</code> envelope.
      </p>
    </div>

    <div class="endpoint" style="border-top: 0; padding-top: 18px">
      <div class="endpoint__doc prose">
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
        <div class="callout">
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
      <div class="endpoint__code">
        <div class="codecol">
          <CodeBlock kind="resp" :title-html="successTitle" :body-html="successHtml"
            :copy-text="successText" />
          <CodeBlock kind="resp" :title-html="errorTitle" :body-html="errorHtml"
            :copy-text="errorText" />
        </div>
      </div>
    </div>
  </section>
</template>
