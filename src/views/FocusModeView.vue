<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Check,
  Clock3,
  Pause,
  Play,
  Timer,
  X,
} from 'lucide-vue-next'

import { useFocusStore } from '@/stores/focus'
import { useTagStore } from '@/stores/tag'
import { usePomodoro } from '@/composables/usePomodoro'

import AppButton from '@/components/ui/AppButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const focusStore = useFocusStore()
const tagStore = useTagStore()
const router = useRouter()

const { formatted, progress, isFinished } = usePomodoro()

const activeTag = computed(() =>
  tagStore.tags.find((t) => t.id === focusStore.activeSession?.tagId)
)

async function togglePause() {
  if (!focusStore.activeSession) return

  if (focusStore.activeSession.status === 'RUNNING') {
    await focusStore.pause()
  } else {
    await focusStore.resume()
  }
}

async function finish() {
  await focusStore.complete()
  router.push('/')
}

function onKeydown(e: KeyboardEvent) {
  if (e.code === 'Space') {
    e.preventDefault()
    togglePause()
  }

  if (e.code === 'Escape') {
    router.push('/')
  }
}

watch(isFinished, async (finished) => {
  if (finished) await finish()
})

onMounted(() => {
  if (!focusStore.activeSession) router.push('/')

  if (tagStore.tags.length === 0) tagStore.fetchAll()

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() =>
  window.removeEventListener('keydown', onKeydown)
)
</script>

<template>
  <div
    v-if="focusStore.activeSession"
    class="min-h-screen flex flex-col
           items-center justify-center
           px-4 py-8 relative overflow-hidden"
  >

    <div
      class="absolute inset-0 pointer-events-none
             opacity-30"
    >
      <div
        class="absolute top-1/2 left-1/2
               -translate-x-1/2 -translate-y-1/2
               w-[500px] h-[500px]
               rounded-full
               bg-[var(--color-accent)]/5
               blur-3xl"
      />
    </div>

    <!-- Top navigation -->
    <div
      class="absolute top-0 left-0 right-0
             flex items-center justify-between
             px-4 sm:px-6 py-5"
    >
      <button
        type="button"
        class="flex items-center gap-2
               text-sm text-[var(--color-text-muted)]
               hover:text-[var(--color-text)]
               transition-colors"
        @click="router.push('/')"
      >
        <ArrowLeft :size="17" />
        <span class="hidden sm:inline">
          Voltar
        </span>
      </button>

      <div
        class="flex items-center gap-2
               text-xs text-[var(--color-text-muted)]"
      >
        <Timer :size="15" />
        <span>Modo foco</span>
      </div>
    </div>

    <!-- Main focus area -->
    <main
      class="relative z-10
             w-full max-w-xl
             flex flex-col items-center"
    >

      <!-- Status -->
      <div
        class="flex flex-col
               items-center gap-3 mb-8"
      >
        <div
          class="flex items-center gap-2
                 px-3 py-1.5 rounded-full
                 bg-[var(--color-accent)]/10
                 text-[var(--color-accent)]"
        >
          <span
            class="relative flex w-2 h-2"
          >
            <span
              v-if="focusStore.activeSession.status === 'RUNNING'"
              class="absolute inline-flex
                     w-full h-full rounded-full
                     bg-[var(--color-accent)]
                     opacity-60 animate-ping"
            />

            <span
              class="relative inline-flex
                     w-2 h-2 rounded-full
                     bg-[var(--color-accent)]"
            />
          </span>

          <span
            class="text-[11px]
                   uppercase tracking-[0.18em]
                   font-semibold"
          >
            {{
              focusStore.activeSession.status === 'RUNNING'
                ? 'Foco ativo'
                : 'Foco pausado'
            }}
          </span>
        </div>

        <!-- Tag -->
        <span
          v-if="activeTag"
          class="px-3 py-1 rounded-full
                 text-xs font-medium"
          :style="{
            backgroundColor: activeTag.color + '20',
            color: activeTag.color,
          }"
        >
          {{ activeTag.name }}
        </span>
      </div>

      <!-- Timer -->
      <div
        class="relative flex items-center
               justify-center
               w-[280px] h-[280px]
               sm:w-[340px] sm:h-[340px]
               mb-9"
      >
        <!-- Outer ring -->
        <svg
          class="absolute inset-0
                 w-full h-full
                 -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            class="text-[var(--color-surface-2)]"
          />

          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            class="text-[var(--color-accent)]
                   transition-all duration-500"
            :stroke-dasharray="289"
            :stroke-dashoffset="289 - (289 * progress)"
          />
        </svg>

        <!-- Inner surface -->
        <div
          class="absolute
                 w-[250px] h-[250px]
                 sm:w-[304px] sm:h-[304px]
                 rounded-full
                 bg-[var(--color-surface)]
                 flex flex-col
                 items-center
                 justify-center
                 border
                 border-[var(--color-surface-2)]
                 shadow-xl"
        >
          <span
            class="text-xs uppercase
                   tracking-[0.2em]
                   text-[var(--color-text-muted)]
                   mb-3"
          >
            Tempo restante
          </span>

          <div
            class="text-[4.5rem] sm:text-[5.5rem]
                   leading-none
                   font-semibold
                   tracking-tight
                   tabular-nums"
          >
            {{ formatted }}
          </div>

          <div
            class="flex items-center gap-1.5
                   mt-4
                   text-xs
                   text-[var(--color-text-muted)]"
          >
            <Clock3 :size="13" />
            <span>
              {{ Math.round(progress * 100) }}% concluído
            </span>
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="w-full max-w-sm mb-8">
        <div
          class="flex items-center
                 justify-between
                 mb-2"
        >
          <span
            class="text-xs
                   text-[var(--color-text-muted)]"
          >
            Progresso
          </span>

          <span
            class="text-xs font-medium
                   text-[var(--color-accent)]"
          >
            {{ Math.round(progress * 100) }}%
          </span>
        </div>

        <ProgressBar :progress="progress" />
      </div>

      <!-- Actions -->
      <div
        class="flex items-center
               justify-center
               gap-3"
      >
        <AppButton
          variant="secondary"
          class="min-w-[140px]
                 flex items-center
                 justify-center gap-2"
          @click="togglePause"
        >
          <Pause
            v-if="focusStore.activeSession.status === 'RUNNING'"
            :size="17"
          />

          <Play
            v-else
            :size="17"
            :fill="'currentColor'"
          />

          {{
            focusStore.activeSession.status === 'RUNNING'
              ? 'Pausar'
              : 'Continuar'
          }}
        </AppButton>

        <AppButton
          variant="ghost"
          class="flex items-center
                 justify-center gap-2"
          @click="finish"
        >
          <Check :size="17" />
          Finalizar
        </AppButton>
      </div>

      <!-- Keyboard shortcuts -->
      <div
        class="flex items-center
               gap-3 mt-7
               text-[11px]
               text-[var(--color-text-muted)]"
      >
        <span
          class="flex items-center gap-1.5"
        >
          <kbd
            class="px-1.5 py-0.5 rounded
                   border
                   border-[var(--color-surface-2)]
                   bg-[var(--color-surface-2)]
                   font-mono"
          >
            Space
          </kbd>

          pausar
        </span>

        <span class="opacity-30">•</span>

        <span
          class="flex items-center gap-1.5"
        >
          <kbd
            class="px-1.5 py-0.5 rounded
                   border
                   border-[var(--color-surface-2)]
                   bg-[var(--color-surface-2)]
                   font-mono"
          >
            Esc
          </kbd>

          sair
        </span>
      </div>
    </main>

    <!-- Finish shortcut hint -->
    <div
      class="absolute bottom-5
             left-1/2
             -translate-x-1/2
             hidden sm:flex
             items-center gap-1.5
             text-[10px]
             text-[var(--color-text-muted)]"
    >
      <X :size="12" />
      A sessão será encerrada automaticamente ao chegar a zero
    </div>
  </div>
</template>
