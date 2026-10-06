<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTagStore } from '@/stores/tag'
import AppButton from '@/components/ui/AppButton.vue'
import type { Task } from '@/types'

const props = defineProps<{ task?: Task | null }>()
const emit = defineEmits<{ close: []; start: [minutes: number, tagId: string | null] }>()

const tagStore = useTagStore()
const presets = [25, 45, 50, 90]
const selectedMinutes = ref(25)
const customMinutes = ref<number | null>(null)
const selectedTagId = ref<string | null>(null)

const newTagName = ref('')
const newTagKind = ref<'PRODUCTIVE' | 'REWARD' | 'NEUTRAL'>('PRODUCTIVE')
const showNewTag = ref(false)

onMounted(() => tagStore.fetchAll())

const effectiveMinutes = computed(() => customMinutes.value ?? selectedMinutes.value)

function pickPreset(minutes: number) {
  selectedMinutes.value = minutes
  customMinutes.value = null
}

async function createTag() {
  if (!newTagName.value.trim()) return
  const colors = ['#6c5ce7', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const tag = await tagStore.create(newTagName.value.trim(), color, newTagKind.value)
  selectedTagId.value = tag.id
  newTagName.value = ''
  showNewTag.value = false
}

function confirm() {
  emit('start', effectiveMinutes.value, selectedTagId.value)
}
</script>

<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" @click.self="emit('close')">
    <div class="card w-full max-w-md p-6 space-y-5">
      <div>
        <h2 class="font-semibold text-lg">Começar Foco</h2>
        <p v-if="props.task" class="text-sm text-[var(--color-text-muted)] mt-1">{{ props.task.title }}</p>
      </div>

      <div>
        <p class="text-sm text-[var(--color-text-muted)] mb-2">Duração</p>
        <div class="grid grid-cols-4 gap-2">
          <button v-for="p in presets" :key="p" @click="pickPreset(p)"
            class="py-2 rounded-lg text-sm transition-base"
            :class="effectiveMinutes === p ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'">
            {{ p }}min
          </button>
        </div>
        <input v-model.number="customMinutes" type="number" min="1" placeholder="Ou digite os minutos..."
          class="w-full mt-2 px-3 py-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)] text-sm" />
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-[var(--color-text-muted)]">Tag (opcional)</p>
          <button class="text-xs text-[var(--color-accent)]" @click="showNewTag = !showNewTag">+ Nova tag</button>
        </div>

        <div class="flex flex-wrap gap-2">
          <button @click="selectedTagId = null"
            class="px-3 py-1.5 rounded-full text-xs transition-base"
            :class="!selectedTagId ? 'bg-[var(--color-surface-2)] ring-1 ring-[var(--color-accent)]' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'">
            Sem tag
          </button>
          <button v-for="tag in tagStore.tags" :key="tag.id" @click="selectedTagId = tag.id"
            class="px-3 py-1.5 rounded-full text-xs transition-base flex items-center gap-1.5"
            :class="selectedTagId === tag.id ? 'ring-1 ring-[var(--color-accent)]' : ''"
            :style="{ backgroundColor: tag.color + '26', color: tag.color }">
            <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tag.color }" />
            {{ tag.name }}
          </button>
        </div>

        <div v-if="showNewTag" class="mt-3 flex gap-2">
          <input v-model="newTagName" placeholder="Nome (ex: Jogos, Estudo)"
            class="flex-1 px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none text-sm" />
          <select v-model="newTagKind" class="px-2 py-1.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm">
            <option value="PRODUCTIVE">Produtivo</option>
            <option value="REWARD">Recompensa</option>
            <option value="NEUTRAL">Neutro</option>
          </select>
          <AppButton variant="secondary" @click="createTag">Criar</AppButton>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <AppButton variant="ghost" @click="emit('close')">Cancelar</AppButton>
        <AppButton class="flex-1" @click="confirm">Começar ({{ effectiveMinutes }}min)</AppButton>
      </div>
    </div>
  </div>
</template>
