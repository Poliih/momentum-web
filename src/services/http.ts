import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
})

let isRefreshing = false
let pendingQueue: Array<() => void> = []

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('momentum_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('momentum_refresh_token')
      if (!refreshToken) {
        clearSessionAndRedirect()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(http(originalRequest)))
        })
      }

      isRefreshing = true
      try {
        const { data } = await axios.post(
          `${http.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        )
        localStorage.setItem('momentum_access_token', data.accessToken)
        localStorage.setItem('momentum_refresh_token', data.refreshToken)
        pendingQueue.forEach((cb) => cb())
        pendingQueue = []
        return http(originalRequest)
      } catch (refreshError) {
        clearSessionAndRedirect()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function clearSessionAndRedirect() {
  localStorage.removeItem('momentum_access_token')
  localStorage.removeItem('momentum_refresh_token')
  localStorage.removeItem('momentum_user')
  window.location.href = '/login'
}
