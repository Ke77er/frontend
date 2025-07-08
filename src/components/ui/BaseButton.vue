<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <div class="button-content">
      <div v-if="loading" class="loading-spinner"></div>
      <i v-else-if="icon" :class="icon" class="button-icon"></i>
      <span v-if="$slots.default || label" class="button-text">
        <slot>{{ label }}</slot>
      </span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
    'base-button--full-width': props.fullWidth,
    'base-button--icon-only': props.icon && !props.label && !props.$slots?.default
  }
])

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  user-select: none;
  outline: none;
  overflow: hidden;
}

.base-button:focus-visible {
  box-shadow: var(--shadow-focus);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.button-icon {
  flex-shrink: 0;
}

.button-text {
  white-space: nowrap;
}

.loading-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Sizes */
.base-button--xs {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  min-height: 24px;
}

.base-button--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  min-height: 32px;
}

.base-button--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  min-height: 40px;
}

.base-button--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  min-height: 48px;
}

.base-button--xl {
  padding: var(--spacing-5) var(--spacing-8);
  font-size: var(--font-size-xl);
  min-height: 56px;
}

.base-button--icon-only {
  aspect-ratio: 1;
  padding: var(--spacing-3);
}

.base-button--full-width {
  width: 100%;
}

/* Variants */
.base-button--primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: var(--color-primary);
}

.base-button--primary:hover:not(.base-button--disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--secondary {
  background: var(--color-secondary);
  color: var(--color-secondary-foreground);
  border-color: var(--color-secondary);
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background: var(--color-secondary-hover);
  border-color: var(--color-secondary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--success {
  background: var(--color-success);
  color: var(--color-success-foreground);
  border-color: var(--color-success);
}

.base-button--success:hover:not(.base-button--disabled) {
  background: var(--color-success-hover);
  border-color: var(--color-success-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--warning {
  background: var(--color-warning);
  color: var(--color-warning-foreground);
  border-color: var(--color-warning);
}

.base-button--warning:hover:not(.base-button--disabled) {
  background: var(--color-warning-hover);
  border-color: var(--color-warning-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--danger {
  background: var(--color-danger);
  color: var(--color-danger-foreground);
  border-color: var(--color-danger);
}

.base-button--danger:hover:not(.base-button--disabled) {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.base-button--outline:hover:not(.base-button--disabled) {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--ghost {
  background: transparent;
  color: var(--color-text);
  border-color: transparent;
}

.base-button--ghost:hover:not(.base-button--disabled) {
  background: var(--color-muted);
  transform: translateY(-1px);
}

/* States */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.base-button--loading {
  cursor: wait;
}
</style>