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
const methodClass = computed(() => "method-" + props.endpoint.method.toLowerCase())

const reqTitle = "<b>Request</b> &middot; example"
const respTitle = '<b>Response</b> &middot; <span style="color:var(--ok)">200</span>'
</script>

<template>
  <article v-reveal class="endpoint" :id="endpoint.id" data-spy>
    <div class="endpoint__doc">
      <div class="endpoint__sig">
        <span class="method" :class="methodClass">{{ endpoint.method }}</span>
        <span class="endpoint__path">{{ endpoint.path }}</span>
        <a class="endpoint__anchor" :href="'#' + endpoint.id" aria-label="Link to this endpoint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </a>
      </div>

      <p class="endpoint__summary">{{ endpoint.summary }}</p>
      <div class="endpoint__desc" v-html="endpoint.description" />

      <div v-if="endpoint.auth" class="callout warn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div v-html="endpoint.auth" />
      </div>

      <div class="subhead">Parameters</div>
      <p v-if="!endpoint.params.length" class="param__none">No parameters.</p>
      <ul v-else class="params">
        <li v-for="p in endpoint.params" :key="p.name" class="param">
          <div class="param__top">
            <span class="param__name">{{ p.name }}</span>
            <span class="param__type">{{ p.type }}</span>
            <span class="param__loc">{{ p.in }}</span>
            <span class="param__req" :class="p.required ? 'is-req' : 'is-opt'">
              {{ p.required ? "required" : "optional" }}
            </span>
          </div>
          <div class="param__desc" v-html="p.desc" />
        </li>
      </ul>

      <template v-if="endpoint.errors && endpoint.errors.length">
        <div class="subhead">Errors</div>
        <ul class="errors">
          <li v-for="(e, i) in endpoint.errors" :key="i">
            <span class="errcode">{{ e.code }}</span>
            <span v-html="e.reason" />
          </li>
        </ul>
      </template>
    </div>

    <div class="endpoint__code">
      <div class="codecol">
        <CodeBlock kind="req" :title-html="reqTitle" :body-html="curl.html" :copy-text="curl.text" />
        <CodeBlock
          kind="resp"
          :title-html="respTitle"
          :body-html="responseHtml"
          :copy-text="responseText"
        />
        <p v-if="endpoint.responseNote" class="respnote" v-html="endpoint.responseNote" />
      </div>
    </div>
  </article>
</template>
