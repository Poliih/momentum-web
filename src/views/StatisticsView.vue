<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  Trophy,
} from 'lucide-vue-next'

import { statisticsService } from '@/services/statisticsService'
import type { Statistics } from '@/types'

const stats = ref<Statistics | null>(null)

const dayLabels: Record<string, string> = {
  MONDAY: 'Seg',
  TUESDAY: 'Ter',
  WEDNESDAY: 'Qua',
  THURSDAY: 'Qui',
  FRIDAY: 'Sex',
  SATURDAY: 'Sáb',
  SUNDAY: 'Dom',
}

onMounted(async () => {
  stats.value = await statisticsService.get()
})

function minutes(seconds: number) {
  return Math.round(seconds / 60)
}

function maxWeekdaySeconds() {
  if (!stats.value) return 1

  return Math.max(...Object.values(stats.value.focusSecondsByWeekday), 1)
}
</script>

<template>
  <div
    v-if="stats"
    class="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6"
  >
    <!-- Header -->
    <div class="flex items-start gap-3">
      <div
        class="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0"
      >
        <BarChart3 :size="22" />
      </div>

      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Estatísticas
        </h1>

        <p class="text-sm text-[var(--color-text-muted)] mt-1">
          Veja como seu foco e produtividade estão evoluindo.
        </p>
      </div>
    </div>

    <!-- Main stats -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <!-- Total focado -->
      <div
        class="card p-4 sm:p-5 group hover:border-[var(--color-accent)]/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--color-text-muted)]">
              Total focado
            </p>

            <p class="text-xl sm:text-2xl font-semibold mt-2">
              {{ minutes(stats.totalFocusSeconds) }}
              <span class="text-sm font-normal text-[var(--color-text-muted)]">
                min
              </span>
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center"
          >
            <Clock3 :size="18" />
          </div>
        </div>
      </div>

      <!-- Pomodoros -->
      <div
        class="card p-4 sm:p-5 group hover:border-[var(--color-accent)]/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--color-text-muted)]">
              Pomodoros
            </p>

            <p class="text-xl sm:text-2xl font-semibold mt-2">
              {{ stats.totalPomodoros }}
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center"
          >
            <Target :size="18" />
          </div>
        </div>
      </div>

      <!-- Tarefas -->
      <div
        class="card p-4 sm:p-5 group hover:border-[var(--color-accent)]/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--color-text-muted)]">
              Tarefas concluídas
            </p>

            <p class="text-xl sm:text-2xl font-semibold mt-2">
              {{ stats.completedTasks }}
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"
          >
            <CheckCircle2 :size="18" />
          </div>
        </div>
      </div>

      <!-- Média diária -->
      <div
        class="card p-4 sm:p-5 group hover:border-[var(--color-accent)]/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--color-text-muted)]">
              Média diária
            </p>

            <p class="text-xl sm:text-2xl font-semibold mt-2">
              {{ stats.averageDailyMinutes }}
              <span class="text-sm font-normal text-[var(--color-text-muted)]">
                min
              </span>
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center"
          >
            <BarChart3 :size="18" />
          </div>
        </div>
      </div>

      <!-- Streak atual -->
      <div
        class="card p-4 sm:p-5 group hover:border-orange-500/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--color-text-muted)]">
              Streak atual
            </p>

            <p class="text-xl sm:text-2xl font-semibold mt-2">
              {{ stats.currentStreak }}
              <span class="text-sm font-normal text-[var(--color-text-muted)]">
                dias
              </span>
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center"
          >
            <Flame :size="18" />
          </div>
        </div>
      </div>

      <!-- Maior streak -->
      <div
        class="card p-4 sm:p-5 group hover:border-yellow-500/30 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-[var(--color-text-muted)]">
              Maior streak
            </p>

            <p class="text-xl sm:text-2xl font-semibold mt-2">
              {{ stats.longestStreak }}
              <span class="text-sm font-normal text-[var(--color-text-muted)]">
                dias
              </span>
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center"
          >
            <Trophy :size="18" />
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly chart -->
    <div class="card p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center"
            >
              <BarChart3 :size="17" />
            </div>

            <h2 class="font-medium">
              Foco nos últimos 7 dias
            </h2>
          </div>

          <p class="text-xs text-[var(--color-text-muted)] mt-1 ml-10">
            Distribuição do seu tempo de foco por dia.
          </p>
        </div>
      </div>

      <div class="flex items-end gap-2 sm:gap-4 h-48">
        <div
          v-for="(label, key) in dayLabels"
          :key="key"
          class="flex-1 h-full flex flex-col items-center justify-end gap-2"
        >
          <div class="w-full h-36 flex items-end">
            <div
              class="w-full max-w-12 mx-auto bg-[var(--color-surface-2)] rounded-lg overflow-hidden h-full flex items-end"
            >
              <div
                class="w-full bg-[var(--color-accent)] rounded-lg transition-all duration-500 min-h-1"
                :style="{
                  height: `${((stats.focusSecondsByWeekday[key] ?? 0) / maxWeekdaySeconds()) * 100}%`,
                }"
              />
            </div>
          </div>

          <span
            class="text-[11px] sm:text-xs text-[var(--color-text-muted)]"
          >
            {{ label }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div
    v-else
    class="max-w-4xl mx-auto px-4 py-10"
  >
    <div class="flex items-center justify-center min-h-64">
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-10 h-10 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin"
        />

        <p class="text-sm text-[var(--color-text-muted)]">
          Carregando estatísticas...
        </p>
      </div>
    </div>
  </div>
</template>