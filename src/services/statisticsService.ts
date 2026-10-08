import { http } from './http'
import type { Goal, Statistics } from '@/types'

export const statisticsService = {
  async get() {
    const { data } = await http.get<Statistics>('/api/statistics')
    return data
  },
}

export const goalService = {
  async get() {
    const { data } = await http.get<Goal>('/api/goals')
    return data
  },
  async update(payload: { dailyFocusMinutes?: number; dailyPomodoros?: number; dailyTasks?: number }) {
    const { data } = await http.post<Goal>('/api/goals', payload)
    return data
  },
}
