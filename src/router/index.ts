import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { public: true } },
    { path: '/focus', name: 'focus', component: () => import('@/views/FocusModeView.vue') },
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
        { path: 'tasks', name: 'tasks', component: () => import('@/views/TasksView.vue') },
        { path: 'statistics', name: 'statistics', component: () => import('@/views/StatisticsView.vue') },
        { path: 'history', name: 'history', component: () => import('@/views/HistoryView.vue') },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return { name: 'login' }
  if (to.meta.public && auth.isAuthenticated) return { name: 'dashboard' }
})

export default router
