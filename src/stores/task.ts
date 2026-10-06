import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService, type TaskPayload } from '@/services/taskService'
import type { Task, TaskStatus } from '@/types'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  async function fetchAll(status?: TaskStatus) {
    loading.value = true
    try {
      tasks.value = await taskService.list(status)
    } finally {
      loading.value = false
    }
  }

  async function create(payload: TaskPayload) {
    const task = await taskService.create(payload)
    tasks.value.unshift(task)
    return task
  }

  async function update(id: string, payload: TaskPayload) {
    const updated = await taskService.update(id, payload)
    replaceInList(updated)
    return updated
  }

  async function remove(id: string) {
    await taskService.remove(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  async function complete(id: string) {
    replaceInList(await taskService.complete(id))
  }

  async function reopen(id: string) {
    replaceInList(await taskService.reopen(id))
  }

  async function addItem(taskId: string, title: string) {
    replaceInList(await taskService.addItem(taskId, title))
  }

  async function toggleItem(taskId: string, itemId: string) {
    replaceInList(await taskService.toggleItem(taskId, itemId))
  }

  async function removeItem(taskId: string, itemId: string) {
    await taskService.removeItem(taskId, itemId)
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) task.items = task.items.filter((i) => i.id !== itemId)
  }

  function replaceInList(task: Task) {
    const idx = tasks.value.findIndex((t) => t.id === task.id)
    if (idx >= 0) tasks.value[idx] = task
    else tasks.value.unshift(task)
  }

  return { tasks, loading, fetchAll, create, update, remove, complete, reopen, addItem, toggleItem, removeItem }
})
