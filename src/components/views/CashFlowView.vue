<template>
  <div class="cash-flow-view">
    <!-- Seção de Valores no Topo -->
    <div class="top-values-section">
      <div class="values-grid">
        <div class="value-card realizado">
          <div class="value-label">Total Realizado</div>
          <div class="value-amount">
            <ValueDisplay :value="totals.realizado" type="currency" emphasis />
          </div>
        </div>
        
        <div class="value-card previsto">
          <div class="value-label">Total Previsto</div>
          <div class="value-amount">
            <ValueDisplay :value="totals.previsto" type="currency" emphasis />
          </div>
        </div>
        
        <div class="value-card saldo" :class="totals.saldo >= 0 ? 'positive' : 'negative'">
          <div class="value-label">Saldo Final</div>
          <div class="value-amount">
            <ValueDisplay :value="totals.saldo" type="currency" emphasis />
          </div>
        </div>
        
        <div class="value-card periodo">
          <div class="value-label">Período</div>
          <div class="value-period">
            <i class="pi pi-calendar"></i>
            {{ formatDateRange(dataInicio, dataFim) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Histórico de Períodos -->
    <div class="period-history">
      <div class="history-header">
        <h4>Histórico por Período</h4>
      </div>
      <div class="period-cards">
        <div 
          v-for="periodo in periodos.slice(0, 6)" 
          :key="periodo.key"
          class="period-card"
          :class="getPeriodCardClass(periodo)"
        >
          <div class="period-date">{{ periodo.shortLabel || periodo.label }}</div>
          <div class="period-type">{{ periodo.typeLabel }}</div>
          <div class="period-total">
            <ValueDisplay 
              :value="getPeriodTotal(periodo)" 
              type="currency" 
              :class="getValueClass(getPeriodTotal(periodo))"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Principal -->
    <div class="main-table-section">
      <div class="table-header">
        <h3>FLUXO DE CAIXA - {{ formatPeriodTitle(dataInicio, dataFim) }}</h3>
      </div>
      
      <div class="table-wrapper">
        <!-- Tarjas Coloridas -->
        <div class="column-bands">
          <div class="band-container">
            <div class="category-band"></div>
            <div 
              v-for="periodo in periodos" 
              :key="periodo.key"
              class="period-band"
              :class="getBandClass(periodo)"
            >
              <span class="band-label">{{ getBandLabel(periodo) }}</span>
            </div>
          </div>
        </div>

        <DataTable
          :value="linhas"
          class="compact-cash-flow-table"
          :paginator="false"
          responsiveLayout="scroll"
          showGridlines
          :loading="loading"
          :scrollable="true"
          scrollHeight="500px"
          size="small"
        >
          <Column field="categoria" header="Categoria" :frozen="true" style="min-width: 200px;">
            <template #body="{ data }">
              <div class="category-cell">
                <span class="category-name">{{ data.categoria }}</span>
              </div>
            </template>
          </Column>
          
          <Column 
            v-for="periodo in periodos" 
            :key="periodo.key"
            :field="periodo.key"
            :header="periodo.label"
            style="min-width: 80px; text-align: center;"
            :class="getPeriodColumnClass(periodo)"
          >
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
    </div>

    <!-- Dialog de Detalhes -->
    <Dialog 
      v-model:visible="showDetailsDialog" 
      :header="detailsTitle"
      :modal="true"
      :style="{ width: '95vw', maxWidth: '1200px' }"
      class="details-dialog"
    >
      <div class="details-content">
        <div class="details-summary">
          <div class="summary-info">
            <span class="summary-category">{{ selectedDetails.categoria }}</span>
            <span class="summary-period">{{ selectedDetails.periodo }}</span>
          </div>
          <div class="summary-total">
            <span class="total-label">Total:</span>
            <ValueDisplay :value="selectedDetails.total" type="currency" emphasis />
          </div>
        </div>

        <DataTable 
          :value="selectedDetails.items" 
          class="compact-details-table"
          :paginator="true"
          :rows="15"
          stripedRows
          showGridlines
          size="small"
        >
          <Column field="titulo" header="Título" style="min-width: 120px">
            <template #body="{ data }">
              <span class="detail-titulo">{{ data.titulo }}</span>
            </template>
          </Column>
          <Column field="documento" header="Documento" style="min-width: 80px">
            <template #body="{ data }">
              <span class="detail-documento">{{ data.documento }}</span>
            </template>
          </Column>
          <Column field="pessoa" header="Cliente/Fornecedor" style="min-width: 150px">
            <template #body="{ data }">
              <span class="detail-pessoa">{{ data.pessoa }}</span>
            </template>
          </Column>
          <Column field="emissao" header="Emissão" style="min-width: 80px">
            <template #body="{ data }">
              <DateDisplay :date="data.emissao" />
            </template>
          </Column>
          <Column field="data" header="Vencimento" style="min-width: 80px">
            <template #body="{ data }">
              <DateDisplay :date="data.data" />
            </template>
          </Column>
          <Column field="previsao" header="Previsão" style="min-width: 80px">
            <template #body="{ data }">
              <DateDisplay :date="data.previsao" allowEmpty />
            </template>
          </Column>
          <Column field="valorBruto" header="Valor Bruto" style="min-width: 90px">
            <template #body="{ data }">
              <ValueDisplay :value="data.valorBruto" type="currency" />
            </template>
          </Column>
          <Column field="totalAberto" header="Total em Aberto" style="min-width: 100px">
            <template #body="{ data }">
              <ValueDisplay :value="data.totalAberto" type="currency" />
            </template>
          </Column>
          <Column field="status" header="Status" style="min-width: 80px">
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
  `Detalhes - ${selectedDetails.value.categoria}`
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
  
  const formatInicio = format(inicio, 'dd/MM/yy', { locale: ptBR })
  const formatFim = format(fim, 'dd/MM/yy', { locale: ptBR })
  
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

const getPeriodCardClass = (periodo) => {
  const classes = ['period-card']
  if (periodo.type === 'realizado') classes.push('realizado-card')
  if (periodo.type === 'previsto') classes.push('previsto-card')
  if (periodo.isCurrentMonth) classes.push('current-card')
  return classes.join(' ')
}

const getBandClass = (periodo) => {
  if (periodo.isCurrentMonth) return 'current-band'
  if (periodo.type === 'realizado') return 'realizado-band'
  return 'previsto-band'
}

const getBandLabel = (periodo) => {
  if (periodo.isCurrentMonth) return 'ATUAL'
  if (periodo.type === 'realizado') return 'REALIZADO'
  return 'PREVISTO'
}

const getPeriodTotal = (periodo) => {
  return linhas.value.reduce((sum, item) => sum + (item[periodo.key] || 0), 0)
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
    
    periodos.value = result.periodos.map(p => ({
      ...p,
      shortLabel: p.label.length > 6 ? p.label.substring(0, 6) : p.label,
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Seção de Valores no Topo */
.top-values-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.value-card {
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid;
  background: #f8f9fa;
}

.value-card.realizado {
  border-left-color: #28a745;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.value-card.previsto {
  border-left-color: #007bff;
  background: linear-gradient(135deg, #cce5ff 0%, #b3d9ff 100%);
}

.value-card.saldo.positive {
  border-left-color: #28a745;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.value-card.saldo.negative {
  border-left-color: #dc3545;
  background: linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%);
}

.value-card.periodo {
  border-left-color: #6c757d;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
}

.value-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.value-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a365d;
}

.value-period {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}

/* Histórico de Períodos */
.period-history {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-header h4 {
  margin: 0 0 1rem 0;
  color: #1a365d;
  font-size: 1rem;
  font-weight: 600;
}

.period-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.period-card {
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  border: 2px solid;
  background: white;
}

.period-card.realizado-card {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff9 0%, #d4edda 100%);
}

.period-card.previsto-card {
  border-color: #007bff;
  background: linear-gradient(135deg, #f8fcff 0%, #cce5ff 100%);
}

.period-card.current-card {
  border-color: #ffc107;
  background: linear-gradient(135deg, #fffdf5 0%, #fff3cd 100%);
}

.period-date {
  font-size: 0.75rem;
  font-weight: 600;
  color: #495057;
}

.period-type {
  font-size: 0.65rem;
  color: #6c757d;
  margin: 0.25rem 0;
}

.period-total {
  font-size: 0.8rem;
  font-weight: 700;
}

/* Tabela Principal */
.main-table-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  background: #4a90e2;
  color: white;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #357abd;
}

.table-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-wrapper {
  position: relative;
}

/* Tarjas Coloridas */
.column-bands {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid #dee2e6;
}

.band-container {
  display: flex;
  height: 25px;
}

.category-band {
  min-width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.period-band {
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #dee2e6;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.period-band.realizado-band {
  background: #28a745;
}

.period-band.previsto-band {
  background: #007bff;
}

.period-band.current-band {
  background: #ffc107;
  color: #212529;
}

/* Tabela Compacta */
.compact-cash-flow-table :deep(.p-datatable-thead > tr > th) {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  border: 1px solid #dee2e6;
  padding: 0.4rem;
  font-size: 0.7rem;
  text-align: center;
  vertical-align: middle;
}

.compact-cash-flow-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.3rem;
  border: 1px solid #dee2e6;
  font-size: 0.7rem;
  vertical-align: middle;
}

.compact-cash-flow-table :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #f8f9fa;
}

.compact-cash-flow-table :deep(.p-datatable-tbody > tr:hover) {
  background: #e3f2fd;
}

.category-cell {
  font-weight: 500;
  color: #495057;
  font-size: 0.7rem;
}

.value-cell {
  text-align: center;
  cursor: default;
  padding: 0.2rem;
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

/* Dialog de Detalhes */
.details-dialog :deep(.p-dialog-header) {
  background: #4a90e2;
  color: white;
  border-bottom: 1px solid #357abd;
  padding: 1rem;
}

.details-content {
  padding: 0;
}

.details-summary {
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 2px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-category {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.summary-period {
  font-size: 0.8rem;
  color: #6c757d;
}

.summary-total {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-label {
  font-size: 0.8rem;
  color: #6c757d;
}

.compact-details-table :deep(.p-datatable-thead > tr > th) {
  background: #e9ecef;
  color: #495057;
  font-weight: 600;
  border: 1px solid #dee2e6;
  padding: 0.5rem;
  font-size: 0.7rem;
}

.compact-details-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.4rem;
  border: 1px solid #dee2e6;
  font-size: 0.7rem;
}

.detail-titulo,
.detail-documento,
.detail-pessoa {
  font-size: 0.7rem;
  color: #495057;
}

.status-tag {
  font-size: 0.6rem;
  padding: 0.2rem 0.4rem;
}

@media (max-width: 768px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
  
  .period-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .details-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .compact-cash-flow-table :deep(.p-datatable-thead > tr > th),
  .compact-cash-flow-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.2rem;
    font-size: 0.65rem;
  }
}
</style>