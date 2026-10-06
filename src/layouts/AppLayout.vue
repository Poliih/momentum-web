<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BarChart3,
  History,
  ListTodo,
  LogOut,
  Menu,
  Moon,
  Sun,
  Target,
  X,
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'

const auth = useAuthStore()
const router = useRouter()

const { isDark, toggle } = useDarkMode()

const mobileMenuOpen = ref(false)

function logout() {
  auth.logout()
  router.push('/login')
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen">

    <!-- Navbar -->
    <nav
      class="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md"
    >
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
      >
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2.5 group"
          @click="closeMobileMenu"
        >
          <div
            class="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center transition-transform group-hover:scale-105"
          >
            <Target :size="19" />
          </div>

          <span class="font-semibold tracking-tight">
            Momentum
          </span>
        </router-link>

        <!-- Desktop navigation -->
        <div class="hidden md:flex items-center gap-1">
          <router-link
            to="/tasks"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            active-class="bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          >
            <ListTodo :size="17" />
            Tarefas
          </router-link>

          <router-link
            to="/statistics"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            active-class="bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          >
            <BarChart3 :size="17" />
            Estatísticas
          </router-link>

          <router-link
            to="/history"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            active-class="bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          >
            <History :size="17" />
            Histórico
          </router-link>
        </div>

        <!-- Desktop actions -->
        <div class="hidden md:flex items-center gap-1">
          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            :title="isDark ? 'Modo claro' : 'Modo escuro'"
            :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
            @click="toggle"
          >
            <Sun
              v-if="isDark"
              :size="18"
            />

            <Moon
              v-else
              :size="18"
            />
          </button>

          <button
            type="button"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
            @click="logout"
          >
            <LogOut :size="17" />
            Sair
          </button>
        </div>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          aria-label="Abrir menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X
            v-if="mobileMenuOpen"
            :size="21"
          />

          <Menu
            v-else
            :size="21"
          />
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-[var(--color-border)] px-4 py-3 space-y-1"
      >
        <router-link
          to="/tasks"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          active-class="bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          @click="closeMobileMenu"
        >
          <ListTodo :size="18" />
          Tarefas
        </router-link>

        <router-link
          to="/statistics"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          active-class="bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          @click="closeMobileMenu"
        >
          <BarChart3 :size="18" />
          Estatísticas
        </router-link>

        <router-link
          to="/history"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          active-class="bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
          @click="closeMobileMenu"
        >
          <History :size="18" />
          Histórico
        </router-link>

        <div class="h-px bg-[var(--color-border)] my-2" />

        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
          @click="toggle"
        >
          <Sun
            v-if="isDark"
            :size="18"
          />

          <Moon
            v-else
            :size="18"
          />

          {{ isDark ? 'Modo claro' : 'Modo escuro' }}
        </button>

        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 transition-colors hover:bg-red-500/10"
          @click="logout"
        >
          <LogOut :size="18" />
          Sair
        </button>
      </div>
    </nav>

    <router-view />
  </div>
</template>