import { http } from './http'
import type { FocusSession, FocusSessionType, PageResponse } from '@/types'

export const focusService = {
  async start(type: FocusSessionType, plannedDurationSeconds: number, taskId?: string, tagId?: string) {
    const { data } = await http.post<FocusSession>('/focus/start', { type, plannedDurationSeconds, taskId, tagId })
    return data
  },
  async get(id: string) {
    const { data } = await http.get<FocusSession>(`/focus/${id}`)
    return data
  },
  async pause(id: string) {
    const { data } = await http.post<FocusSession>(`/focus/${id}/pause`)
    return data
  },
  async resume(id: string) {
    const { data } = await http.post<FocusSession>(`/focus/${id}/resume`)
    return data
  },
  async complete(id: string) {
    const { data } = await http.post<FocusSession>(`/focus/${id}/complete`)
    return data
  },
  async cancel(id: string) {
    const { data } = await http.post<FocusSession>(`/focus/${id}/cancel`)
    return data
  },
  async history() {
    const { data } = await http.get<FocusSession[]>('/focus/history')
    return data
  },
  async historyPaged(page: number, size: number, tagId?: string) {
    const { data } = await http.get<PageResponse<FocusSession>>('/focus/history/page', {
      params: { page, size, tagId },
    })
    return data
  },
}
