import type { Endpoint } from "../data/api-spec"
import { esc } from "./highlight"

export const API_BASE: string = window.location.origin + "/v1"
export const API_HOST: string = API_BASE.replace(/^https?:\/\//, "")

export interface Snippet {
  text: string
  html: string
}

export function buildCurl(ep: Endpoint): Snippet {
  const sample = ep.sample ?? {}
  const headers = ep.headers ?? {}
  const method = ep.method
  const isBody = method === "POST" || method === "PUT" || method === "PATCH"

  const query: string[] = []
  if (!isBody) {
    for (const [k, v] of Object.entries(sample)) {
      if (Array.isArray(v)) {
        for (const item of v) query.push(`${k}=${encodeURIComponent(String(item))}`)
      } else {
        query.push(`${k}=${encodeURIComponent(String(v))}`)
      }
    }
  }
  const url = API_BASE + ep.path + (query.length ? "?" + query.join("&") : "")
  const bodyJson = isBody && Object.keys(sample).length ? JSON.stringify(sample) : null

  const lines: { t: string; h: string }[] = []

  let t = "curl"
  let h = '<span class="sh-cmd">curl</span>'
  if (method !== "GET") {
    t += ` -X ${method}`
    h += ` <span class="sh-flag">-X</span> ${method}`
  }
  t += ` "${url}"`
  h += ` <span class="sh-url">"${esc(url)}"</span>`
  lines.push({ t, h })

  for (const [k, val] of Object.entries(headers)) {
    const hv = `${k}: ${val}`
    lines.push({
      t: `-H "${hv}"`,
      h: `<span class="sh-flag">-H</span> <span class="sh-str">"${esc(hv)}"</span>`,
    })
  }
  if (bodyJson) {
    lines.push({
      t: `-H "Content-Type: application/json"`,
      h: `<span class="sh-flag">-H</span> <span class="sh-str">"Content-Type: application/json"</span>`,
    })
    lines.push({
      t: `-d '${bodyJson}'`,
      h: `<span class="sh-flag">-d</span> <span class="sh-str">'${esc(bodyJson)}'</span>`,
    })
  }

  const text = lines.map((l, i) => (i ? "  " : "") + l.t).join(" \\\n")
  const html = lines.map((l, i) => (i ? "  " : "") + l.h).join(" \\\n")
  return { text, html }
}
