<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Check,
  CircleAlert,
  CircleCheck,
  ListTodo,
  Play,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-vue-next'

import { useTaskStore } from '@/stores/task'
import AppButton from '@/components/ui/AppButton.vue'
import TaskGoalProgress from '@/components/task/TaskGoalProgress.vue'
import StartFocusModal from '@/components/focus/StartFocusModal.vue'
import { useFocusStore } from '@/stores/focus'
import type { Task } from '@/types'

const taskStore = useTaskStore()
const focusStore = useFocusStore()
const router = useRouter()

const newTitle = ref('')
const newGoalMinutes = ref<number | null>(null)
const showModal = ref(false)
const modalTask = ref<Task | null>(null)

onMounted(() => taskStore.fetchAll())

async function addTask() {
  if (!newTitle.value.trim()) return

  await taskStore.create({
    title: newTitle.value.trim(),
    goalMinutes: newGoalMinutes.value ?? undefined,
  })

  newTitle.value = ''
  newGoalMinutes.value = null
}

function openModal(task: Task) {
  modalTask.value = task
  showModal.value = true
}

async function onStart(minutes: number, tagId: string | null) {
  showModal.value = false
  await focusStore.start(
    'FOCUS',
    minutes * 60,
    modalTask.value?.id,
    tagId ?? undefined
  )
  router.push('/focus')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8 sm:py-10 space-y-6">

    <!-- Header -->
    <div class="flex items-start gap-3">
      <div
        class="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0"
      >
        <ListTodo :size="22" />
      </div>

      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Tarefas
        </h1>

        <p class="text-sm text-[var(--color-text-muted)] mt-1">
          Organize o que precisa ser feito e transforme foco em progresso.
        </p>
      </div>
    </div>

    <!-- Add task -->
    <form
      class="card p-4 sm:p-5 space-y-3"
      @submit.prevent="addTask"
    >
      <div class="flex items-center gap-2">
        <Plus
          :size="17"
          class="text-[var(--color-accent)]"
        />

        <p class="text-sm font-medium">
          Nova tarefa
        </p>
      </div>

      <input
        v-model="newTitle"
        placeholder="O que você precisa fazer?"
        class="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none transition focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-muted)]"
      />

      <div class="flex flex-col sm:flex-row gap-2">
        <input
          v-model.number="newGoalMinutes"
          type="number"
          min="1"
          placeholder="Meta em minutos (opcional)"
          class="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)] text-sm placeholder:text-[var(--color-text-muted)]"
        />

        <AppButton>
          <!-- <Plus :size="16" /> -->
          Adicionar
        </AppButton>
      </div>
    </form>

    <!-- Empty state -->
    <div
      v-if="taskStore.tasks.length === 0"
      class="card py-14 px-6 flex flex-col items-center text-center"
    >
      <div
        class="w-12 h-12 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-muted)] flex items-center justify-center mb-4"
      >
        <CircleAlert :size="22" />
      </div>

      <p class="text-sm font-medium">
        Nenhuma tarefa ainda
      </p>

      <p class="text-xs text-[var(--color-text-muted)] mt-1">
        Crie sua primeira tarefa para começar.
      </p>
    </div>

    <!-- Tasks -->
    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="task in taskStore.tasks"
        :key="task.id"
        class="card p-4 sm:p-5 transition-all hover:border-[var(--color-accent)]/25"
      >
        <div class="flex items-start gap-3">

          <!-- Status icon -->
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            :class="
              task.status === 'COMPLETED'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
            "
          >
            <CircleCheck
              v-if="task.status === 'COMPLETED'"
              :size="19"
            />

            <ListTodo
              v-else
              :size="19"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium break-words"
              :class="{
                'line-through text-[var(--color-text-muted)]':
                  task.status === 'COMPLETED',
              }"
            >
              {{ task.title }}
            </p>

            <div
              class="flex items-center gap-2 mt-1.5 text-xs text-[var(--color-text-muted)]"
            >
              <span>
                {{ task.completedPomodoros }}/{{ task.estimatedPomodoros }}
                pomodoros
              </span>

              <span
                v-if="task.status === 'COMPLETED'"
                class="text-emerald-500"
              >
                Concluída
              </span>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div class="mt-4">
          <TaskGoalProgress :task="task" />
        </div>

        <!-- Actions -->
        <div
          class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]"
        >
          <template v-if="task.status !== 'COMPLETED'">
            <AppButton
              variant="secondary"
              @click="openModal(task)"
            >
              <Play :size="15" />
              Focar
            </AppButton>

            <AppButton
              variant="secondary"
              @click="taskStore.complete(task.id)"
            >
              <Check :size="15" />
              Concluir
            </AppButton>
          </template>

          <AppButton
            v-else
            variant="ghost"
            @click="taskStore.reopen(task.id)"
          >
            <RotateCcw :size="15" />
            Reabrir
          </AppButton>

          <AppButton
            variant="ghost"
            class="ml-auto text-red-400 hover:text-red-300"
            @click="taskStore.remove(task.id)"
          >
            <Trash2 :size="15" />
            Excluir
          </AppButton>
        </div>
      </li>
    </ul>

    <StartFocusModal
      v-if="showModal"
      :task="modalTask"
      @close="showModal = false"
      @start="onStart"
    />
  </div>
</template>