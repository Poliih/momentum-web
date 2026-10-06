import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tagService } from '@/services/tagService'
import type { Tag, TagKind, TagWeeklyStat } from '@/types'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const weeklyStats = ref<TagWeeklyStat[]>([])

  async function fetchAll() {
    tags.value = await tagService.list()
  }

  async function create(name: string, color: string, kind: TagKind) {
    const tag = await tagService.create(name, color, kind)
    tags.value.push(tag)
    tags.value.sort((a, b) => a.name.localeCompare(b.name))
    return tag
  }

  async function remove(id: string) {
    await tagService.remove(id)
    tags.value = tags.value.filter((t) => t.id !== id)
  }

  async function fetchWeeklyStats() {
    weeklyStats.value = await tagService.weeklyBreakdown()
  }

  return { tags, weeklyStats, fetchAll, create, remove, fetchWeeklyStats }
})
