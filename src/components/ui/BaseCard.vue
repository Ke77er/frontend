<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div class="card-content">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined', 'ghost'].includes(value)
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--padding-${props.padding}`,
  {
    'base-card--hover': props.hover
  }
])
</script>

<style scoped>
.base-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.base-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Variants */
.base-card--default {
  box-shadow: var(--shadow-sm);
}

.base-card--elevated {
  box-shadow: var(--shadow-md);
  border: none;
}

.base-card--outlined {
  border: 2px solid var(--color-border);
  box-shadow: none;
}

.base-card--ghost {
  background: transparent;
  border: none;
  box-shadow: none;
}

/* Padding */
.base-card--padding-none .card-content {
  padding: 0;
}

.base-card--padding-sm .card-content {
  padding: var(--spacing-3);
}

.base-card--padding-md .card-content {
  padding: var(--spacing-4);
}

.base-card--padding-lg .card-content {
  padding: var(--spacing-6);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-4) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-4);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.card-actions {
  display: flex;
  gap: var(--spacing-2);
}

.card-footer {
  padding: 0 var(--spacing-4) var(--spacing-4);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
}
</style>