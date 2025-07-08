<template>
  <BaseButton
    :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
    variant="ghost"
    size="sm"
    @click="toggleTheme"
    :title="isDarkMode ? 'Modo claro' : 'Modo escuro'"
    class="theme-toggle"
  />
</template>

<script setup>
import { useTheme } from '../../composables/useTheme'
import BaseButton from './BaseButton.vue'

const { isDarkMode, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  border-radius: 50%;
  aspect-ratio: 1;
}

.theme-toggle:hover {
  transform: scale(1.1);
}
</style>