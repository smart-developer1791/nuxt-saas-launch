<script setup lang="ts">
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  SlidersHorizontal,
  Sparkles,
  X,
} from '@lucide/vue'
import { plans } from '~/data/plans'
import {
  estimatePlan,
  formatMoney,
  recommendPlan,
  type BillingCycle,
  type Plan,
  type Quote,
} from '~/domain/pricing'

const cycle = ref<BillingCycle>('annual')
const seats = ref(15)
const runs = ref(3000)
const selectedPlanId = ref('team')
const selectedPlan = computed(() => plans.find((plan) => plan.id === selectedPlanId.value)!)
const quote = computed(() => estimatePlan(selectedPlan.value, seats.value, runs.value, cycle.value))
const recommended = computed(() => recommendPlan(plans, seats.value, runs.value, cycle.value))
const dialog = ref<HTMLDialogElement>()
const brief = ref<{ plan: Plan; quote: Quote }>()
const downloadStatus = ref('')

function baseQuote(plan: Plan) {
  return estimatePlan(plan, plan.includedSeats, plan.includedRuns, cycle.value)
}
async function openBrief(plan: Plan, estimate: Quote) {
  brief.value = { plan, quote: { ...estimate } }
  downloadStatus.value = ''
  await nextTick()
  dialog.value?.showModal()
}
function downloadBrief() {
  if (!brief.value) return
  const file = {
    product: 'Relay',
    version: 1,
    currency: 'USD',
    estimateOnly: true,
    plan: brief.value.plan.name,
    ...brief.value.quote,
    features: brief.value.plan.features,
  }
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = `relay-${brief.value.plan.id}-plan.json`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  downloadStatus.value = 'Your plan brief has been downloaded.'
}
</script>

<template>
  <section
    id="pricing"
    aria-labelledby="pricing-heading"
    class="border-t border-line bg-[#eff2e8] px-5 py-20 sm:px-8 sm:py-26"
  >
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p class="font-mono text-[10px] tracking-[.16em] text-muted">
            A LITTLE INVESTMENT. A LOT OF ROOM.
          </p>
          <h2
            id="pricing-heading"
            class="mt-5 max-w-xl text-4xl leading-[1.12] font-semibold tracking-[-1.7px] sm:text-5xl"
          >
            A plan for your<br />next good chapter.
          </h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-muted">
            Start small or bring the whole team. Every plan includes unlimited workflows and room to
            grow.
          </p>
        </div>
        <div
          class="flex w-fit items-center gap-1 rounded-lg border border-line bg-white p-1"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            class="min-h-11 rounded-md px-4 text-xs font-bold transition-colors"
            :class="cycle === 'monthly' ? 'bg-ink text-white' : 'text-muted hover:bg-paper'"
            :aria-pressed="cycle === 'monthly'"
            @click="cycle = 'monthly'"
          >
            Monthly
          </button>
          <button
            type="button"
            class="flex min-h-11 items-center gap-3 rounded-md px-4 text-xs font-bold transition-colors"
            :class="cycle === 'annual' ? 'bg-ink text-white' : 'text-muted hover:bg-paper'"
            :aria-pressed="cycle === 'annual'"
            @click="cycle = 'annual'"
          >
            Yearly <span class="rounded bg-lime px-1.5 py-1 text-[9px] text-ink">SAVE 20%</span>
          </button>
        </div>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <article
          v-for="plan in plans"
          :key="plan.id"
          class="relative flex flex-col rounded-xl border p-6 sm:p-7"
          :class="plan.featured ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink'"
        >
          <div class="flex min-h-7 items-center justify-between gap-2">
            <h3 class="text-lg font-bold">{{ plan.name }}</h3>
            <span
              v-if="plan.featured"
              class="rounded bg-lime px-2 py-1 font-mono text-[9px] text-ink"
              >THE TEAM FAVORITE</span
            >
          </div>
          <p
            class="mt-3 min-h-10 text-xs leading-5"
            :class="plan.featured ? 'text-[#d2dccd]' : 'text-muted'"
          >
            {{ plan.description }}
          </p>
          <div class="mt-6 flex min-h-14 items-baseline gap-2">
            <span class="text-[42px] leading-none font-semibold tracking-[-2px]">{{
              formatMoney(baseQuote(plan).monthlyCents)
            }}</span
            ><span class="text-xs" :class="plan.featured ? 'text-[#d2dccd]' : 'text-muted'"
              >/ month</span
            >
          </div>
          <p
            class="mt-2 min-h-5 text-[10px]"
            :class="plan.featured ? 'text-[#d2dccd]' : 'text-muted'"
          >
            {{
              cycle === 'annual'
                ? `${formatMoney(baseQuote(plan).billedCents)} billed yearly`
                : 'Billed monthly'
            }}
          </p>
          <button
            type="button"
            class="mt-7 flex min-h-12 items-center justify-between rounded-md px-4 text-xs font-bold transition-colors"
            :class="
              plan.featured
                ? 'bg-lime text-ink hover:bg-[#c6e672]'
                : 'border border-line hover:bg-paper'
            "
            @click="openBrief(plan, baseQuote(plan))"
          >
            Explore {{ plan.name }} <ArrowUpRight :size="16" aria-hidden="true" />
          </button>
          <div class="my-6 border-t" :class="plan.featured ? 'border-white/15' : 'border-line'" />
          <p class="text-xs font-bold">
            {{ plan.includedSeats }} people · {{ plan.includedRuns.toLocaleString('en-US') }} runs /
            month
          </p>
          <ul
            class="mt-5 space-y-3.5 text-xs"
            :class="plan.featured ? 'text-[#e0e8db]' : 'text-muted'"
          >
            <li v-for="feature in plan.features" :key="feature" class="flex gap-2.5">
              <Check
                :size="14"
                class="shrink-0"
                :class="plan.featured ? 'text-lime' : 'text-forest'"
                aria-hidden="true"
              />{{ feature }}
            </li>
          </ul>
        </article>
      </div>

      <div
        id="calculator"
        class="mt-8 overflow-hidden rounded-xl border border-line bg-white lg:grid lg:grid-cols-[1.25fr_1fr]"
      >
        <div class="p-6 sm:p-8">
          <div class="flex items-center gap-2 text-xs font-bold">
            <SlidersHorizontal :size="16" aria-hidden="true" /> MAKE IT YOURS
          </div>
          <h3 class="mt-4 text-2xl font-semibold tracking-[-.7px]">What does your team need?</h3>
          <p class="mt-2 max-w-md text-xs leading-6 text-muted">
            A clear estimate, including additional people and runs. Adjust the sliders to find your
            fit.
          </p>
          <div class="mt-7 grid gap-7 sm:grid-cols-2">
            <div>
              <label for="team-size" class="flex items-center justify-between text-xs font-semibold"
                >Team size
                <output for="team-size" class="rounded border border-line px-2 py-1 font-mono"
                  >{{ seats }} people</output
                ></label
              ><input
                id="team-size"
                v-model.number="seats"
                type="range"
                min="1"
                max="100"
                step="1"
                class="mt-5 block h-6 w-full"
              />
              <div class="mt-2 flex justify-between font-mono text-[9px] text-muted">
                <span>1 PERSON</span><span>100 PEOPLE</span>
              </div>
            </div>
            <div>
              <label
                for="monthly-runs"
                class="flex items-center justify-between text-xs font-semibold"
                >Monthly runs
                <output for="monthly-runs" class="rounded border border-line px-2 py-1 font-mono">{{
                  runs.toLocaleString('en-US')
                }}</output></label
              ><input
                id="monthly-runs"
                v-model.number="runs"
                type="range"
                min="0"
                max="50000"
                step="500"
                class="mt-5 block h-6 w-full"
              />
              <div class="mt-2 flex justify-between font-mono text-[9px] text-muted">
                <span>0 RUNS</span><span>50,000 RUNS</span>
              </div>
            </div>
          </div>
          <div
            class="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
          >
            <label for="calculator-plan" class="text-xs font-semibold">Compare a plan</label>
            <select
              id="calculator-plan"
              v-model="selectedPlanId"
              class="min-h-11 rounded-md border border-line bg-paper px-3 text-xs font-bold"
            >
              <option v-for="plan in plans" :key="plan.id" :value="plan.id">{{ plan.name }}</option>
            </select>
          </div>
          <button
            type="button"
            class="mt-4 flex min-h-11 w-full items-center justify-between gap-3 rounded-md bg-paper px-3 text-left text-[11px] text-muted"
            @click="selectedPlanId = recommended.id"
          >
            <span class="flex items-center gap-2"
              ><Sparkles :size="14" class="shrink-0 text-forest" aria-hidden="true" /><span
                >Lowest estimate: <strong class="text-ink">{{ recommended.name }}</strong></span
              ></span
            ><span class="shrink-0 text-ink">{{
              selectedPlanId === recommended.id ? 'Selected' : 'Use this plan →'
            }}</span>
          </button>
          <p class="mt-2 text-[10px] leading-5 text-muted">
            Based on seats and runs. Compare the included features above.
          </p>
        </div>
        <div
          class="border-t border-line bg-paper p-6 sm:p-8 lg:border-t-0 lg:border-l"
          aria-live="polite"
          aria-atomic="true"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="font-mono text-[10px] tracking-wider text-muted">
              YOUR {{ selectedPlan.name.toUpperCase() }} ESTIMATE
            </p>
            <span class="text-[10px] text-muted">USD</span>
          </div>
          <p class="mt-5 flex items-baseline gap-2">
            <strong
              data-testid="calculator-total"
              class="text-5xl leading-none font-semibold tracking-[-2px]"
              >{{ formatMoney(quote.monthlyCents) }}</strong
            ><span class="text-xs text-muted">/ month</span>
          </p>
          <dl class="mt-7 space-y-3 text-[11px]">
            <div class="flex justify-between gap-3">
              <dt class="text-muted">{{ selectedPlan.name }} base plan</dt>
              <dd>{{ formatMoney(quote.baseCents) }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-muted">{{ quote.additionalSeats }} additional people</dt>
              <dd>{{ formatMoney(quote.seatsCents) }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-muted">{{ quote.additionalRunBlocks }} extra blocks of 1,000 runs</dt>
              <dd>{{ formatMoney(quote.runsCents) }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt class="text-muted">
                {{ cycle === 'annual' ? 'Annual saving (20%)' : 'Annual saving' }}
              </dt>
              <dd class="text-forest">−{{ formatMoney(quote.discountCents) }}</dd>
            </div>
          </dl>
          <p class="mt-5 border-t border-line pt-4 text-[11px] font-semibold">
            {{ formatMoney(quote.billedCents) }} billed
            {{ cycle === 'annual' ? 'yearly' : 'monthly' }}
            <span class="font-normal text-muted">· taxes excluded</span>
          </p>
          <button
            type="button"
            class="mt-6 flex min-h-12 w-full items-center justify-between rounded-md bg-ink px-4 text-xs font-bold text-white hover:bg-forest"
            @click="openBrief(selectedPlan, quote)"
          >
            Save this plan <ArrowRight :size="16" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p class="mt-5 text-center text-[10px] leading-5 text-muted">
        Illustrative plans for the Relay preview. Explore a plan to download a summary.
      </p>
    </div>

    <dialog
      ref="dialog"
      aria-labelledby="brief-heading"
      aria-describedby="brief-description"
      class="fixed m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-xl border border-line bg-paper p-6 text-ink shadow-2xl sm:p-8"
      @click="$event.target === dialog && dialog?.close()"
    >
      <template v-if="brief">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-mono text-[10px] tracking-wider text-muted">YOUR NEXT CHAPTER</p>
            <h2 id="brief-heading" class="mt-3 text-3xl font-semibold tracking-[-1px]">
              {{ brief.plan.name }} with Relay.
            </h2>
          </div>
          <button
            type="button"
            autofocus
            class="grid size-10 shrink-0 place-items-center rounded-md border border-line"
            aria-label="Close plan summary"
            @click="dialog?.close()"
          >
            <X :size="18" aria-hidden="true" />
          </button>
        </div>
        <p id="brief-description" class="mt-4 text-sm leading-6 text-muted">
          Keep a brief of this plan to review with your team. This preview does not create an
          account or collect a payment.
        </p>
        <dl class="mt-6 space-y-3 rounded-lg border border-line bg-white p-4 text-sm">
          <div class="flex justify-between gap-3">
            <dt class="text-muted">Team size</dt>
            <dd>{{ brief.quote.seats }} people</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-muted">Monthly runs</dt>
            <dd>{{ brief.quote.runs.toLocaleString('en-US') }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-muted">Monthly equivalent</dt>
            <dd class="font-bold">{{ formatMoney(brief.quote.monthlyCents) }}</dd>
          </div>
          <div class="flex justify-between gap-3 border-t border-line pt-3">
            <dt class="text-muted">
              Billed {{ brief.quote.cycle === 'annual' ? 'yearly' : 'monthly' }}
            </dt>
            <dd class="font-bold">{{ formatMoney(brief.quote.billedCents) }}</dd>
          </div>
        </dl>
        <button
          type="button"
          class="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-forest"
          @click="downloadBrief"
        >
          <Download :size="17" aria-hidden="true" /> Download plan brief
        </button>
        <p role="status" class="mt-3 min-h-5 text-center text-xs text-forest">
          {{ downloadStatus }}
        </p>
      </template>
    </dialog>
  </section>
</template>
