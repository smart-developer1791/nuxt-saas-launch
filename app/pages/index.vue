<script setup lang="ts">
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Layers,
  Plus,
  Route,
  ShieldCheck,
  Sparkles,
  Zap,
} from '@lucide/vue'
import { features, integrations, faqs, site } from '~/data/site'

const config = useRuntimeConfig()
const origin = new URL(config.public.siteUrl).origin
useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: site.title,
  ogDescription: site.description,
  ogType: 'website',
  ogUrl: origin,
  ogImage: `${origin}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Relay — Good work. Less busywork. Team workflows, connected.',
  twitterCard: 'summary_large_image',
  twitterTitle: site.title,
  twitterDescription: site.description,
  twitterImage: `${origin}/og.png`,
})
useHead({
  link: [{ rel: 'canonical', href: `${origin}/` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: site.name,
        url: `${origin}/`,
        description: site.description,
      }),
    },
  ],
})
const featureIcons = { route: Route, layers: Layers, shield: ShieldCheck }
</script>

<template>
  <div id="top">
    <a
      href="#main"
      class="sr-only z-50 rounded-md bg-ink text-sm font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-5 focus:py-3"
      >Skip to content</a
    >
    <div
      class="flex min-h-9 items-center justify-center gap-3 bg-ink px-5 py-2 text-center text-[10px] text-paper sm:text-[11px]"
    >
      <span class="rounded bg-lime px-1.5 py-0.5 font-mono text-[8px] text-ink">MEET RELAY</span
      ><span>Small automations. A calmer workday.</span
      ><a href="#workflows" class="flex items-center gap-1 font-semibold text-lime"
        >Try one <ArrowUpRight :size="12" aria-hidden="true"
      /></a>
    </div>
    <SiteHeader />
    <main id="main" tabindex="-1" class="focus:outline-none">
      <section
        aria-labelledby="hero-heading"
        class="relative isolate overflow-hidden px-5 pt-12 pb-15 sm:px-8 sm:pt-18 lg:pt-20 lg:pb-20"
      >
        <div class="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.06fr_1fr] lg:gap-16">
          <div class="relative pb-2 lg:pb-10">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 font-mono text-[9px] tracking-[.08em]"
            >
              <span class="size-1.5 rounded-full bg-forest" /> A BETTER WAY TO GET THERE
            </div>
            <h1
              id="hero-heading"
              class="mt-7 text-[clamp(3.1rem,6.7vw,5.6rem)] leading-[1.04] font-semibold tracking-[-.06em]"
            >
              Good work.<br />Less
              <span class="relative inline-block"
                >busywork.<svg
                  viewBox="0 0 400 20"
                  fill="none"
                  class="absolute -bottom-3 left-0 -z-10 h-6 w-full"
                  aria-hidden="true"
                >
                  <path d="M4 13C104 0 234 3 396 11" stroke="#d4ef86" stroke-width="15" /></svg
              ></span>
            </h1>
            <p class="mt-8 max-w-md text-[15px] leading-7 text-muted sm:text-base">
              Your team's time is too good for copy, paste, repeat. Connect your tools and let
              everyday work flow on its own.
            </p>
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#workflows"
                class="inline-flex min-h-13 items-center gap-5 rounded-md bg-ink px-5 text-xs font-bold text-white transition-colors hover:bg-forest"
                >See Relay in action <ArrowUpRight :size="17" aria-hidden="true"
              /></a>
              <a
                href="#pricing"
                class="inline-flex min-h-13 items-center gap-2 px-1 text-xs font-semibold"
                >Find your plan <ArrowRight :size="16" aria-hidden="true"
              /></a>
            </div>
            <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-muted">
              <span class="flex items-center gap-1.5"
                ><Check :size="12" class="text-forest" aria-hidden="true" /> No-code workflows</span
              ><span class="flex items-center gap-1.5"
                ><Check :size="12" class="text-forest" aria-hidden="true" /> People stay in
                control</span
              >
            </div>
            <div class="mt-13 flex items-center gap-4 border-t border-line pt-6 sm:mt-16">
              <div class="flex -space-x-2" aria-hidden="true">
                <span
                  v-for="(person, index) in ['AM', 'JL', 'SK', 'RC']"
                  :key="person"
                  class="grid size-9 place-items-center rounded-full border-2 border-paper text-[9px] font-bold"
                  :style="{ backgroundColor: ['#d7e4c4', '#e7d8c2', '#d4dce9', '#e8d9d9'][index] }"
                  >{{ person }}</span
                >
              </div>
              <div>
                <p class="text-[11px] font-bold">For teams with better things to do.</p>
                <p class="mt-1 text-[10px] text-muted">
                  From the first hello to the final handoff.
                </p>
              </div>
            </div>
          </div>
          <div class="relative mx-auto w-full max-w-xl lg:mx-0">
            <div
              class="dot-grid absolute -top-6 -right-6 -bottom-6 -left-6 -z-10 rounded-2xl opacity-70 sm:-right-9 sm:-left-9"
              aria-hidden="true"
            />
            <WorkflowDemo />
            <div
              class="absolute -right-4 -bottom-7 hidden rotate-[-4deg] items-center gap-2 rounded-md border border-[#bbd589] bg-lime px-4 py-3 shadow-md xl:flex"
            >
              <Sparkles :size="16" aria-hidden="true" /><span class="font-mono text-[10px]"
                >LESS CLICKING. MORE LIVING.</span
              >
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Connected tools"
        class="border-y border-line bg-white/50 px-5 py-8 sm:px-8"
      >
        <div class="mx-auto max-w-7xl">
          <p class="text-center font-mono text-[9px] tracking-[.13em] text-muted">
            YOUR EVERYDAY TOOLS. A BETTER WAY TOGETHER.
          </p>
          <div class="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div
              v-for="tool in integrations"
              :key="tool.name"
              class="flex items-center justify-center gap-2.5"
            >
              <span
                class="grid size-7 shrink-0 place-items-center rounded text-[15px] font-extrabold"
                :style="{ color: tool.color }"
                aria-hidden="true"
                >{{ tool.letter }}</span
              ><span class="text-sm font-bold tracking-[-.4px] text-ink/80">{{ tool.name }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="product" aria-labelledby="product-heading" class="px-5 py-20 sm:px-8 sm:py-26">
        <div class="mx-auto max-w-7xl">
          <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p class="font-mono text-[10px] tracking-[.16em] text-muted">
                THE SMALL THINGS ADD UP
              </p>
              <h2
                id="product-heading"
                class="mt-5 max-w-lg text-4xl leading-[1.12] font-semibold tracking-[-1.7px] sm:text-5xl"
              >
                Make space for<br />your best work.
              </h2>
            </div>
            <p class="max-w-sm text-sm leading-7 text-muted">
              The reminders, the follow-ups, the moving things from here to there. Relay gives the
              repetitive work a rhythm.
            </p>
          </div>
          <div class="mt-12 grid gap-5 md:grid-cols-3">
            <article
              v-for="feature in features"
              :key="feature.number"
              class="rounded-xl border border-line bg-white p-6 sm:p-7"
            >
              <div class="flex items-center justify-between">
                <span class="grid size-11 place-items-center rounded-lg bg-paper"
                  ><component
                    :is="featureIcons[feature.icon as keyof typeof featureIcons]"
                    :size="21"
                    :stroke-width="1.6"
                    aria-hidden="true" /></span
                ><span class="font-mono text-[10px] text-muted">{{ feature.number }} /</span>
              </div>
              <h3 class="mt-7 text-lg font-bold tracking-[-.5px]">{{ feature.title }}</h3>
              <p class="mt-3 text-xs leading-6 text-muted">{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="process-heading"
        class="border-y border-line bg-[#e9eedf] px-5 py-16 sm:px-8 sm:py-20"
      >
        <div
          class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-20"
        >
          <div>
            <p class="font-mono text-[10px] tracking-[.16em] text-muted">FROM IF TO DONE</p>
            <h2
              id="process-heading"
              class="mt-5 max-w-md text-4xl leading-[1.12] font-semibold tracking-[-1.7px] sm:text-5xl"
            >
              Set it up.<br />Let it flow.
            </h2>
            <p class="mt-5 max-w-sm text-sm leading-7 text-muted">
              A good workflow starts with one simple question: what should happen next?
            </p>
            <a
              href="#workflows"
              class="mt-7 inline-flex min-h-11 items-center gap-3 text-xs font-bold"
              >Try an example <ArrowUpRight :size="17" aria-hidden="true"
            /></a>
          </div>
          <div class="rounded-xl border border-[#c7d2ba] bg-paper p-6 sm:p-8">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] text-muted">THE RELAY RECIPE</span
              ><span
                class="rounded-full border border-line px-2 py-1 font-mono text-[9px] text-muted"
                >3 INGREDIENTS</span
              >
            </div>
            <ol class="mt-7 space-y-6">
              <li
                v-for="(step, index) in [
                  {
                    title: 'Start with a moment',
                    text: 'A form is filled. A task is finished. Something is ready.',
                    icon: Zap,
                  },
                  {
                    title: 'Connect the next steps',
                    text: 'Create a project. Send a note. Ask for an approval.',
                    icon: Route,
                  },
                  {
                    title: 'Give it a little oversight',
                    text: 'Review each run and keep the human decisions human.',
                    icon: CircleCheck,
                  },
                ]"
                :key="step.title"
                class="flex items-start gap-4"
              >
                <span
                  class="grid size-11 shrink-0 place-items-center rounded-lg"
                  :class="index === 2 ? 'bg-ink text-lime' : 'border border-line bg-white'"
                  ><component :is="step.icon" :size="18" aria-hidden="true"
                /></span>
                <div class="min-w-0 pt-1">
                  <h3 class="text-sm font-bold">{{ step.title }}</h3>
                  <p class="mt-1.5 text-xs leading-6 text-muted">{{ step.text }}</p>
                </div>
                <span class="ml-auto pt-1 font-mono text-[10px] text-muted">0{{ index + 1 }}</span>
              </li>
            </ol>
            <div
              class="mt-7 flex items-center gap-2 rounded-md border border-[#c5d69d] bg-[#e5f0ca] px-3 py-3 text-[11px] text-forest"
            >
              <Check :size="15" class="shrink-0" aria-hidden="true" /> A repeatable process. A
              little more breathing room.
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="integrations-heading" class="px-5 py-20 sm:px-8 sm:py-24">
        <div class="mx-auto max-w-7xl">
          <div class="text-center">
            <p class="font-mono text-[10px] tracking-[.16em] text-muted">KEEP YOUR TOOLBELT</p>
            <h2
              id="integrations-heading"
              class="mt-5 text-4xl leading-[1.12] font-semibold tracking-[-1.7px] sm:text-5xl"
            >
              Everything, in the loop.
            </h2>
            <p class="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted">
              Your team already has its favorite tools. Let them share the context, so you can focus
              on the conversation.
            </p>
          </div>
          <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="tool in integrations"
              :key="tool.name"
              class="flex items-center gap-4 rounded-lg border border-line bg-white px-5 py-5"
            >
              <span
                class="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-paper text-xl font-bold"
                :style="{ color: tool.color }"
                aria-hidden="true"
                >{{ tool.letter }}</span
              >
              <div>
                <h3 class="text-sm font-bold">{{ tool.name }}</h3>
                <p class="mt-1 text-[11px] text-muted">{{ tool.purpose }}</p>
              </div>
            </div>
          </div>
          <p class="mt-5 text-center text-[10px] text-muted">
            Illustrative connections in this preview.
          </p>
        </div>
      </section>

      <PricingSection />

      <section id="faq" aria-labelledby="faq-heading" class="px-5 py-20 sm:px-8 sm:py-24">
        <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div>
            <p class="font-mono text-[10px] tracking-[.16em] text-muted">A FEW GOOD QUESTIONS</p>
            <h2
              id="faq-heading"
              class="mt-5 text-4xl leading-[1.12] font-semibold tracking-[-1.7px] sm:text-5xl"
            >
              Clear things up.
            </h2>
            <p class="mt-5 max-w-xs text-sm leading-7 text-muted">
              A little context before you find your flow.
            </p>
            <ArrowDownRight
              :size="55"
              :stroke-width="1"
              class="mt-8 hidden text-forest lg:block"
              aria-hidden="true"
            />
          </div>
          <div class="border-t border-line">
            <details v-for="item in faqs" :key="item.question" class="border-b border-line">
              <summary
                class="flex min-h-18 items-center justify-between gap-5 py-5 text-sm font-bold"
              >
                <span>{{ item.question }}</span
                ><Plus
                  :size="18"
                  class="faq-plus shrink-0 text-muted transition-transform"
                  aria-hidden="true"
                />
              </summary>
              <p class="max-w-xl pr-7 pb-6 text-xs leading-7 text-muted">{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section aria-labelledby="closing-heading" class="px-5 pb-16 sm:px-8 sm:pb-20">
        <div
          class="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-xl bg-ink px-7 py-12 text-paper sm:px-12 sm:py-16 lg:flex-row lg:items-center"
        >
          <div class="relative z-10">
            <p class="font-mono text-[10px] tracking-[.13em] text-[#c1d0b7]">
              YOUR TIME IS THE GOOD STUFF
            </p>
            <h2
              id="closing-heading"
              class="mt-5 text-4xl leading-[1.12] font-semibold tracking-[-1.7px] sm:text-5xl"
            >
              A little less busy.<br />A lot more possible.
            </h2>
          </div>
          <div class="relative z-10">
            <a
              href="#workflows"
              class="inline-flex min-h-13 items-center gap-8 rounded-md bg-lime px-5 text-xs font-bold text-ink hover:bg-[#c6e672]"
              >Find your flow <ArrowUpRight :size="18" aria-hidden="true"
            /></a>
            <p class="mt-4 text-[10px] text-[#c1d0b7]">Start with one small workflow.</p>
          </div>
          <svg
            viewBox="0 0 400 300"
            class="pointer-events-none absolute -top-8 right-0 h-85 w-100 text-white/5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M30 20H250L370 140H150L30 20ZM30 130H250L370 250H150L30 130Z"
              stroke="currentColor"
              stroke-width="28"
            />
          </svg>
        </div>
      </section>
    </main>
    <footer class="border-t border-line px-5 py-9 sm:px-8">
      <div
        class="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-center"
      >
        <div>
          <a href="#top" aria-label="Back to Relay home"><BrandMark /></a>
          <p class="mt-2 text-[10px] text-muted">Good work. Less busywork.</p>
        </div>
        <nav aria-label="Footer navigation" class="flex flex-wrap gap-5 text-[11px] font-semibold">
          <a v-for="link in site.navigation" :key="link.href" :href="link.href">{{ link.label }}</a>
        </nav>
        <p class="text-[10px] text-muted">© 2026 Relay · Concept preview</p>
      </div>
    </footer>
  </div>
</template>
