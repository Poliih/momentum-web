<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Coffee,
  Filter,
  Flame,
  History,
  Timer,
} from 'lucide-vue-next'

import { focusService } from '@/services/focusService'
import { useTagStore } from '@/stores/tag'

import AppButton from '@/components/ui/AppButton.vue'

import type { FocusSession, PageResponse } from '@/types'

const tagStore = useTagStore()

const pageData = ref<PageResponse<FocusSession> | null>(null)

const page = ref(0)
const pageSize = 10

const selectedTagId = ref<string>('')

const typeLabel: Record<string, string> = {
  FOCUS: 'Foco',
  SHORT_BREAK: 'Pausa curta',
  LONG_BREAK: 'Pausa longa',
}

async function load() {
  pageData.value = await focusService.historyPaged(
    page.value,
    pageSize,
    selectedTagId.value || undefined,
  )
}

onMounted(async () => {
  await tagStore.fetchAll()
  await load()
})

watch(selectedTagId, () => {
  page.value = 0
  load()
})

watch(page, load)

function minutes(seconds: number | null) {
  return seconds ? Math.round(seconds / 60) : 0
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR')
}

function tagFor(id: string | null) {
  return tagStore.tags.find((t) => t.id === id)
}

function sessionIcon(type: string) {
  if (type === 'FOCUS') return Flame

  return Coffee
}

function sessionIconClass(type: string) {
  if (type === 'FOCUS') {
    return {
      wrapper:
        'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
      badge:
        'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
    }
  }

  return {
    wrapper:
      'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    badge:
      'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    COMPLETED: 'Concluída',
    RUNNING: 'Em andamento',
    PAUSED: 'Pausada',
    CANCELLED: 'Cancelada',
  }

  return labels[status] ?? status
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    COMPLETED:
      'bg-[var(--color-success)]/10 text-[var(--color-success)]',

    RUNNING:
      'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',

    PAUSED:
      'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',

    CANCELLED:
      'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
  }

  return classes[status] ?? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
}
</script>

<template>
  <div
    class="max-w-3xl mx-auto
           px-4 sm:px-6
           py-8 sm:py-10
           space-y-6"
  >

    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row
             sm:items-center
             sm:justify-between
             gap-5"
    >
      <div class="flex items-start gap-3">
        <div
          class="flex items-center justify-center
                 w-10 h-10
                 rounded-xl
                 bg-[var(--color-accent)]/10
                 text-[var(--color-accent)]
                 shrink-0"
        >
          <History :size="19" />
        </div>

        <div>
          <h1
            class="text-2xl
                   font-semibold
                   tracking-tight"
          >
            Histórico
          </h1>

          <p
            class="text-sm
                   text-[var(--color-text-muted)]
                   mt-1"
          >
            Acompanhe suas sessões de foco e pausas.
          </p>
        </div>
      </div>

      <!-- Filter -->
      <div class="relative">
        <Filter
          :size="15"
          class="absolute
                 left-3 top-1/2
                 -translate-y-1/2
                 text-[var(--color-text-muted)]
                 pointer-events-none"
        />

        <select
          v-model="selectedTagId"
          class="appearance-none
                 w-full sm:w-auto
                 min-w-[180px]
                 pl-9 pr-9 py-2
                 rounded-xl
                 bg-[var(--color-surface-2)]
                 border border-[var(--color-border)]
                 text-sm
                 outline-none
                 transition-all
                 focus:border-[var(--color-accent)]
                 focus:ring-2
                 focus:ring-[var(--color-accent)]/10"
        >
          <option value="">
            Todas as tags
          </option>

          <option
            v-for="tag in tagStore.tags"
            :key="tag.id"
            :value="tag.id"
          >
            {{ tag.name }}
          </option>
        </select>

        <ArrowRight
          :size="14"
          class="absolute
                 right-3 top-1/2
                 -translate-y-1/2
                 rotate-90
                 text-[var(--color-text-muted)]
                 pointer-events-none"
        />
      </div>
    </header>

    <!-- Session count -->
    <div
      v-if="pageData && pageData.content.length > 0"
      class="flex items-center
             justify-between
             text-xs
             text-[var(--color-text-muted)]"
    >
      <span>
        {{ pageData.content.length }}
        {{ pageData.content.length === 1 ? 'sessão' : 'sessões' }}
        nesta página
      </span>

      <span>
        Página {{ pageData.page + 1 }} de {{ pageData.totalPages }}
      </span>
    </div>

    <!-- Empty state -->
    <div
      v-if="pageData && pageData.content.length === 0"
      class="card p-10
             flex flex-col
             items-center
             text-center"
    >
      <div
        class="flex items-center justify-center
               w-14 h-14
               rounded-2xl
               bg-[var(--color-accent)]/10
               text-[var(--color-accent)]
               mb-4"
      >
        <Timer :size="24" />
      </div>

      <h2 class="text-sm font-semibold">
        Nenhuma sessão encontrada
      </h2>

      <p
        class="text-sm
               text-[var(--color-text-muted)]
               mt-1 max-w-sm"
      >
        Ainda não há sessões registradas para o filtro selecionado.
      </p>
    </div>

    <!-- Sessions -->
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="session in pageData?.content ?? []"
        :key="session.id"
        class="card p-4 sm:p-5
               transition-all duration-200
               hover:-translate-y-0.5
               hover:shadow-md"
      >
        <div
          class="flex items-center
                 justify-between
                 gap-4"
        >

          <!-- Left -->
          <div
            class="flex items-center
                   gap-3
                   min-w-0"
          >
            <!-- Session icon -->
            <div
              class="flex items-center justify-center
                     w-11 h-11
                     rounded-xl
                     shrink-0"
              :class="sessionIconClass(session.type).wrapper"
            >
              <component
                :is="sessionIcon(session.type)"
                :size="19"
              />
            </div>

            <!-- Session info -->
            <div class="min-w-0">
              <div
                class="flex flex-wrap
                       items-center
                       gap-2"
              >
                <p
                  class="text-sm
                         font-medium"
                >
                  {{ typeLabel[session.type] }}
                </p>

                <span
                  v-if="tagFor(session.tagId)"
                  class="px-2 py-0.5
                         rounded-full
                         text-[10px]
                         font-medium"
                  :style="{
                    backgroundColor:
                      tagFor(session.tagId)!.color + '20',
                    color:
                      tagFor(session.tagId)!.color,
                  }"
                >
                  {{ tagFor(session.tagId)!.name }}
                </span>
              </div>

              <p
                class="text-xs
                       text-[var(--color-text-muted)]
                       mt-1"
              >
                {{ formatTime(session.startedAt) }}
              </p>
            </div>
          </div>

          <!-- Right -->
          <div
            class="flex flex-col
                   items-end
                   gap-1.5
                   shrink-0"
          >
            <div
              class="flex items-center
                     gap-1.5"
            >
              <Timer
                :size="13"
                class="text-[var(--color-text-muted)]"
              />

              <span
                class="text-sm
                       font-semibold
                       tabular-nums"
              >
                {{ minutes(session.actualDurationSeconds) }} min
              </span>
            </div>

            <span
              class="px-2 py-0.5
                     rounded-full
                     text-[10px]
                     font-medium"
              :class="statusClass(session.status)"
            >
              {{ statusLabel(session.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pageData && pageData.totalPages > 1"
      class="flex items-center
             justify-between
             gap-3
             pt-2"
    >
      <AppButton
        variant="secondary"
        :disabled="page === 0"
        class="flex items-center
               gap-2"
        @click="page--"
      >
        <ArrowLeft :size="15" />
        <span class="hidden sm:inline">
          Anterior
        </span>
      </AppButton>

      <div
        class="flex flex-col
               items-center"
      >
        <span
          class="text-sm
                 font-medium"
        >
          {{ pageData.page + 1 }}
        </span>

        <span
          class="text-[10px]
                 text-[var(--color-text-muted)]"
        >
          de {{ pageData.totalPages }}
        </span>
      </div>

      <AppButton
        variant="secondary"
        :disabled="!pageData.hasNext"
        class="flex items-center
               gap-2"
        @click="page++"
      >
        <span class="hidden sm:inline">
          Próxima
        </span>
        <ArrowRight :size="15" />
      </AppButton>
    </div>
  </div>
</template>