import { http } from './http'
import type { Task, TaskPriority, TaskStatus } from '@/types'

export interface TaskPayload {
  title: string
  description?: string
  priority?: TaskPriority
  estimatedPomodoros?: number
  goalMinutes?: number | null
}

export const taskService = {
  async list(status?: TaskStatus) {
    const { data } = await http.get<Task[]>('/api/tasks', { params: status ? { status } : {} })
    return data
  },
  async create(payload: TaskPayload) {
    const { data } = await http.post<Task>('/api/tasks', payload)
    return data
  },
  async update(id: string, payload: TaskPayload) {
    const { data } = await http.put<Task>(`/api/tasks/${id}`, payload)
    return data
  },
  async remove(id: string) {
    await http.delete(`/tasks/${id}`)
  },
  async complete(id: string) {
    const { data } = await http.post<Task>(`/api/tasks/${id}/complete`)
    return data
  },
  async reopen(id: string) {
    const { data } = await http.post<Task>(`/api/tasks/${id}/reopen`)
    return data
  },
  async addItem(taskId: string, title: string) {
    const { data } = await http.post<Task>(`/api/tasks/${taskId}/items`, { title })
    return data
  },
  async toggleItem(taskId: string, itemId: string) {
    const { data } = await http.patch<Task>(`/api/tasks/${taskId}/items/${itemId}/toggle`)
    return data
  },
  async removeItem(taskId: string, itemId: string) {
    await http.delete(`/tasks/${taskId}/items/${itemId}`)
  },
}
