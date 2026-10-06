<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function submit() {
  error.value = ''
  loading.value = true

  try {
    await auth.login(email.value, password.value)
    await router.push('/')
  } catch (e: unknown) {
    error.value = 'Não foi possível entrar. Verifique seu email e senha.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="card w-full max-w-sm p-8">

      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)] text-xl"
        >
          ✦
        </div>

        <h1 class="text-2xl font-semibold">
          Momentum
        </h1>

        <p class="mt-1 text-sm text-[var(--color-text-muted)]">
          Continue no ritmo.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="submit">

        <div>
          <label
            for="email"
            class="mb-1.5 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="seu@email.com"
            required
            class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 outline-none transition focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label
            for="password"
            class="mb-1.5 block text-sm font-medium"
          >
            Senha
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Sua senha"
            required
            class="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 outline-none transition focus:border-[var(--color-accent)]"
          />
        </div>

        <p
          v-if="error"
          role="alert"
          class="text-sm text-[var(--color-danger)]"
        >
          {{ error }}
        </p>

        <AppButton
          class="w-full"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </AppButton>
      </form>

      <p class="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        Ainda não tem uma conta?
        <router-link
          to="/register"
          class="text-[var(--color-accent)] hover:underline"
        >
          Criar conta
        </router-link>
      </p>

    </div>
  </div>
</template>