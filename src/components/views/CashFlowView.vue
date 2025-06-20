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
      <div class="table-header">
        <h3 class="table-title">FLUXO DE CAIXA - {{ formatPeriodTitle(dataInicio, dataFim) }}</h3>
      </div>
      
      <DataTable
        :value="linhas"
        class="cash-flow-table"
        :paginator="false"
        responsiveLayout="scroll"
        showGridlines
        :loading="loading"
        :scrollable="true"
        scrollHeight="600px"
        size="small"
      >
        <Column field="categoria" header="Categoria" :frozen="true" style="min-width: 280px; background: #f8f9fa;">
          <template #body="{ data }">
            <div class="category-cell">
              <span class="category-name">{{ data.categoria }}</span>
              <div class="category-total">
                <ValueDisplay :value="data.total" type="currency" :class="getValueClass(data.total)" />
              </div>
            </div>
          </template>
        </Column>
        
        <Column 
          v-for="periodo in periodos" 
          :key="periodo.key"
          :field="periodo.key"
          :header="periodo.label"
          style="min-width: 100px; text-align: center;"
          :class="getPeriodColumnClass(periodo)"
        >
          <template #header>
            <div class="period-header">
              <div class="period-date">{{ periodo.shortLabel || periodo.label }}</div>
              <div class="period-type">{{ periodo.typeLabel }}</div>
            </div>
          </template>
          <template #body="{ data }">
            <div 
              class="value-cell" 
              @click="showDetails(data.categoria, periodo, data[periodo.key])"
              :class="{ 'clickable-value': data[periodo.key] !== 0 }"
            >
              <ValueDisplay 
                :value="data[periodo.key] || 0" 
                type="currency" 
                :class="getValueClass(data[periodo.key] || 0)"
              />
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
      :style="{ width: '900px' }"
      class="details-dialog"
    >
      <div class="details-content">
        <div class="details-header">
          <div class="details-title">{{ selectedDetails.categoria }}</div>
          <div class="details-period">{{ selectedDetails.periodo }}</div>
          <div class="details-total">
            <span class="total-label">Total:</span>
            <ValueDisplay :value="selectedDetails.total" type="currency" emphasis :class="getValueClass(selectedDetails.total)" />
          </div>
        </div>

        <DataTable 
          :value="selectedDetails.items" 
          class="details-table"
          :paginator="true"
          :rows="15"
          stripedRows
          showGridlines
          size="small"
        >
          <Column field="titulo" header="Título" style="min-width: 120px">
            <template #body="{ data }">
              <span class="detail-titulo">{{ data.titulo || 'RPS ' + (data.documento || '') }}</span>
            </template>
          </Column>
          <Column field="documento" header="Documento" style="min-width: 100px">
            <template #body="{ data }">
              <span class="detail-documento">{{ data.documento || '-' }}</span>
            </template>
          </Column>
          <Column field="pessoa" header="Cliente / Fornecedor" style="min-width: 200px">
            <template #body="{ data }">
              <span class="detail-pessoa">{{ data.pessoa }}</span>
            </template>
          </Column>
          <Column field="data" header="Emissão" style="min-width: 90px">
            <template #body="{ data }">
              <DateDisplay :date="data.emissao" />
            </template>
          </Column>
          <Column field="data" header="Vencimento" style="min-width: 90px">
            <template #body="{ data }">
              <DateDisplay :date="data.data" />
            </template>
          </Column>
          <Column field="previsao" header="Previsão" style="min-width: 90px">
            <template #body="{ data }">
              <DateDisplay :date="data.previsao" allowEmpty />
            </template>
          </Column>
          <Column field="valor" header="Valor Bruto" style="min-width: 110px">
            <template #body="{ data }">
              <ValueDisplay :value="data.valorBruto || data.valor" type="currency" :class="getValueClass(data.valorBruto || data.valor)" />
            </template>
          </Column>
          <Column field="totalAberto" header="Total em Aberto" style="min-width: 120px">
            <template #body="{ data }">
              <ValueDisplay :value="data.totalAberto || data.valor" type="currency" :class="getValueClass(data.totalAberto || data.valor)" />
            </template>
          </Column>
          <Column field="status" header="Status" style="min-width: 100px">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="data.status === 'Realizado' ? 'success' : 'warning'"
                class="status-tag"
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

const formatDateRange = (inicio, fim) => {
  if (!inicio || !fim) return ''
  
  const formatInicio = format(inicio, 'dd/MM/yyyy', { locale: ptBR })
  const formatFim = format(fim, 'dd/MM/yyyy', { locale: ptBR })
  
  return `${formatInicio} - ${formatFim}`
}

const formatPeriodTitle = (inicio, fim) => {
  if (!inicio || !fim) return ''
  
  return format(inicio, 'MMMM/yyyy', { locale: ptBR }).toUpperCase()
}

const getValueClass = (value) => {
  if (value > 0) return 'positive-value'
  if (value < 0) return 'negative-value'
  return 'neutral-value'
}

const getPeriodColumnClass = (periodo) => {
  const classes = ['period-column']
  if (periodo.type === 'realizado') classes.push('realizado-column')
  if (periodo.type === 'previsto') classes.push('previsto-column')
  if (periodo.isCurrentMonth) classes.push('current-month-column')
  return classes.join(' ')
}

const showDetails = async (categoria, periodo, valor) => {
  if (valor === 0) return
  
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
    const result = await generateCashFlowData(dataInicio.value, dataFim.value)
    linhas.value = result.linhas
    
    // Adicionar labels curtos e tipos para os períodos
    periodos.value = result.periodos.map(p => ({
      ...p,
      shortLabel: p.label.length > 8 ? p.label.substring(0, 8) : p.label,
      typeLabel: p.type === 'realizado' ? 'Realizado' : 'Previsto'
    }))
  } finally {
    loading.value = false
  }
}

watch([dataInicio, dataFim], updateData, { immediate: true })
</script>

<style scoped>
.cash-flow-view {
  padding: 1rem;
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-left: 4px solid;
}

.summary-card.success {
  border-left-color: #28a745;
}

.summary-card.warning {
  border-left-color: #ffc107;
}

.summary-card.danger {
  border-left-color: #dc3545;
}

.card-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
}

.summary-card.success .card-icon {
  background: #28a745;
}

.summary-card.warning .card-icon {
  background: #ffc107;
}

.summary-card.danger .card-icon {
  background: #dc3545;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.card-value {
  font-size: 1rem;
  font-weight: 700;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}

.table-header {
  background: #4a90e2;
  color: white;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #357abd;
}

.table-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cash-flow-table :deep(.p-datatable-thead > tr > th) {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  border: 1px solid #dee2e6;
  padding: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  vertical-align: middle;
}

.cash-flow-table :deep(.realizado-column th) {
  background: #d4edda;
  color: #155724;
}

.cash-flow-table :deep(.previsto-column th) {
  background: #fff3cd;
  color: #856404;
}

.cash-flow-table :deep(.current-month-column th) {
  background: #cce5ff;
  color: #004085;
  font-weight: 700;
}

.cash-flow-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.4rem;
  border: 1px solid #dee2e6;
  font-size: 0.75rem;
  vertical-align: middle;
}

.cash-flow-table :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #f8f9fa;
}

.cash-flow-table :deep(.p-datatable-tbody > tr:hover) {
  background: #e3f2fd;
}

.period-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.period-date {
  font-weight: 600;
  font-size: 0.7rem;
}

.period-type {
  font-size: 0.6rem;
  opacity: 0.8;
  font-weight: 400;
}

.category-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.category-name {
  font-weight: 500;
  color: #495057;
  font-size: 0.75rem;
  flex: 1;
}

.category-total {
  font-weight: 600;
  font-size: 0.7rem;
}

.value-cell {
  text-align: center;
  cursor: default;
  padding: 0.25rem;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.clickable-value {
  cursor: pointer;
}

.clickable-value:hover {
  background: #007bff;
  color: white;
  transform: scale(1.05);
}

.positive-value {
  color: #28a745 !important;
  font-weight: 600;
}

.negative-value {
  color: #dc3545 !important;
  font-weight: 600;
}

.neutral-value {
  color: #6c757d !important;
}

.details-dialog :deep(.p-dialog-header) {
  background: #4a90e2;
  color: white;
  border-bottom: 1px solid #357abd;
  padding: 1rem;
}

.details-dialog :deep(.p-dialog-title) {
  font-size: 1rem;
  font-weight: 600;
}

.details-content {
  padding: 0;
}

.details-header {
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 2px solid #dee2e6;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
}

.details-title {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.details-period {
  font-size: 0.8rem;
  color: #6c757d;
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.details-total {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-label {
  font-size: 0.8rem;
  color: #6c757d;
}

.details-table {
  border: none;
}

.details-table :deep(.p-datatable-thead > tr > th) {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  border: 1px solid #dee2e6;
  padding: 0.5rem;
  font-size: 0.75rem;
}

.details-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  font-size: 0.75rem;
}

.details-table :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #f8f9fa;
}

.detail-titulo,
.detail-documento,
.detail-pessoa {
  font-size: 0.75rem;
  color: #495057;
}

.status-tag {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .details-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .cash-flow-table :deep(.p-datatable-thead > tr > th),
  .cash-flow-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.25rem;
    font-size: 0.7rem;
  }
}
</style>