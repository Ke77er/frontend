<template>
  <span class="value-display" :class="valueClass">
    {{ formattedValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'currency',
    validator: (value) => ['currency', 'number', 'percentage'].includes(value)
  },
  emphasis: {
    type: Boolean,
    default: false
  }
})

const formattedValue = computed(() => {
  if (props.type === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(props.value)
  }
  
  if (props.type === 'percentage') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2
    }).format(props.value / 100)
  }
  
  return new Intl.NumberFormat('pt-BR').format(props.value)
})

const valueClass = computed(() => {
  const classes = []
  
  if (props.emphasis) {
    classes.push('value-display--emphasis')
  }
  
  if (props.value > 0) {
    classes.push('value-display--positive')
  } else if (props.value < 0) {
    classes.push('value-display--negative')
  } else {
    classes.push('value-display--neutral')
  }
  
  return classes
})
</script>

<style scoped>
.value-display {
  font-family: var(--font-primary);
  font-weight: 500;
  transition: all 0.2s ease;
}

.value-display--emphasis {
  font-weight: 700;
  font-size: 1.1em;
}

.value-display--positive {
  color: var(--success-color);
}

.value-display--negative {
  color: var(--danger-color);
}

.value-display--neutral {
  color: var(--neutral-500);
}
</style>