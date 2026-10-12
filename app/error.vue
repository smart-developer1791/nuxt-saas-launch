<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Route } from '@lucide/vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const status = computed(() => props.error.statusCode || 500)
const notFound = computed(() => status.value === 404)

useLocalFonts()
useSeoMeta({
  title: () =>
    `${status.value} — ${notFound.value ? 'A little off track.' : 'A pause in the flow.'} | Relay`,
  description: 'Find your way back to Relay and keep your work moving.',
  robots: 'noindex, nofollow',
})

function returnHome() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col px-5 sm:px-8">
    <header class="mx-auto flex w-full max-w-7xl items-center justify-between py-7 sm:py-9">
      <a href="/" aria-label="Relay home" @click.prevent="returnHome"><BrandMark /></a>
      <span class="hidden font-mono text-[10px] tracking-[.14em] text-muted sm:block">
        GOOD WORK. LESS BUSYWORK.
      </span>
    </header>
    <main
      class="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 py-12 sm:py-20 lg:grid-cols-2 lg:gap-20"
      aria-labelledby="error-heading"
    >
      <div>
        <p
          class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 font-mono text-[10px] tracking-[.1em]"
        >
          <span class="size-1.5 rounded-full bg-forest" /> ERROR {{ status }}
        </p>
        <h1
          id="error-heading"
          class="mt-7 text-5xl leading-[1.06] font-semibold tracking-[-.06em] sm:text-6xl lg:text-7xl"
        >
          {{ notFound ? 'A little off track.' : 'A pause in the flow.' }}
        </h1>
        <p class="mt-7 max-w-md text-base leading-7 text-muted">
          {{
            notFound
              ? "This path doesn't lead anywhere. Let's get you back to the work that matters."
              : 'Something interrupted the workflow. Head back to Relay and try again.'
          }}
        </p>
        <a
          href="/"
          class="mt-8 inline-flex min-h-13 items-center gap-4 rounded-md bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-forest"
          @click.prevent="returnHome"
        >
          <ArrowLeft :size="17" aria-hidden="true" /> Back to Relay
        </a>
        <p class="mt-5 text-xs leading-6 text-muted">Every good workflow starts somewhere.</p>
      </div>
      <div class="relative isolate mx-auto w-full max-w-md" aria-hidden="true">
        <div class="dot-grid absolute -inset-4 -z-10 rounded-2xl opacity-70 sm:-inset-7" />
        <div
          class="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_60px_-40px_#284a3866]"
        >
          <div class="flex items-center justify-between border-b border-line px-6 py-5">
            <span class="flex items-center gap-2 text-xs font-bold"
              ><Route :size="16" /> THE WAY BACK</span
            >
            <span class="font-mono text-[9px] tracking-[.1em] text-muted">RELAY ROUTING</span>
          </div>
          <div class="relative px-6 py-10 sm:px-9 sm:py-12">
            <div class="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-4">
              <span class="grid size-9 shrink-0 place-items-center rounded-md bg-forest text-paper"
                ><Route :size="19"
              /></span>
              <div>
                <p class="text-sm font-bold">A fresh start</p>
                <p class="mt-1 text-[11px] text-muted">Your next step is right here.</p>
              </div>
            </div>
            <div class="ml-8 h-10 border-l-2 border-dashed border-line" />
            <div class="rounded-lg border border-dashed border-line px-5 py-7 text-center">
              <span class="font-mono text-6xl tracking-[-.1em] text-forest sm:text-7xl">{{
                status
              }}</span>
              <p class="mt-3 text-xs text-muted">
                {{ notFound ? 'A missing connection.' : 'A moment to reset.' }}
              </p>
            </div>
            <div class="ml-8 h-10 border-l-2 border-dashed border-line" />
            <div
              class="flex items-center justify-between rounded-lg bg-lime px-5 py-5 text-sm font-bold"
            >
              <span>Back to good work.</span><ArrowUpRight :size="18" />
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="mx-auto w-full max-w-7xl border-t border-line py-6 text-xs text-muted">
      Relay · Small automations. A calmer workday.
    </footer>
  </div>
</template>
