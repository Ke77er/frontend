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
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid;
  min-height: 100px;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.summary-card--primary {
  border-left-color: #3b82f6;
}

.summary-card--success {
  border-left-color: #10b981;
}

.summary-card--warning {
  border-left-color: #f59e0b;
}

.summary-card--danger {
  border-left-color: #ef4444;
}

.summary-card--info {
  border-left-color: #06b6d4;
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
  flex-shrink: 0;
}

.summary-card--primary .card-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.summary-card--success .card-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.summary-card--warning .card-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.summary-card--danger .card-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.summary-card--info .card-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-weight: 500;
  word-wrap: break-word;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  word-wrap: break-word;
}

.numeric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .summary-card {
    padding: 1.25rem;
    gap: 0.75rem;
    min-height: 90px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .card-title {
    font-size: 0.85rem;
  }
  
  .card-value {
    font-size: 1.25rem;
  }
  
  .numeric-value {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .summary-card {
    padding: 1rem;
    gap: 0.5rem;
    min-height: 80px;
  }
  
  .card-icon {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
  
  .card-title {
    font-size: 0.8rem;
    margin-bottom: 0.125rem;
  }
  
  .card-value {
    font-size: 1.1rem;
  }
  
  .numeric-value {
    font-size: 1.1rem;
  }
}

/* Prevent hover effects on touch devices */
@media (hover: none) and (pointer: coarse) {
  .summary-card:hover {
    transform: none;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>