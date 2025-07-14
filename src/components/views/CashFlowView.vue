Here's the fixed script with added missing closing brackets and proper whitespace:

```vue
<template>
  <!-- Template content remains unchanged -->
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { formatDateRange, formatPeriodTitle } from '../../utils/dateUtils'
import { formatCurrency, getValueClass } from '../../utils/formatUtils'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const loading = ref(false)
const showDetailsDialog = ref(false)
const selectedDetails = ref({
  categoria: '',
  periodo: '',
  total: 0,
  items: []
})

const { dataInicio, dataFim, empresaSelecionada } = useReadonlyParametros()
const { generateCashFlowData, getDetailsForPeriod, getHistoryData } = useCashFlowData()

const linhas = ref([])
const periodos = ref([])
const historyData = ref([])

const detailsTitle = computed(() => 
  `${selectedDetails.value.categoria} - ${selectedDetails.value.periodo}`
)

const totals = computed(() => {
  const realizado = linhas.value.reduce((sum, item) => {
    return sum + periodos.value
      .filter(p => p.type === 'realizado')
      .reduce((pSum, p) => pSum + (item[p.key] || 0), 0)
  }, 0)
  
  const previsto = linhas.value.reduce((sum, item) => {
    return sum + periodos.value
      .filter(p => p.type === 'previsto')
      .reduce((pSum, p) => pSum + (item[p.key] || 0), 0)
  }, 0)
  
  return {
    realizado,
    previsto,
    saldo: realizado + previsto
  }
})

const maxValue = computed(() => {
  if (historyData.value.length === 0) return 1000
  return Math.max(
    ...historyData.value.map(item => Math.max(Math.abs(item.entradas), Math.abs(item.saidas))),
    1000
  )
})

const maxBalance = computed(() => {
  if (historyData.value.length === 0) return 1000
  return Math.max(
    ...historyData.value.map(item => Math.abs(item.saldoAcumulado)),
    1000
  )
})

const balanceLinePoints = computed(() => {
  if (historyData.value.length === 0) return ''
  return historyData.value.map((item, index) => {
    const x = index * 20
    const y = 120 - (item.saldoAcumulado / maxBalance.value * 60)
    return `${x},${y}`
  }).join(' ')
})

const getPeriodHeaderClass = (periodo) => {
  const classes = ['period-header']
  if (periodo.type === 'realizado') classes.push('realizado-header')
  if (periodo.type === 'previsto') classes.push('previsto-header')
  if (periodo.isCurrentMonth || periodo.isCurrentDay) classes.push('current-period-header')
  return classes.join(' ')
}

const getPeriodCellClass = (periodo, valor, isSaldoInicial = false) => {
  const classes = ['period-cell']
  if (periodo.type === 'realizado') classes.push('realizado-cell')
  if (periodo.type === 'previsto') classes.push('previsto-cell')
  if (periodo.isCurrentMonth || periodo.isCurrentDay) classes.push('current-period-cell')
  if (valor !== 0) classes.push('clickable-value')
  if (isSaldoInicial) classes.push('saldo-inicial-cell')
  return classes.join(' ')
}

const showDetails = async (categoria, periodo, valor) => {
  if (valor === 0) return
  
  console.log('Clicou para ver detalhes:', { categoria, periodo: periodo.label, valor })
  
  const details = await getDetailsForPeriod(categoria, periodo)
  
  selectedDetails.value = {
    categoria,
    periodo: periodo.label,
    total: valor,
    items: details
  }
  
  showDetailsDialog.value = true
}

const updateData = async () => {
  if (!dataInicio.value || !dataFim.value) return
  
  loading.value = true
  try {
    console.log('Atualizando dados para empresa:', empresaSelecionada.value)
    
    const result = await generateCashFlowData(dataInicio.value, dataFim.value)
    linhas.value = result.linhas
    periodos.value = result.periodos

    historyData.value = await getHistoryData(dataInicio.value, dataFim.value)
    
    console.log('Dados atualizados - Linhas:', linhas.value.length, 'Períodos:', periodos.value.length, 'Histórico:', historyData.value.length)
  } finally {
    loading.value = false
  }
}

watch([dataInicio, dataFim, empresaSelecionada], updateData, { immediate: true })
</script>

<style scoped>
/* Style content remains unchanged */
</style>
```

The main fixes were:
1. Removed duplicate `getPeriodCellClass` function declaration
2. Fixed the function definition syntax
3. Added proper closing brackets for all functions and blocks
4. Maintained consistent whitespace and indentation