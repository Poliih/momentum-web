import { defineStore } from 'pinia'
import { ref } from 'vue'
import { focusService } from '@/services/focusService'
import type { FocusSession, FocusSessionType } from '@/types'

export const useFocusStore = defineStore('focus', () => {
  const activeSession = ref<FocusSession | null>(loadSession())
  const completedPomodorosInCycle = ref(0)

  function loadSession(): FocusSession | null {
    const raw = sessionStorage.getItem('momentum_active_session')
    return raw ? JSON.parse(raw) : null
  }

  function persist(session: FocusSession | null) {
    activeSession.value = session
    if (session) sessionStorage.setItem('momentum_active_session', JSON.stringify(session))
    else sessionStorage.removeItem('momentum_active_session')
  }

  async function start(type: FocusSessionType, plannedDurationSeconds: number, taskId?: string, tagId?: string) {
    const session = await focusService.start(type, plannedDurationSeconds, taskId, tagId)
    persist(session)
    return session
  }

  async function pause() {
    if (!activeSession.value) return
    persist(await focusService.pause(activeSession.value.id))
  }

  async function resume() {
    if (!activeSession.value) return
    persist(await focusService.resume(activeSession.value.id))
  }

  async function complete() {
    if (!activeSession.value) return
    const finished = await focusService.complete(activeSession.value.id)
    if (finished.type === 'FOCUS') completedPomodorosInCycle.value++
    persist(null)
    return finished
  }

  async function cancel() {
    if (!activeSession.value) return
    await focusService.cancel(activeSession.value.id)
    persist(null)
  }

  async function refresh() {
    if (!activeSession.value) return
    persist(await focusService.get(activeSession.value.id))
  }

  return { activeSession, completedPomodorosInCycle, start, pause, resume, complete, cancel, refresh }
})
