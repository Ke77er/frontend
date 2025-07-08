<template>
  <div class="cash-flow-view">
    <!-- Resumo Compacto -->
    <div class="summary-section">
      <div class="summary-cards">
        <div class="summary-card success">
          <div class="card-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Realizado</div>
            <div class="card-value">
              <ValueDisplay :value="totals.realizado" type="currency" emphasis />
            </div>
          </div>
        </div>
        
        <div class="summary-card warning">
          <div class="card-icon">
            <i class="pi pi-clock"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Previsto</div>
            <div class="card-value">
              <ValueDisplay :value="totals.previsto" type="currency" emphasis />
            </div>
          </div>
        </div>
        
        <div class="summary-card" :class="totals.saldo >= 0 ? 'success' : 'danger'">
          <div class="card-icon">
            <i class="pi pi-wallet"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Saldo Total</div>
            <div class="card-value">
              <ValueDisplay :value="totals.saldo" type="currency" emphasis />
            </div>
          </div>
        </div>
      </div>
      
      <div class="period-info">
        <i class="pi pi-calendar"></i>
        <span>{{ formatDateRange(dataInicio, dataFim) }}</span>
      </div>
    </div>

    <!-- Rest of the template content -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { format, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const { dataInicio, dataFim } = useReadonlyParametros()
const { generateCashFlowData } = useCashFlowData()

// Initialize reactive data
const cashFlowData = ref({
  linhas: [],
  periodos: []
})

// Computed property for totals
const totals = computed(() => {
  if (!cashFlowData.value || !cashFlowData.value.linhas) {
    return {
      realizado: 0,
      previsto: 0,
      saldo: 0
    }
  }

  let realizado = 0
  let previsto = 0

  cashFlowData.value.linhas.forEach(linha => {
    if (linha.periodos) {
      linha.periodos.forEach(periodo => {
        if (periodo.realizado) realizado += periodo.realizado
        if (periodo.previsto) previsto += periodo.previsto
      })
    }
  })

  return {
    realizado,
    previsto,
    saldo: realizado + previsto
  }
})

// Function to format date range
const formatDateRange = (inicio, fim) => {
  if (!inicio || !fim) return ''
  return `${format(inicio, 'dd/MM/yyyy', { locale: ptBR })} - ${format(fim, 'dd/MM/yyyy', { locale: ptBR })}`
}

// Watch for parameter changes and load data
watch([dataInicio, dataFim], async () => {
  if (dataInicio.value && dataFim.value) {
    try {
      cashFlowData.value = await generateCashFlowData()
    } catch (error) {
      console.error('Error loading cash flow data:', error)
      cashFlowData.value = { linhas: [], periodos: [] }
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* All the styles remain the same */
</style>