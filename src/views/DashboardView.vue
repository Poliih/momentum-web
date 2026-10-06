<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  BookOpen,
  CircleAlert,
  Clock3,
  Gamepad2,
  ListTodo,
  Play,
  Target,
  Timer,
  Trophy,
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/task'
import { useFocusStore } from '@/stores/focus'
import { useTagStore } from '@/stores/tag'
import { goalService } from '@/services/statisticsService'

import AppButton from '@/components/ui/AppButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import TaskGoalProgress from '@/components/task/TaskGoalProgress.vue'
import StartFocusModal from '@/components/focus/StartFocusModal.vue'

import type { Goal, Task } from '@/types'

const auth = useAuthStore()
const taskStore = useTaskStore()
const focusStore = useFocusStore()
const tagStore = useTagStore()
const router = useRouter()

const goal = ref<Goal | null>(null)
const showModal = ref(false)
const modalTask = ref<Task | null>(null)

onMounted(async () => {
  await Promise.all([
    taskStore.fetchAll('TODO'),
    tagStore.fetchWeeklyStats(),
    (async () => (goal.value = await goalService.get()))(),
  ])
})

const todaysTasks = computed(() => taskStore.tasks.slice(0, 5))

const goalMinutesProgress = computed(() =>
  goal.value
    ? Math.min(
        goal.value.todayFocusMinutes / goal.value.dailyFocusMinutes,
        1,
      )
    : 0,
)

const goalPomodoroProgress = computed(() =>
  goal.value
    ? Math.min(
        goal.value.todayPomodoros / goal.value.dailyPomodoros,
        1,
      )
    : 0,
)

const productiveSeconds = computed(() =>
  tagStore.weeklyStats
    .filter((s) => s.kind === 'PRODUCTIVE')
    .reduce((a, s) => a + s.totalSeconds, 0),
)

const rewardSeconds = computed(() =>
  tagStore.weeklyStats
    .filter((s) => s.kind === 'REWARD')
    .reduce((a, s) => a + s.totalSeconds, 0),
)

const balanceRatio = computed(() => {
  const total = productiveSeconds.value + rewardSeconds.value

  return total === 0 ? 0.5 : productiveSeconds.value / total
})

function hoursMin(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)

  return h > 0
    ? `${h}h${m > 0 ? ` ${m}min` : ''}`
    : `${m}min`
}

function openModal(task?: Task) {
  modalTask.value = task ?? null
  showModal.value = true
}

async function onStart(minutes: number, tagId: string | null) {
  showModal.value = false

  await focusStore.start(
    'FOCUS',
    minutes * 60,
    modalTask.value?.id,
    tagId ?? undefined,
  )

  router.push('/focus')
}

const priorityLabel: Record<string, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}

const priorityColor: Record<string, string> = {
  LOW: 'var(--color-text-muted)',
  MEDIUM: '#3b82f6',
  HIGH: 'var(--color-warning)',
  URGENT: 'var(--color-danger)',
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">

    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
    >
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span
            class="flex items-center justify-center w-8 h-8 rounded-lg
                   bg-[var(--color-accent)]/10
                   text-[var(--color-accent)]"
          >
            <Target :size="18" :stroke-width="2" />
          </span>

          <span
            class="text-xs font-medium uppercase tracking-wider
                   text-[var(--color-text-muted)]"
          >
            Seu painel
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">
          Bom trabalho, {{ auth.user?.name }}
        </h1>

        <p class="text-sm text-[var(--color-text-muted)] mt-1">
          Aqui está o resumo do seu dia.
        </p>
      </div>

      <AppButton
        class="hidden sm:inline-flex items-center gap-2"
        @click="openModal()"
      >
        <Play :size="16" :fill="'currentColor'" />
        Começar foco
      </AppButton>
    </header>

    <!-- Sessão ativa -->
    <button
      v-if="focusStore.activeSession"
      type="button"
      class="w-full text-left rounded-xl border
             border-[var(--color-accent)]
             bg-[var(--color-accent)]/5
             p-4 sm:p-5
             flex items-center justify-between gap-4
             transition-all duration-200
             hover:bg-[var(--color-accent)]/10
             hover:shadow-sm"
      @click="router.push('/focus')"
    >
      <div class="flex items-center gap-3 min-w-0">
        <span
          class="relative flex items-center justify-center
                 w-9 h-9 rounded-lg
                 bg-[var(--color-accent)]/10
                 text-[var(--color-accent)]"
        >
          <span
            class="absolute inset-0 rounded-lg
                   bg-[var(--color-accent)]/20 animate-ping"
          />

          <Timer
            :size="18"
            class="relative z-10"
          />
        </span>

        <div class="min-w-0">
          <p class="text-sm font-medium">
            Sessão em andamento
          </p>

          <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
            {{
              focusStore.activeSession.status === 'PAUSED'
                ? 'Sessão pausada'
                : 'Você está focando agora'
            }}
          </p>
        </div>
      </div>

      <span
        class="flex items-center gap-1.5 shrink-0
               text-sm font-medium
               text-[var(--color-accent)]"
      >
        Continuar
        <ArrowRight :size="16" />
      </span>
    </button>

    <!-- Metas do dia -->
    <section
      v-if="goal"
      class="grid sm:grid-cols-2 gap-4"
    >
      <!-- Minutos -->
      <div
        class="card p-5 sm:p-6
               transition-all duration-200
               hover:-translate-y-0.5
               hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-4 mb-5">
          <div class="flex items-center gap-3">
            <span
              class="flex items-center justify-center
                     w-10 h-10 rounded-xl
                     bg-[var(--color-accent)]/10
                     text-[var(--color-accent)]"
            >
              <Clock3 :size="19" />
            </span>

            <div>
              <p class="text-sm font-medium">
                Tempo de foco
              </p>

              <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
                Meta diária
              </p>
            </div>
          </div>

          <span
            class="text-sm font-semibold
                   whitespace-nowrap"
          >
            {{ goal.todayFocusMinutes }}
            <span class="font-normal text-[var(--color-text-muted)]">
              / {{ goal.dailyFocusMinutes }} min
            </span>
          </span>
        </div>

        <ProgressBar :progress="goalMinutesProgress" />

        <div class="flex justify-between mt-2">
          <span class="text-xs text-[var(--color-text-muted)]">
            Progresso
          </span>

          <span
            class="text-xs font-medium
                   text-[var(--color-accent)]"
          >
            {{ Math.round(goalMinutesProgress * 100) }}%
          </span>
        </div>
      </div>

      <!-- Pomodoros -->
      <div
        class="card p-5 sm:p-6
               transition-all duration-200
               hover:-translate-y-0.5
               hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-4 mb-5">
          <div class="flex items-center gap-3">
            <span
              class="flex items-center justify-center
                     w-10 h-10 rounded-xl
                     bg-[var(--color-success)]/10
                     text-[var(--color-success)]"
            >
              <Trophy :size="19" />
            </span>

            <div>
              <p class="text-sm font-medium">
                Pomodoros
              </p>

              <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
                Meta diária
              </p>
            </div>
          </div>

          <span
            class="text-sm font-semibold
                   whitespace-nowrap"
          >
            {{ goal.todayPomodoros }}
            <span class="font-normal text-[var(--color-text-muted)]">
              / {{ goal.dailyPomodoros }}
            </span>
          </span>
        </div>

        <ProgressBar :progress="goalPomodoroProgress" />

        <div class="flex justify-between mt-2">
          <span class="text-xs text-[var(--color-text-muted)]">
            Progresso
          </span>

          <span
            class="text-xs font-medium
                   text-[var(--color-success)]"
          >
            {{ Math.round(goalPomodoroProgress * 100) }}%
          </span>
        </div>
      </div>
    </section>

    <!-- Equilíbrio semanal -->
    <section
      v-if="productiveSeconds > 0 || rewardSeconds > 0"
      class="card p-5 sm:p-6"
    >
      <div
        class="flex flex-col sm:flex-row
               sm:items-center sm:justify-between
               gap-3 mb-5"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex items-center justify-center
                   w-10 h-10 rounded-xl
                   bg-[var(--color-surface-2)]
                   text-[var(--color-text)]"
          >
            <Target :size="19" />
          </span>

          <div>
            <h2 class="text-sm font-medium">
              Equilíbrio da semana
            </h2>

            <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
              Tempo produtivo x recompensa
            </p>
          </div>
        </div>

        <div class="text-xs text-[var(--color-text-muted)]">
          {{ hoursMin(productiveSeconds + rewardSeconds) }} no total
        </div>
      </div>

      <!-- Barra -->
      <div
        class="w-full h-3 rounded-full overflow-hidden
               flex bg-[var(--color-surface-2)]"
      >
        <div
          class="h-full bg-[var(--color-success)]
                 transition-all duration-500"
          :style="{ width: `${balanceRatio * 100}%` }"
        />

        <div
          class="h-full bg-[var(--color-warning)]
                 transition-all duration-500"
          :style="{ width: `${(1 - balanceRatio) * 100}%` }"
        />
      </div>

      <div
        class="grid grid-cols-2 gap-4
               mt-4"
      >
        <div
          class="flex items-center gap-2
                 rounded-lg p-3
                 bg-[var(--color-success)]/5"
        >
          <span
            class="flex items-center justify-center
                   w-8 h-8 rounded-lg
                   bg-[var(--color-success)]/10
                   text-[var(--color-success)]"
          >
            <BookOpen :size="16" />
          </span>

          <div class="min-w-0">
            <p class="text-xs text-[var(--color-text-muted)]">
              Estudo
            </p>

            <p class="text-sm font-semibold">
              {{ hoursMin(productiveSeconds) }}
            </p>
          </div>
        </div>

        <div
          class="flex items-center gap-2
                 rounded-lg p-3
                 bg-[var(--color-warning)]/5"
        >
          <span
            class="flex items-center justify-center
                   w-8 h-8 rounded-lg
                   bg-[var(--color-warning)]/10
                   text-[var(--color-warning)]"
          >
            <Gamepad2 :size="16" />
          </span>

          <div class="min-w-0">
            <p class="text-xs text-[var(--color-text-muted)]">
              Recompensa
            </p>

            <p class="text-sm font-semibold">
              {{ hoursMin(rewardSeconds) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div
        v-if="tagStore.weeklyStats.length"
        class="flex flex-wrap gap-2 mt-5 pt-5
               border-t border-[var(--color-border)]"
      >
        <span
          v-for="stat in tagStore.weeklyStats"
          :key="stat.tagId"
          class="px-2.5 py-1.5 rounded-lg
                 text-xs font-medium
                 flex items-center gap-2
                 transition-all duration-200
                 hover:scale-[1.02]"
          :style="{
            backgroundColor: stat.color + '18',
            color: stat.color,
          }"
        >
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0"
            :style="{ backgroundColor: stat.color }"
          />

          {{ stat.tagName }}

          <span class="opacity-60">
            {{ hoursMin(stat.totalSeconds) }}
          </span>
        </span>
      </div>
    </section>

    <!-- Tarefas -->
    <section class="card p-5 sm:p-6">
      <div
        class="flex items-center justify-between
               gap-4 mb-5"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex items-center justify-center
                   w-10 h-10 rounded-xl
                   bg-[var(--color-surface-2)]
                   text-[var(--color-text)]"
          >
            <ListTodo :size="19" />
          </span>

          <div>
            <h2 class="font-medium">
              Tarefas de hoje
            </h2>

            <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
              Suas próximas tarefas
            </p>
          </div>
        </div>

        <router-link
          to="/tasks"
          class="flex items-center gap-1.5
                 text-sm font-medium
                 text-[var(--color-accent)]
                 hover:opacity-80
                 transition-opacity"
        >
          Ver todas
          <ArrowRight :size="15" />
        </router-link>
      </div>

      <!-- Empty state -->
      <div
        v-if="todaysTasks.length === 0"
        class="py-10 text-center
               rounded-xl
               bg-[var(--color-surface-2)]"
      >
        <div
          class="flex items-center justify-center
                 w-12 h-12 mx-auto mb-3
                 rounded-xl
                 bg-[var(--color-accent)]/10
                 text-[var(--color-accent)]"
        >
          <CircleAlert :size="21" />
        </div>

        <p class="text-sm font-medium">
          Nenhuma tarefa pendente
        </p>

        <p
          class="text-xs text-[var(--color-text-muted)]
                 mt-1"
        >
          Crie uma tarefa para começar seu dia.
        </p>
      </div>

      <!-- Task list -->
      <ul
        v-else
        class="space-y-2"
      >
        <li
          v-for="task in todaysTasks"
          :key="task.id"
          class="group p-4 rounded-xl
                 bg-[var(--color-surface-2)]
                 border border-transparent
                 transition-all duration-200
                 hover:border-[var(--color-accent)]/20
                 hover:bg-[var(--color-surface-2)]
                 hover:shadow-sm"
        >
          <div
            class="flex flex-col sm:flex-row
                   sm:items-center
                   justify-between gap-4"
          >
            <div class="flex items-start gap-3 min-w-0">
              <!-- Priority indicator -->
              <span
                class="mt-1.5 w-2 h-2 rounded-full shrink-0"
                :style="{
                  backgroundColor: priorityColor[task.priority],
                }"
              />

              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-[10px]
                           uppercase tracking-wider
                           font-semibold"
                    :style="{
                      color: priorityColor[task.priority],
                    }"
                  >
                    {{ priorityLabel[task.priority] }}
                  </span>
                </div>

                <p
                  class="text-sm font-medium
                         truncate"
                >
                  {{ task.title }}
                </p>
              </div>
            </div>

            <AppButton
              variant="secondary"
              class="shrink-0 flex items-center
                     justify-center gap-2"
              @click="openModal(task)"
            >
              <Timer :size="15" />
              Focar
            </AppButton>
          </div>

          <div class="mt-3">
            <TaskGoalProgress :task="task" />
          </div>
        </li>
      </ul>
    </section>

    <!-- Mobile CTA -->
    <AppButton
      class="w-full py-3.5 text-base
             sm:hidden flex items-center
             justify-center gap-2"
      @click="openModal()"
    >
      <Play :size="17" :fill="'currentColor'" />
      Começar foco
    </AppButton>

    <StartFocusModal
      v-if="showModal"
      :task="modalTask"
      @close="showModal = false"
      @start="onStart"
    />
  </div>
</template>