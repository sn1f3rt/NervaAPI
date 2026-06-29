<script setup lang="ts">
import BaseModal from "./ui/BaseModal.vue"
import CopyField from "./ui/CopyField.vue"

defineProps<{ open: boolean }>()
defineEmits<{ (e: "close"): void }>()

interface Coin {
  label: string
  ticker: string
  address: string
}

const coins: Coin[] = [
  {
    label: "Nerva",
    ticker: "XNV",
    address:
      "NV1PqtQwRik7FFeAJ5n7iKbHtve3nkeM99x3Q31wjBAm7twvRv6NYkbbP7vSG3n8N3fsUh2gpfZG2PRi4gYhxL4h2r2SnhUoX",
  },
  {
    label: "Monero",
    ticker: "XMR",
    address:
      "48SSQzEcvQPK7H69vUvwReFT7tCDESdRhPFGubTgJ8WeXUUPQRWjY8oZk3wHfLhsUnChJ1BYyYfoLKQh8epYsupAAWCnDKh",
  },
  {
    label: "Bitcoin",
    ticker: "BTC",
    address: "bc1qzg4jjtxq6cg22pmlaesyva64nrjzcaqud968vf",
  },
  {
    label: "Ethereum",
    ticker: "ETH",
    address: "0x97173e82df1d9Cc76946241D63A9f9231Dea1566",
  },
]

const fiat = [
  { label: "GitHub Sponsors", url: "https://github.com/sponsors/sn1f3rt" },
  { label: "Patreon", url: "https://www.patreon.com/sn1f3rt" },
  { label: "Buy Me a Coffee", url: "https://www.buymeacoffee.com/sn1f3rt" },
]
</script>

<template>
  <BaseModal :open="open" @close="$emit('close')">
    <template #title>Support <b class="grad">Nerva</b>API</template>

    <p class="mb-[18px] text-[14px] text-text-dim">
      NervaAPI is free and public, but its development and hosting are not. If you find it
      useful, please consider chipping in. Tap an address to copy it.
    </p>

    <div class="flex flex-col gap-3.5">
      <div v-for="c in coins" :key="c.ticker" class="flex flex-col gap-1.5">
        <span class="text-[13px] font-semibold text-text"
          >{{ c.label }}
          <span class="font-[family-name:var(--font-mono)] text-[10px] text-muted">{{ c.ticker }}</span></span
        >
        <CopyField :value="c.address" wrap />
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-text-dim">
      <span class="text-muted">Prefer fiat?</span>
      <a v-for="f in fiat" :key="f.url" :href="f.url" target="_blank" rel="noopener">{{ f.label }}</a>
    </div>
  </BaseModal>
</template>
