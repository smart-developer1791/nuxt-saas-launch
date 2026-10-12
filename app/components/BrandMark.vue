<script setup lang="ts">
defineProps<{ light?: boolean }>()
</script>

<template>
  <span class="inline-flex items-center gap-2.5" :class="light ? 'text-paper' : 'text-ink'">
    <svg width="31" height="31" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M3 5H16L24 13H11L3 5Z M3 14H16L24 22H11L3 14Z M3 23H16L20 27H7L3 23Z"
        fill="currentColor"
      />
      <path d="M22 5H29V12L22 5Z" :fill="light ? '#d4ef86' : '#52773d'" />
    </svg>
    <span class="text-[27px] font-extrabold tracking-[-1.5px]"
      >Relay<span class="ml-0.5 text-lime">.</span></span
    >
  </span>
</template>
