<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean }>(), {
  variant: 'primary',
})
</script>

<template>
  <button
    :disabled="disabled"
    class="px-4 py-2 rounded-xl font-medium text-sm transition-base disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-[var(--color-accent)] text-white hover:opacity-90': variant === 'primary',
      'bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-border)]': variant === 'secondary',
      'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
