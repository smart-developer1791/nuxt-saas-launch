<script setup lang="ts">
import { ArrowUpRight, Menu, X } from '@lucide/vue'
import { site } from '~/data/site'

const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement>()
function closeMenu(restoreFocus = false) {
  menuOpen.value = false
  if (restoreFocus) menuButton.value?.focus()
}
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-md"
    @keydown.esc="closeMenu(true)"
  >
    <div class="mx-auto flex h-21 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
      <a href="#top" aria-label="Relay home" @click="closeMenu()"><BrandMark /></a>
      <nav
        aria-label="Main navigation"
        class="hidden items-center gap-8 text-[13px] font-semibold md:flex"
      >
        <a
          v-for="link in site.navigation"
          :key="link.href"
          :href="link.href"
          class="transition-colors hover:text-forest"
          >{{ link.label }}</a
        >
      </nav>
      <a
        href="#pricing"
        class="hidden items-center gap-5 rounded-md bg-ink px-5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-forest md:inline-flex"
        >Find your plan <ArrowUpRight :size="16" aria-hidden="true"
      /></a>
      <button
        ref="menuButton"
        type="button"
        class="grid size-11 place-items-center rounded-md border border-line md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="21" aria-hidden="true" /><Menu
          v-else
          :size="21"
          aria-hidden="true"
        />
      </button>
    </div>
    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      aria-label="Mobile navigation"
      class="absolute right-0 left-0 border-b border-line bg-paper px-5 py-5 shadow-lg md:hidden"
    >
      <a
        v-for="link in site.navigation"
        :key="link.href"
        :href="link.href"
        class="block rounded-md px-2 py-3 text-sm font-semibold"
        @click="closeMenu()"
        >{{ link.label }}</a
      >
      <a
        href="#pricing"
        class="mt-3 flex items-center justify-between rounded-md bg-ink px-4 py-3 text-sm font-bold text-white"
        @click="closeMenu()"
        >Find your plan <ArrowUpRight :size="16" aria-hidden="true"
      /></a>
    </nav>
  </header>
</template>
