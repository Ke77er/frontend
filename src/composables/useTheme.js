import { ref, computed, watch } from 'vue'

const isDarkMode = ref(false)
const isLoading = ref(false)

// Carregar preferência salva
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  isDarkMode.value = savedTheme === 'dark'
} else {
  // Detectar preferência do sistema
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Aplicar tema inicial
document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')

export function useTheme() {
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const setTheme = (theme) => {
    isDarkMode.value = theme === 'dark'
  }

  const currentTheme = computed(() => isDarkMode.value ? 'dark' : 'light')

  // Watch para mudanças no tema
  watch(isDarkMode, (newValue) => {
    document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  }, { immediate: true })

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  return {
    isDarkMode,
    currentTheme,
    toggleTheme,
    setTheme,
    isLoading,
    setLoading
  }
}