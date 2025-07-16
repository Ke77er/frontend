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
  background: linear-gradient(135deg, var(--wood-50), white);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(93, 64, 55, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border: 2px solid var(--wood-200);
  border-left: 6px solid;
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), transparent);
  pointer-events: none;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(93, 64, 55, 0.2);
  border-color: var(--wood-300);
}

.summary-card--primary {
  border-left-color: var(--wood-600);
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
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.summary-card--primary .card-icon {
  background: linear-gradient(135deg, var(--wood-600), var(--wood-700));
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
  color: var(--neutral-600);
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-family: 'Georgia', 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary-color);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.numeric-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary-color);
  font-family: 'Georgia', 'Times New Roman', serif;
}
</style>