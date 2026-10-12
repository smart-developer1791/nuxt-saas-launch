<script setup lang="ts">
import { ArrowUpRight, Check, Circle, CornerDownRight, Play, RotateCcw, X } from '@lucide/vue'
import { workflows } from '~/data/workflows'

const selectedId = ref(workflows[0]!.id)
const workflow = computed(() => workflows.find((item) => item.id === selectedId.value)!)
const completed = ref(0)
const running = ref(false)
const waiting = ref(false)
const rejected = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const finished = computed(() => completed.value === workflow.value.steps.length)
const status = computed(() =>
  rejected.value
    ? 'Request sent back. Workflow stopped.'
    : finished.value
      ? `Complete. ${workflow.value.savedMinutes} minutes of sample admin handled.`
      : waiting.value
        ? 'Waiting for your approval.'
        : running.value
          ? `Running step ${completed.value + 1} of ${workflow.value.steps.length}.`
          : 'Ready when you are.',
)

function reset() {
  clearTimeout(timer)
  completed.value = 0
  running.value = false
  waiting.value = false
  rejected.value = false
}
function advance() {
  if (completed.value >= workflow.value.steps.length) {
    running.value = false
    return
  }
  if (workflow.value.steps[completed.value]?.approval) {
    waiting.value = true
    return
  }
  timer = setTimeout(() => {
    completed.value += 1
    advance()
  }, 650)
}
function run() {
  reset()
  running.value = true
  advance()
}
function approve() {
  waiting.value = false
  completed.value += 1
  advance()
}
function reject() {
  clearTimeout(timer)
  waiting.value = false
  running.value = false
  rejected.value = true
}
function select(id: string) {
  reset()
  selectedId.value = id
}
function navigateTabs(event: KeyboardEvent, index: number) {
  const nextIndex =
    event.key === 'ArrowRight'
      ? (index + 1) % workflows.length
      : event.key === 'ArrowLeft'
        ? (index - 1 + workflows.length) % workflows.length
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? workflows.length - 1
            : -1
  if (nextIndex < 0) return
  event.preventDefault()
  select(workflows[nextIndex]!.id)
  document.getElementById(`workflow-tab-${selectedId.value}`)?.focus()
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section
    id="workflows"
    aria-labelledby="workflow-heading"
    class="scroll-mt-28 rounded-xl border border-line bg-white shadow-[0_22px_70px_-35px_rgba(32,52,42,0.35)]"
  >
    <div class="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
      <span class="flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted"
        ><span class="size-1.5 rounded-full bg-forest" /> RELAY / WORKFLOW PREVIEW</span
      >
      <span class="rounded border border-line px-2 py-1 font-mono text-[9px] text-muted"
        >SAMPLE DATA</span
      >
    </div>
    <div
      role="tablist"
      aria-label="Example workflows"
      class="grid grid-cols-3 gap-1 border-b border-line p-2"
    >
      <button
        v-for="(item, index) in workflows"
        :id="`workflow-tab-${item.id}`"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="selectedId === item.id"
        :aria-controls="`workflow-panel-${item.id}`"
        :tabindex="selectedId === item.id ? 0 : -1"
        class="min-h-12 rounded-md px-2 text-[11px] leading-snug font-semibold transition-colors sm:text-xs"
        :class="selectedId === item.id ? 'bg-ink text-white' : 'text-muted hover:bg-paper'"
        @click="select(item.id)"
        @keydown="navigateTabs($event, index)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      :id="`workflow-panel-${selectedId}`"
      role="tabpanel"
      :aria-labelledby="`workflow-tab-${selectedId}`"
      tabindex="0"
      class="px-5 pt-5 pb-4 sm:px-6"
    >
      <h2
        id="workflow-heading"
        class="min-h-12 text-[17px] leading-snug font-bold tracking-[-.4px] sm:text-lg"
      >
        {{ workflow.title }}
      </h2>
      <p class="mt-1 min-h-14 text-xs leading-relaxed text-muted">{{ workflow.description }}</p>
      <ol class="mt-3">
        <li v-for="(step, index) in workflow.steps" :key="index" class="relative pb-5 last:pb-0">
          <div
            v-if="index < workflow.steps.length - 1"
            class="flow-connector absolute top-16 left-8 h-5 w-px"
            aria-hidden="true"
          />
          <div
            class="flex min-h-16 items-center gap-3 rounded-lg border px-3 py-3 transition-colors"
            :class="
              completed > index
                ? 'border-[#b9ce92] bg-[#f5f9ed]'
                : running && completed === index
                  ? 'step-running border-[#b9ce92] bg-white'
                  : 'border-line bg-white'
            "
          >
            <span
              class="grid size-10 shrink-0 place-items-center rounded-md text-[11px] font-extrabold"
              :style="{ backgroundColor: step.color }"
              >{{
                step.tool === 'Notion'
                  ? 'N'
                  : step.tool === 'Slack'
                    ? '#'
                    : step.tool === 'Gmail'
                      ? 'M'
                      : step.tool === 'Linear'
                        ? '↗'
                        : step.tool === 'Review'
                          ? '✓'
                          : '▤'
              }}</span
            >
            <div class="min-w-0 flex-1">
              <p class="text-[12px] font-bold">{{ step.label }}</p>
              <p class="mt-1 truncate text-[10px] text-muted">{{ step.detail }}</p>
            </div>
            <Check
              v-if="completed > index"
              :size="17"
              class="shrink-0 text-forest"
              aria-label="Completed"
            /><X
              v-else-if="rejected && completed === index"
              :size="17"
              class="shrink-0 text-red-700"
              aria-label="Sent back"
            /><Circle v-else :size="13" class="shrink-0 text-[#a6b09e]" aria-hidden="true" />
          </div>
        </li>
      </ol>
      <div class="mt-5 min-h-22">
        <div v-if="waiting" class="flex gap-2">
          <button
            type="button"
            class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-forest px-3 text-xs font-bold text-white"
            @click="approve"
          >
            <Check :size="15" aria-hidden="true" /> Approve request
          </button>
          <button
            type="button"
            class="min-h-11 rounded-md border border-line px-4 text-xs font-bold"
            @click="reject"
          >
            Send back
          </button>
        </div>
        <div v-else class="flex gap-2">
          <button
            type="button"
            :disabled="running"
            class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-lime px-4 text-xs font-bold text-ink transition-colors hover:bg-[#c6e672] disabled:opacity-65"
            @click="run"
          >
            <Play :size="14" aria-hidden="true" />
            {{
              running
                ? 'Running workflow…'
                : finished || rejected
                  ? 'Run again'
                  : 'Run this workflow'
            }}
          </button>
          <button
            type="button"
            class="grid size-11 shrink-0 place-items-center rounded-md border border-line hover:bg-paper"
            aria-label="Reset workflow"
            @click="reset"
          >
            <RotateCcw :size="15" aria-hidden="true" />
          </button>
        </div>
        <p
          role="status"
          aria-live="polite"
          class="mt-3 flex min-h-4 items-center gap-1.5 text-[10px] text-muted"
        >
          <CornerDownRight :size="12" aria-hidden="true" /> {{ status }}
        </p>
      </div>
    </div>
    <div
      class="flex items-center justify-between rounded-b-xl border-t border-line bg-paper px-5 py-3 font-mono text-[9px] text-muted sm:px-6"
    >
      <span>4 STEPS. ONE LESS THING TO THINK ABOUT.</span
      ><ArrowUpRight :size="14" aria-hidden="true" />
    </div>
  </section>
</template>
