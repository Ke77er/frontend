<template>
  <div class="date-display">
    <span class="date-value">{{ formattedDate }}</span>
    <span v-if="showDaysOverdue && daysOverdue > 0" class="days-overdue">
      {{ daysOverdue }} dias
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, differenceInDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps({
  date: {
    type: String,
    required: true
  },
  showDaysOverdue: {
    type: Boolean,
    default: false
  },
  allowEmpty: {
    type: Boolean,
    default: false
  }
})

const formattedDate = computed(() => {
  if (!props.date && props.allowEmpty) {
    return '-'
  }
  
  try {
    const date = parseISO(props.date)
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return props.date
  }
})

const daysOverdue = computed(() => {
  if (!props.showDaysOverdue || !props.date) return 0
  
  try {
    const date = parseISO(props.date)
    const today = new Date()
    return Math.max(0, differenceInDays(today, date))
  } catch {
    return 0
  }
})
</script>

<style scoped>
.date-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-value {
  font-weight: 500;
  color: #334155;
}

.days-overdue {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 600;
  background: #fee2e2;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
}
</style>