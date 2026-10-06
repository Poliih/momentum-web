import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useFocusStore } from '@/stores/focus'

export function usePomodoro() {
  const focusStore = useFocusStore()
  const now = ref(Date.now())
  let intervalId: number | undefined

  onMounted(() => {
    intervalId = window.setInterval(() => (now.value = Date.now()), 1000)
  })
  onBeforeUnmount(() => {
    if (intervalId) window.clearInterval(intervalId)
  })

  const remainingSeconds = computed(() => {
    const session = focusStore.activeSession
    if (!session) return 0
    if (session.status === 'COMPLETED' || session.status === 'CANCELLED') return 0

    const startedAtMs = new Date(session.startedAt).getTime()
    const referenceMs = session.status === 'PAUSED' && session.pausedAt
      ? new Date(session.pausedAt).getTime()
      : now.value

    const elapsedTotal = Math.floor((referenceMs - startedAtMs) / 1000)
    const effectiveElapsed = elapsedTotal - session.accumulatedPauseSeconds
    const remaining = session.plannedDurationSeconds - effectiveElapsed
    return Math.max(remaining, 0)
  })

  const progress = computed(() => {
    const session = focusStore.activeSession
    if (!session || session.plannedDurationSeconds === 0) return 0
    return Math.min(1 - remainingSeconds.value / session.plannedDurationSeconds, 1)
  })

  const formatted = computed(() => {
    const s = remainingSeconds.value
    const mm = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${mm}:${ss}`
  })

  const isFinished = computed(() =>
    !!focusStore.activeSession && remainingSeconds.value <= 0 && focusStore.activeSession.status === 'RUNNING'
  )

  return { activeSession: computed(() => focusStore.activeSession), remainingSeconds, progress, formatted, isFinished }
}
