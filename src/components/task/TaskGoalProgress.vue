<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import type { Task } from '@/types'

const props = defineProps<{ task: Task }>()

const progress = computed(() => {
  if (!props.task.goalMinutes) return null
  return Math.min(props.task.focusedMinutes / props.task.goalMinutes, 1)
})
</script>

<template>
  <div v-if="progress !== null" class="mt-2">
    <div class="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
      <span>Meta</span>
      <span>{{ task.focusedMinutes }} / {{ task.goalMinutes }} min</span>
    </div>
    <ProgressBar :progress="progress" />
  </div>
</template>
