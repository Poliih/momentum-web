<script setup lang="ts">
defineProps<{ progress: number }>() // 0..1
</script>

<template>
  <div class="w-full h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
    <div
      class="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
      :style="{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }"
    />
  </div>
</template>
