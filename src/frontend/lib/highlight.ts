export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

export function highlightJson(value: unknown): string {
  const json = esc(JSON.stringify(value, null, 2))
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "tok-num"
      if (/^"/.test(match)) cls = /:$/.test(match) ? "tok-key" : "tok-str"
      else if (/true|false/.test(match)) cls = "tok-bool"
      else if (/null/.test(match)) cls = "tok-null"
      return `<span class="${cls}">${match}</span>`
    },
  )
}
