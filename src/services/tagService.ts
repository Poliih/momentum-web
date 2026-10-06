import { http } from './http'
import type { Tag, TagKind, TagWeeklyStat } from '@/types'

export const tagService = {
  async list() {
    const { data } = await http.get<Tag[]>('/tags')
    return data
  },
  async create(name: string, color: string, kind: TagKind) {
    const { data } = await http.post<Tag>('/tags', { name, color, kind })
    return data
  },
  async remove(id: string) {
    await http.delete(`/tags/${id}`)
  },
  async weeklyBreakdown() {
    const { data } = await http.get<TagWeeklyStat[]>('/statistics/tags/weekly')
    return data
  },
}
