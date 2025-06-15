<template>
  <div class="cash-flow-view">
    <div class="view-header">
      <div class="view-title">
        <h3>Fluxo de Caixa Diário</h3>
        <p class="view-subtitle">
          Período: {{ formatDateRange(dataInicio, dataFim) }}
        </p>
      </div>
    </div>

    <div class="summary-cards">
      <SummaryCard
        title="Total Realizado"
        :value="totals.realizado"
        icon="pi pi-check-circle"
        color="success"
      />
      <SummaryCard
        title="Total Previsto"
        :value="totals.previsto"
        icon="pi pi-clock"
        color="warning"
      />
      <SummaryCard
        title="Saldo Total"
        :value="totals.saldo"
        icon="pi pi-wallet"
        :color="totals.saldo >= 0 ? 'success' : 'danger'"
      />
    </div>

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
      <Column field="categoria" header="Categoria" :frozen="true" style="min-width: 250px">
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
        style="min-width: 120px"
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
      
      <Column field="total" header="Total" style="min-width: 150px" :frozen="true" alignFrozen="right">
        <template #body="{ data }">
          <ValueDisplay :value="data.total" type="currency" emphasis />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog de Detalhes -->
    <Dialog 
      v-model:visible="showDetailsDialog" 
      :header="detailsTitle"
      :modal="true"
      :style="{ width: '600px' }"
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
        >
          <Column field="data" header="Data" style="min-width: 100px">
            <template #body="{ data }">
              <DateDisplay :date="data.data" />
            </template>
          </Column>
          <Column field="pessoa" header="Pessoa" style="min-width: 150px" />
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
import SummaryCard from '../common/SummaryCard.vue'
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
    periodos.value = result.periodos
  } finally {
    loading.value = false
  }
}

watch([dataInicio, dataFim], updateData, { immediate: true })
</script>

<style scoped>
.cash-flow-view {
  padding: 2rem;
}

.view-header {
  margin-bottom: 2rem;
}

.view-title h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.view-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cash-flow-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.cash-flow-table :deep(.p-datatable-thead > tr > th) {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  border: none;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.cash-flow-table :deep(.current-month-column th) {
  background: #dbeafe;
  color: #1e40af;
}

.cash-flow-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-color: #f1f5f9;
}

.category-cell {
  display: flex;
  align-items: center;
}

.category-name {
  font-weight: 500;
  color: #334155;
}

.value-cell {
  cursor: default;
}

.clickable-value {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-value:hover {
  background: #f8fafc;
  border-radius: 4px;
  padding: 0.25rem;
  margin: -0.25rem;
}

.details-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
}

.details-content {
  padding: 1rem 0;
}

.details-summary {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  font-weight: 600;
  color: #334155;
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