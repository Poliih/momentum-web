import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(loadUser())
  const isAuthenticated = computed(() => !!user.value)

  function loadUser(): User | null {
    const raw = localStorage.getItem('momentum_user')
    return raw ? JSON.parse(raw) : null
  }

  function persist(u: User, accessToken: string, refreshToken: string) {
    user.value = u
    localStorage.setItem('momentum_user', JSON.stringify(u))
    localStorage.setItem('momentum_access_token', accessToken)
    localStorage.setItem('momentum_refresh_token', refreshToken)
  }

  async function login(email: string, password: string) {
    const res = await authService.login(email, password)
    persist(authService.toUser(res), res.accessToken, res.refreshToken)
  }

  async function register(name: string, email: string, password: string) {
    const res = await authService.register(name, email, password)
    persist(authService.toUser(res), res.accessToken, res.refreshToken)
  }

  function logout() {
    user.value = null
    localStorage.removeItem('momentum_user')
    localStorage.removeItem('momentum_access_token')
    localStorage.removeItem('momentum_refresh_token')
  }

  return { user, isAuthenticated, login, register, logout }
})
