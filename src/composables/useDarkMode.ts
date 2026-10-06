import { ref, watch } from 'vue'

const isDark = ref(localStorage.getItem('momentum_theme') !== 'light')

function apply() {
  document.documentElement.classList.toggle('light', !isDark.value)
  localStorage.setItem('momentum_theme', isDark.value ? 'dark' : 'light')
}
apply()

watch(isDark, apply)

export function useDarkMode() {
  function toggle() { isDark.value = !isDark.value }
  return { isDark, toggle }
}
