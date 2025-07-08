<template>
  <div :class="spinnerClasses">
    <div class="spinner-circle"></div>
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: null
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const spinnerClasses = computed(() => [
  'loading-spinner',
  `loading-spinner--${props.size}`,
  {
    'loading-spinner--overlay': props.overlay
  }
])
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
}

.loading-spinner--overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.spinner-circle {
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner--xs .spinner-circle {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-spinner--sm .spinner-circle {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.loading-spinner--md .spinner-circle {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.loading-spinner--lg .spinner-circle {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.loading-spinner--xl .spinner-circle {
  width: 64px;
  height: 64px;
  border-width: 4px;
}

.spinner-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>