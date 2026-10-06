export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type FocusSessionType = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'
export type FocusSessionStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
export type TagKind = 'PRODUCTIVE' | 'REWARD' | 'NEUTRAL'

export interface User {
  id: string
  name: string
  email: string
}

export interface TaskItem {
  id: string
  title: string
  completed: boolean
  position: number
  completedAt: string | null
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  estimatedPomodoros: number
  completedPomodoros: number
  goalMinutes: number | null
  focusedMinutes: number
  createdAt: string
  updatedAt: string
  completedAt: string | null
  items: TaskItem[]
}

export interface FocusSession {
  id: string
  taskId: string | null
  tagId: string | null
  type: FocusSessionType
  status: FocusSessionStatus
  plannedDurationSeconds: number
  startedAt: string
  pausedAt: string | null
  accumulatedPauseSeconds: number
  endedAt: string | null
  actualDurationSeconds: number | null
  remainingSeconds: number
}

export interface Statistics {
  totalFocusSeconds: number
  totalPomodoros: number
  completedSessions: number
  completedTasks: number
  averageDailyMinutes: number
  currentStreak: number
  longestStreak: number
  focusSecondsByWeekday: Record<string, number>
}

export interface Goal {
  id: string
  dailyFocusMinutes: number
  dailyPomodoros: number
  dailyTasks: number
  todayFocusMinutes: number
  todayPomodoros: number
  todayCompletedTasks: number
}

export interface Tag {
  id: string
  name: string
  color: string
  kind: TagKind
}

export interface TagWeeklyStat {
  tagId: string
  tagName: string
  color: string
  kind: TagKind
  totalSeconds: number
  sessionCount: number
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
