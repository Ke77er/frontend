<template>
  <div class="summary-card" :class="cardClass">
    <div class="card-icon">
      <i :class="icon"></i>
    </div>
    <div class="card-content">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">
        <ValueDisplay 
          v-if="format !== false" 
          :value="value" 
          type="currency" 
          emphasis 
        />
        <span v-else class="numeric-value">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ValueDisplay from './ValueDisplay.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  format: {
    type: Boolean,
    default: true
  }
})

const cardClass = computed(() => `summary-card--${props.color}`)
</script>

<style scoped>
.summary-card {
  background: var(--background-card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(139, 115, 85, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 115, 85, 0.15);
}

.summary-card--primary {
  border-left-color: var(--primary-color);
}

.summary-card--success {
  border-left-color: var(--success-color);
}

.summary-card--warning {
  border-left-color: var(--warning-color);
}

.summary-card--danger {
  border-left-color: var(--danger-color);
}

.summary-card--info {
  border-left-color: var(--info-color);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.summary-card--primary .card-icon {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
}

.summary-card--success .card-icon {
  background: linear-gradient(135deg, var(--success-color), var(--success-dark));
}

.summary-card--warning .card-icon {
  background: linear-gradient(135deg, var(--warning-color), var(--warning-dark));
}

.summary-card--danger .card-icon {
  background: linear-gradient(135deg, var(--danger-color), var(--danger-dark));
}

.summary-card--info .card-icon {
  background: linear-gradient(135deg, var(--info-color), var(--info-dark));
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 0.9rem;
  color: var(--neutral-500);
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-family: var(--font-primary);
}

.card-value {
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neutral-700);
}

.numeric-value {
  font-family: var(--font-primary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neutral-700);
}
</style>