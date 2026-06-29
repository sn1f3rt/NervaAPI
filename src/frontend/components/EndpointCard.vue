<script setup lang="ts">
import { computed } from "vue"

import type { Endpoint } from "../data/api-spec"
import { buildCurl } from "../lib/curl"
import { highlightJson, prettyJson } from "../lib/highlight"
import CodeBlock from "./CodeBlock.vue"

const props = defineProps<{ endpoint: Endpoint }>()

const curl = computed(() => buildCurl(props.endpoint))
const responseHtml = computed(() => highlightJson(props.endpoint.response))
const responseText = computed(() => prettyJson(props.endpoint.response))

// HTTP method → token-coloured badge utilities.
const methodBadge: Record<string, string> = {
  GET: "text-[var(--get)] bg-[color-mix(in_srgb,var(--get)_15%,transparent)]",
  POST: "text-[var(--post)] bg-[color-mix(in_srgb,var(--post)_15%,transparent)]",
  DELETE: "text-[var(--delete)] bg-[color-mix(in_srgb,var(--delete)_15%,transparent)]",
  PUT: "text-[var(--put)] bg-[color-mix(in_srgb,var(--put)_15%,transparent)]",
  PATCH: "text-[var(--patch)] bg-[color-mix(in_srgb,var(--patch)_15%,transparent)]",
}

const reqTitle = "<b>Request</b> &middot; example"
const respTitle = '<b>Response</b> &middot; <span style="color:var(--ok)">200</span>'
</script>

<template>
  <article v-reveal :id="endpoint.id" data-spy
    class="group grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 border-t border-border py-[34px] scroll-mt-[84px] max-[1080px]:grid-cols-1 max-[1080px]:gap-[18px] print:grid-cols-1 print:gap-[14px] print:py-[18px] print:[break-inside:avoid]">
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-[11px]">
        <span class="mono flex-none rounded-[6px] px-[9px] py-[4px] text-[11px] font-bold tracking-[0.06em]"
          :class="methodBadge[endpoint.method]">{{ endpoint.method }}</span>
        <span class="mono break-all text-[15px] text-text">{{ endpoint.path }}</span>
        <a :href="'#' + endpoint.id" aria-label="Link to this endpoint"
          class="text-[15px] text-muted opacity-0 transition-[opacity,color] hover:text-accent group-hover:opacity-100 [&_svg]:size-[15px]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </a>
      </div>

      <p class="mt-[14px] mb-1 font-medium text-text">{{ endpoint.summary }}</p>
      <div class="text-[14.5px] text-text-dim" v-html="endpoint.description" />

      <div v-if="endpoint.auth"
        class="my-[18px] flex gap-3 rounded-field border border-border border-l-[3px] border-l-[var(--warn)] bg-surface px-[16px] py-[13px] text-[14px] text-text-dim [&_svg]:mt-[2px] [&_svg]:size-[17px] [&_svg]:flex-none [&_svg]:text-[var(--warn)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div v-html="endpoint.auth" />
      </div>

      <div class="mono mt-[24px] mb-[10px] text-[11px] uppercase tracking-[0.16em] text-muted">Parameters</div>
      <p v-if="!endpoint.params.length" class="text-[14px] italic text-muted">No parameters.</p>
      <ul v-else class="m-0 list-none p-0">
        <li v-for="p in endpoint.params" :key="p.name"
          class="border-t border-border py-[12px] first:border-t-0 first:pt-1">
          <div class="flex flex-wrap items-baseline gap-[9px]">
            <span class="mono text-[13.5px] text-text">{{ p.name }}</span>
            <span class="mono text-[12px] text-accent">{{ p.type }}</span>
            <span class="mono rounded-[5px] border border-border px-[6px] py-px text-[10px] uppercase tracking-[0.08em] text-muted">{{ p.in }}</span>
            <span class="text-[10.5px] font-semibold uppercase tracking-[0.08em]"
              :class="p.required ? 'text-[var(--err)]' : 'text-muted'">
              {{ p.required ? "required" : "optional" }}
            </span>
          </div>
          <div class="mt-1 text-[13.5px] text-text-dim" v-html="p.desc" />
        </li>
      </ul>

      <template v-if="endpoint.errors && endpoint.errors.length">
        <div class="mono mt-[24px] mb-[10px] text-[11px] uppercase tracking-[0.16em] text-muted">Errors</div>
        <ul class="m-0 list-none p-0">
          <li v-for="(e, i) in endpoint.errors" :key="i"
            class="flex items-baseline gap-[11px] border-t border-border py-2 text-[13.5px] text-text-dim first:border-t-0">
            <span class="mono flex-none rounded-[5px] bg-[color-mix(in_srgb,var(--err)_14%,transparent)] px-[7px] py-[2px] text-[11px] font-bold text-[var(--err)]">{{ e.code }}</span>
            <span v-html="e.reason" />
          </li>
        </ul>
      </template>
    </div>

    <div class="min-w-0">
      <div class="sticky top-[80px] flex flex-col gap-4 max-[1080px]:static print:static">
        <CodeBlock kind="req" :title-html="reqTitle" :body-html="curl.html" :copy-text="curl.text" />
        <CodeBlock
          kind="resp"
          :title-html="respTitle"
          :body-html="responseHtml"
          :copy-text="responseText"
        />
        <p v-if="endpoint.responseNote" class="mx-[2px] mt-[-4px] text-[13px] text-text-dim"
          v-html="endpoint.responseNote" />
      </div>
    </div>
  </article>
</template>
