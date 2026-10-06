import { http } from './http'
import type { User } from '@/types'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
  name: string
  email: string
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await http.post<AuthResponse>('/auth/register', { name, email, password })
    return data
  },
  async login(email: string, password: string) {
    const { data } = await http.post<AuthResponse>('/auth/login', { email, password })
    return data
  },
  toUser(res: AuthResponse): User {
    return { id: res.userId, name: res.name, email: res.email }
  },
}
