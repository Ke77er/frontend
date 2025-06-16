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

    <!-- Tabela de Fluxo -->
    <div class="table-container">
      <DataTable
        :value="linhas"
        class="cash-flow-table"
        :paginator="true"
        :rows="15"
        responsiveLayout="scroll"
        stripedRows
        showGridlines
        :loading="loading"
        :scrollable="true"
        scrollHeight="600px"
      >
        <Column field="categoria" header="Categoria" :frozen="true" style="min-width: 280px">
          <template #body="{ data }">
            <div class="category-cell">
              <div class="category-icon">
                <i class="pi pi-tag"></i>
              </div>
              <span class="category-name">{{ data.categoria }}</span>
            </div>
          </template>
        </Column>
        
        <Column 
          v-for="periodo in periodos" 
          :key="periodo.key"
          :field="periodo.key"
          :header="periodo.label"
          style="min-width: 140px"
          :class="periodo.isCurrentMonth ? 'current-month-column' : ''"
        >
          <template #body="{ data }">
            <div class="value-cell" @click="showDetails(data.categoria, periodo, data[periodo.key])">
              <ValueDisplay 
                :value="data[periodo.key] || 0" 
                type="currency" 
                :class="{ 'clickable-value': data[periodo.key] !== 0 }"
              />
            </div>
          </template>
        </Column>
        
        <Column field="total" header="Total" style="min-width: 160px" :frozen="true" alignFrozen="right">
          <template #body="{ data }">
            <div class="total-cell">
              <ValueDisplay :value="data.total" type="currency" emphasis />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog de Detalhes -->
    <Dialog 
      v-model:visible="showDetailsDialog" 
      :header="detailsTitle"
      :modal="true"
      :style="{ width: '700px' }"
      class="details-dialog"
    >
      <div class="details-content">
        <div class="details-summary">
          <div class="summary-item">
            <span class="summary-label">Categoria:</span>
            <span class="summary-value">{{ selectedDetails.categoria }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Período:</span>
            <span class="summary-value">{{ selectedDetails.periodo }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total:</span>
            <ValueDisplay :value="selectedDetails.total" type="currency" emphasis />
          </div>
        </div>

        <DataTable 
          :value="selectedDetails.items" 
          class="details-table"
          :paginator="true"
          :rows="10"
          stripedRows
          :loading="detailsLoading"
        >
          <Column field="data" header="Data" style="min-width: 100px">
            <template #body="{ data }">
              <DateDisplay :date="data.data" />
            </template>
          </Column>
          <Column field="pessoa" header="Pessoa" style="min-width: 180px" />
          <Column field="valor" header="Valor" style="min-width: 120px">
            <template #body="{ data }">
              <ValueDisplay :value="data.valor" type="currency" />
            </template>
          </Column>
          <Column field="status" header="Status" style="min-width: 100px">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="data.status === 'Realizado' ? 'success' : 'warning'"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCashFlowData } from '../../composables/useCashFlowData'
import { useReadonlyParametros } from '../../composables/useParametros'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ValueDisplay from '../common/ValueDisplay.vue'
import DateDisplay from '../common/DateDisplay.vue'

const loading = ref(false)
const detailsLoading = ref(false)
const showDetailsDialog = ref(false)
const selectedDetails = ref({
  categoria: '',
  periodo: '',
  total: 0,
  items: []
})

const { dataInicio, dataFim } = useReadonlyParametros()
const { generateCashFlowData, getDetailsForPeriod } = useCashFlowData()

const linhas = ref([])
const periodos = ref([])

const detailsTitle = computed(() => 
  `Detalhes - ${selectedDetails.value.categoria} (${selectedDetails.value.periodo})`
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

const formatDateRange = (inicio, fim) => {
  if (!inicio || !fim) return ''
  
  const formatInicio = format(inicio, 'dd/MM/yyyy', { locale: ptBR })
  const formatFim = format(fim, 'dd/MM/yyyy', { locale: ptBR })
  
  return `${formatInicio} - ${formatFim}`
}

const showDetails = async (categoria, periodo, valor) => {
  if (valor === 0) return
  
  // Limpar dados anteriores imediatamente
  selectedDetails.value = {
    categoria: '',
    periodo: '',
    total: 0,
    items: []
  }
  
  // Mostrar o dialog com loading
  showDetailsDialog.value = true
  detailsLoading.value = true
  
  try {
    // Buscar novos dados
    const details = await getDetailsForPeriod(categoria, periodo)
    
    // Atualizar com os novos dados
    selectedDetails.value = {
      categoria,
      periodo: periodo.label,
      total: valor,
      items: details
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error)
    selectedDetails.value = {
      categoria,
      periodo: periodo.label,
      total: valor,
      items: []
    }
  } finally {
    detailsLoading.value = false
  }
}

const updateData = async () => {
  if (!dataInicio.value || !dataFim.value) return
  
  loading.value = true
  try {
    const result = await generateCashFlowData(dataInicio.value, dataFim.value)
    linhas.value = result.linhas
    periodos.value = result.periodos
  } finally {
    loading.value = false
  }
}

watch([dataInicio, dataFim], updateData, { immediate: true })
</script>

<style scoped>
.cash-flow-view {
  padding: 1.5rem;
}

.summary-section {
  margin-bottom: 2rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 12px rgba(26, 54, 93, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(26, 54, 93, 0.12);
}

.summary-card.success {
  border-left-color: var(--success-color);
}

.summary-card.warning {
  border-left-color: var(--warning-color);
}

.summary-card.danger {
  border-left-color: var(--danger-color);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.summary-card.success .card-icon {
  background: linear-gradient(135deg, var(--success-color), var(--success-dark));
}

.summary-card.warning .card-icon {
  background: linear-gradient(135deg, var(--warning-color), var(--warning-dark));
}

.summary-card.danger .card-icon {
  background: linear-gradient(135deg, var(--danger-color), var(--danger-dark));
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.8rem;
  color: var(--neutral-500);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.card-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.period-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-600);
  font-size: 0.9rem;
  font-weight: 500;
  background: var(--neutral-50);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(26, 54, 93, 0.08);
}

.cash-flow-table :deep(.p-datatable-thead > tr > th) {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  border: none;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.cash-flow-table :deep(.current-month-column th) {
  background: var(--primary-light);
  color: white;
}

.cash-flow-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-color: var(--neutral-200);
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.category-name {
  font-weight: 500;
  color: var(--primary-color);
}

.value-cell {
  cursor: default;
  text-align: right;
}

.total-cell {
  text-align: right;
  background: var(--neutral-50);
  border-radius: 6px;
  padding: 0.5rem;
}

.clickable-value {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.clickable-value:hover {
  background: var(--primary-light);
  color: white;
  transform: scale(1.05);
}

.details-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, var(--neutral-50) 0%, var(--neutral-100) 100%);
  border-bottom: 1px solid var(--neutral-200);
  color: var(--primary-color);
}

.details-content {
  padding: 1rem 0;
}

.details-summary {
  background: var(--neutral-50);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  border: 1px solid var(--neutral-200);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--neutral-500);
  font-weight: 500;
}

.summary-value {
  font-weight: 600;
  color: var(--primary-color);
}

.details-table {
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .details-summary {
    grid-template-columns: 1fr;
  }
}
</style>